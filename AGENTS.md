# AGENTS.md — luzhanqi-web

React (v17) + Vite frontend for Luzhanqi, using Mantine v5 for UI,
socket.io-client for realtime gameplay, Firebase for optional auth, and
@dnd-kit for drag-and-drop piece placement.

## Commands

- `npm run start` — Vite dev server (`http://localhost:5173`)
- `npm run build` — production build (`vite build`)
- `npm run lint` / `npm run lint:fix` — ESLint across the repo
- `npm run format` — Prettier

There is no real test suite (`npm test` is a placeholder). Verify UI changes
by actually running the app and driving the feature in a browser.

Needs a `.env`/`.env.local` with `VITE_API` pointing at a running
luzhanqi-backend instance (see README.md). Vite env vars are baked in at
**build** time — changing `VITE_API` requires a rebuild/redeploy, not just
an env var change on the host.

A pre-commit hook (husky + lint-staged) runs Prettier + ESLint (`--fix`) on
staged files.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
`fix:`, `refactor:`, `style:`, `docs:`, `chore:`, optionally with a scope).

## Layout

- `src/views/` — top-level pages (`Game.jsx` is the main game screen and
  owns move-rotation/turn logic; `Menu.jsx` handles create/join/spectate)
- `src/contexts/GameContext.jsx` — the single source of truth for game
  state; owns the socket connection and every socket event handler
- `src/components/GameBoard/` — the live gameplay board (move selection,
  last-move highlight, forfeit)
- `src/components/BoardSetup/` — the piece-placement (setup phase) board
- `src/components/Position.jsx` / `SelectablePosition.jsx` — a single board
  tile; shading priority (origin > destination > attackable > movable >
  last-move > hover) lives in `SelectablePosition`'s `getShadeColor`
- `src/theme.js` — Mantine theme plus custom responsive sizing tokens
  (`positionSizing`, `hqSizing`, `campSizing`, etc.), each with `md`/`sm`/
  `xs` variants

## Known gotchas

- **`GameContext`'s socket handlers close over stale state.** The `useEffect`
  that registers all `socket.on(...)` handlers has a narrow dependency
  array (`[roomId, errors]`), so it does not re-run when e.g. `playerName`
  changes. A handler that needs the _current_ value of some other piece of
  state should read it from a ref kept in sync via its own effect (see
  `playerNameRef`), not from the closed-over state variable directly —
  otherwise it'll silently use a stale value.
- **Responsive breakpoints are ad hoc, not Mantine's default system.**
  Small-screen handling is done via raw `@media (max-width: 450px)` /
  `(max-width: 375px)` queries inside `sx` props, matched against the
  `md`/`sm`/`xs` entries in `theme.js`'s sizing objects. If a new tile type
  or sizing object is added, it needs matching entries at all three
  breakpoints — a missing `xs` entry previously caused the board to
  overflow narrow phone screens.
- **Board orientation.** The guest's board is rotated 180° client-side for
  display (`transformBoard` in `Game.jsx`); move coordinates sent to/from
  the server are always host-perspective and must be rotated
  (`rotateMove`) for a non-host client before display or before sending a
  move.
- Deploys to Netlify (staging + prod); `VITE_API` is set per deploy context
  in Netlify's environment variable settings, not in this repo.
