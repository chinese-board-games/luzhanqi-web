import { test, expect } from '@playwright/test';
import { newPage, playerName, placeBoardFromExample, makeMove, rotate, cellId } from './helpers';

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

const HOST_NAME = playerName('host');
const GUEST_NAME = playerName('guest');

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
