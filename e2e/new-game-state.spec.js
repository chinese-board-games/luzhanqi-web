import { test, expect } from '@playwright/test';
import {
  newPage,
  playerName,
  placeBoardFromExample,
  makeMove,
  hostGame,
  joinGame,
} from './helpers';

/**
 * Starting a second game without reloading has to begin from a clean slate.
 * Game state lives in a context that outlives any single game, so anything a
 * finished game leaves behind is still there when the next one starts - the
 * player sees another game's captures on a board they've just set up.
 */
test("a new game does not inherit the previous game's dead pieces", async ({ browser }) => {
  const host = await newPage(browser);
  const guest = await newPage(browser);

  await test.step('play a game until a piece is captured', async () => {
    await host.goto('/');
    await hostGame(host, playerName('host'));
    const joinCode = (await host.getByTestId('join-code').innerText()).trim();

    await guest.goto('/');
    await joinGame(guest, playerName('guest'), joinCode);

    await host.getByTestId('room-full').click();
    await expect(host.getByTestId('use-example')).toBeVisible();
    await placeBoardFromExample(host);
    await placeBoardFromExample(guest);
    await expect(host.getByTestId('forfeit')).toBeVisible();

    // attack across the front line so something actually dies
    await makeMove(host, { preferAttack: true });
    await expect(host.getByTestId('dead-pieces').locator('> *')).not.toHaveCount(0);
  });

  await test.step('end it and start a fresh game without reloading', async () => {
    await guest.getByTestId('forfeit').click();
    await expect(host.getByTestId('game-over')).toBeVisible();

    // in-app navigation, not page.goto - a reload would wipe the context state
    // this test is about
    await host.getByRole('button', { name: 'Return home' }).click();
    await expect(host.getByTestId('create-player-name')).toBeVisible();

    await hostGame(host, playerName('host2'), { vsAi: true });
    await placeBoardFromExample(host);
    await expect(host.getByTestId('forfeit')).toBeVisible();
  });

  await test.step('the new board starts with nothing captured', async () => {
    await expect(host.getByTestId('dead-pieces').locator('> *')).toHaveCount(0);
  });
});
