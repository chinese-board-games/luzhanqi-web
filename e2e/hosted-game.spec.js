import { test, expect } from '@playwright/test';

/**
 * Drives a complete two-player hosted game against a running deployment:
 * host creates a room, guest joins by code, both place boards, moves are
 * exchanged over the socket, and the game ends via forfeit.
 *
 * This is the gate promote.yml runs before fast-forwarding `production`, so
 * it deliberately exercises the paths a plain HTTP smoke test can't see -
 * anything that only fails after hydration, and anything that only fails for
 * the joining player.
 */

// distinguishes the games this suite leaves behind in the staging database
const runId = process.env.GITHUB_RUN_ID || `local-${Date.now()}`;
const HOST_NAME = `e2e-host-${runId}`.slice(0, 40);
const GUEST_NAME = `e2e-guest-${runId}`.slice(0, 40);

/**
 * Language is detected from localStorage then navigator (see src/i18n/index.js),
 * so without pinning it the run would depend on the CI runner's locale. The
 * suite selects by test id rather than copy, but pinning keeps failure
 * screenshots readable.
 */
async function newPage(browser) {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.localStorage.setItem('luzhanqi:language', 'en');
  });
  return context.newPage();
}

/** Fills a board from the first built-in example rather than dragging 25 pieces. */
async function placeBoardFromExample(page) {
  await page.getByTestId('use-example').click();
  await page.getByTestId('use-example-1').click();
  // the button is disabled until every piece is placed, so this waiting for it
  // to enable is also the assertion that the example filled the board
  await expect(page.getByTestId('send-placement')).toBeEnabled();
  await page.getByTestId('send-placement').click();
}

/**
 * Each player sees the board from their own side, so the same square has
 * different coordinates in the two pages - mirrors rotateMove in
 * views/Game.jsx. It's an involution, so one direction covers both.
 */
const rotate = ([row, col]) => [11 - row, 4 - col];
const cellId = ([row, col]) => `cell-${row}-${col}`;
const parseCellId = (testId) => testId.replace('cell-', '').split('-').map(Number);

/**
 * Makes one legal move, discovering it from the DOM instead of hardcoding
 * coordinates so the spec survives changes to the example boards or the
 * movement rules.
 *
 * With nothing selected, a cell is enabled only when it holds one of your own
 * pieces (see positionDisabled in components/GameBoard), and selecting an
 * origin marks its legal destinations `movable`/`attackable`. So: try your
 * pieces until one lights up a destination, take it, confirm.
 *
 * @returns the [row, col] moved to, in the moving page's own orientation
 */
async function makeMove(page) {
  const ownPieces = page.locator('[data-testid^="cell-"][data-disabled="false"]');
  await expect(ownPieces.first()).toBeVisible();

  const count = await ownPieces.count();
  for (let i = 0; i < count; i += 1) {
    const origin = ownPieces.nth(i);
    const originId = await origin.getAttribute('data-testid');
    await origin.click();

    const destinations = page.locator('[data-state="movable"], [data-state="attackable"]');
    if ((await destinations.count()) === 0) {
      // no legal move from this piece - deselect and try the next one
      await page.getByTestId(originId).click();
      continue;
    }

    const destination = destinations.first();
    const destinationId = await destination.getAttribute('data-testid');
    await destination.click();
    await page.getByTestId('confirm-move').click();
    return parseCellId(destinationId);
  }

  throw new Error("No legal move found for any of this player's pieces");
}

test('two players can host, join, set up, move, and finish a game', async ({ browser }) => {
  const host = await newPage(browser);
  const guest = await newPage(browser);

  await test.step('host creates a game', async () => {
    await host.goto('/');
    await host.getByTestId('create-player-name').fill(HOST_NAME);
    // leave the vs-AI checkbox unchecked - this is a two-human game
    await host.getByTestId('create-submit').click();
    await expect(host).toHaveURL(/\/game\/[a-f0-9]{24}/);
  });

  const joinCode = await test.step('host sees a join code', async () => {
    const code = host.getByTestId('join-code');
    await expect(code).toBeVisible();
    return (await code.innerText()).trim();
  });

  await test.step('guest joins with the code', async () => {
    await guest.goto('/');
    await guest.getByTestId('join-player-name').fill(GUEST_NAME);
    await guest.getByTestId('join-room-code').fill(joinCode);
    await guest.getByTestId('join-submit').click();
    await expect(guest).toHaveURL(/\/game\/[a-f0-9]{24}/);
  });

  await test.step('both players see each other in the room', async () => {
    for (const page of [host, guest]) {
      await expect(page.getByTestId(`player-${HOST_NAME}`)).toBeVisible();
      await expect(page.getByTestId(`player-${GUEST_NAME}`)).toBeVisible();
    }
  });

  await test.step('host starts the game and both reach board setup', async () => {
    await host.getByTestId('room-full').click();
    for (const page of [host, guest]) {
      await expect(page.getByTestId('use-example')).toBeVisible();
    }
  });

  await test.step('both players submit a board', async () => {
    await placeBoardFromExample(host);
    await placeBoardFromExample(guest);
    // once both are in, the game advances to play and the board renders for
    // both sides - the guest reaching this point is the regression that broke
    // when its roomId held the join code instead of the game id
    for (const page of [host, guest]) {
      await expect(page.getByTestId('forfeit')).toBeVisible();
      await expect(page.locator('[data-testid^="cell-"]').first()).toBeVisible();
    }
  });

  await test.step('escape clears a selected piece', async () => {
    // the keydown listener reads the current selection, so this catches it
    // being bound to a stale one as well as not being bound at all
    const ownPiece = host.locator('[data-testid^="cell-"][data-disabled="false"]').first();
    const pieceId = await ownPiece.getAttribute('data-testid');
    await ownPiece.click();
    await expect(host.getByTestId(pieceId)).toHaveAttribute('data-state', 'origin');

    await host.keyboard.press('Escape');
    await expect(host.getByTestId(pieceId)).not.toHaveAttribute('data-state', 'origin');
  });

  await test.step('players exchange moves over the socket', async () => {
    // the host holds even turns and the game starts at turn 0, so the host
    // moves first (see isTurn in views/Game.jsx). Asserting the move lands on
    // the *other* page is what proves the socket round-trip, and asserting it
    // lands on the rotated square proves each side's own orientation.
    const hostTarget = await makeMove(host);
    await expect(guest.getByTestId(cellId(rotate(hostTarget)))).toHaveAttribute(
      'data-state',
      'lastMove'
    );

    const guestTarget = await makeMove(guest);
    await expect(host.getByTestId(cellId(rotate(guestTarget)))).toHaveAttribute(
      'data-state',
      'lastMove'
    );
  });

  await test.step('a forfeit ends the game for both players', async () => {
    await guest.getByTestId('forfeit').click();
    for (const page of [host, guest]) {
      await expect(page.getByTestId('game-over')).toBeVisible();
      await expect(page.getByTestId('game-over-outcome')).not.toBeEmpty();
    }
  });
});
