import { expect } from '@playwright/test';

/**
 * Shared driving helpers for the e2e suite. Everything selects by test id
 * rather than copy, since the app detects one of 7 languages at runtime.
 */

// distinguishes the games the suite leaves behind in the staging database
export const runId = process.env.GITHUB_RUN_ID || `local-${Date.now()}`;
export const playerName = (role) => `e2e-${role}-${runId}`.slice(0, 40);

/**
 * Language is detected from localStorage then navigator (see src/i18n/index.js),
 * so without pinning it the run would depend on the CI runner's locale. The
 * suite selects by test id rather than copy, but pinning keeps failure
 * screenshots readable.
 */
export async function newPage(browser) {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.localStorage.setItem('luzhanqi:language', 'en');
  });
  return context.newPage();
}

/** Fills a board from the first built-in example rather than dragging 25 pieces. */
export async function placeBoardFromExample(page) {
  await page.getByTestId('use-example').click();
  await page.getByTestId('use-example-1').click();
  // the button is disabled until every piece is placed, so waiting for it to
  // enable is also the assertion that the example filled the board
  await expect(page.getByTestId('send-placement')).toBeEnabled();
  await page.getByTestId('send-placement').click();
}

/**
 * Each player sees the board from their own side, so the same square has
 * different coordinates in the two pages - mirrors rotateMove in
 * views/Game.jsx. It's an involution, so one direction covers both.
 */
export const rotate = ([row, col]) => [11 - row, 4 - col];
export const cellId = ([row, col]) => `cell-${row}-${col}`;
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
 * Pass preferAttack when the test needs a capture to actually happen.
 *
 * @returns the [row, col] moved to, in the moving page's own orientation
 */
export async function makeMove(page, { preferAttack = false } = {}) {
  const ownPieces = page.locator('[data-testid^="cell-"][data-disabled="false"]');
  await expect(ownPieces.first()).toBeVisible();

  const count = await ownPieces.count();
  for (let i = 0; i < count; i += 1) {
    const origin = ownPieces.nth(i);
    const originId = await origin.getAttribute('data-testid');
    await origin.click();

    const attackable = page.locator('[data-state="attackable"]');
    const anyDestination = page.locator('[data-state="movable"], [data-state="attackable"]');
    const destinations = preferAttack && (await attackable.count()) ? attackable : anyDestination;

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

/** Host creates a room and returns the join code shown in the lobby. */
export async function hostGame(page, name, { vsAi = false } = {}) {
  await page.getByTestId('create-player-name').fill(name);
  if (vsAi) {
    await page.getByTestId('create-vs-ai').check();
  }
  await page.getByTestId('create-submit').click();
  await expect(page).toHaveURL(/\/game\/[a-f0-9]{24}/);
}

/** Second player joins an existing room by its short code. */
export async function joinGame(page, name, joinCode) {
  await page.getByTestId('join-player-name').fill(name);
  await page.getByTestId('join-room-code').fill(joinCode);
  await page.getByTestId('join-submit').click();
  await expect(page).toHaveURL(/\/game\/[a-f0-9]{24}/);
}
