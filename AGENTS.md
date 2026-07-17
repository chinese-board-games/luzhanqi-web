# AGENTS.md — luzhanqi-web

React (v19) + Vite frontend for Luzhanqi, using Mantine v7 for UI,
socket.io-client for realtime gameplay, Firebase for optional auth, and
@dnd-kit for drag-and-drop piece placement. Installable as a PWA
(`vite-plugin-pwa`, auto-updating service worker).

## Commands

- `npm run start` — Vite dev server (`http://localhost:5173`)
- `npm run build` — production build (`vite build`)
- `npm run lint` / `npm run lint:fix` — ESLint across the repo
- `npm run format` — Prettier

There is no real test suite (`npm test` is a placeholder). Verify UI changes
by actually running the app and driving the feature in a browser. CI
(`.github/workflows/`) runs on Node 24.x.

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
  owns move-rotation/turn logic plus optimistic move application;
  `Menu.jsx` handles create/join/spectate, including the AI opponent's
  "Rules"/"Advanced" tabs)
- `src/contexts/GameContext.jsx` — the single source of truth for game
  state; owns the socket connection and every socket event handler
- `src/contexts/FirebaseContext.jsx` — Firebase Auth state; **never**
  fake/bypass this to get a logged-in user for testing (e.g. for a
  screenshot) — treat it as off-limits to modify for anything but real
  auth logic
- `src/components/GameBoard/` — the live gameplay board (move selection,
  last-move highlight, forfeit, the `MoveConfirmCard` popover that appears
  once both origin and destination are selected)
- `src/components/PieceInfoPanel/` — desktop-only sidebar (hidden below
  `DESKTOP_PANEL_BREAKPOINT`, currently 900px) showing hovered-piece info
  and, once a move is fully selected, the same combat-outcome prediction
  `MoveConfirmCard` shows — both read `outcomeMessages` from
  `PieceInfoPanel.jsx` and call `utils/predictOutcome.js`
- `src/components/BoardSetup/` — the piece-placement (setup phase) board;
  `HalfBoard.jsx`'s "Use Example" menu applies one of `data/exampleBoards.js`'s
  curated layouts
- `src/components/Position.jsx` / `SelectablePosition.jsx` — a single board
  tile; shading priority (origin > destination > attackable > movable >
  last-move > hover) lives in `SelectablePosition`'s `getShadeColor`. Only
  the last-move highlight should ease in/out (`isLastMove`-gated transition
  in `Position.jsx`) — a click-driven highlight must apply with no delay
- `src/components/ErrorBoundary/` — top-level React error boundary
  (wraps the whole app in `index.jsx`); shows a reload prompt instead of a
  blank white screen on an uncaught render error
- `src/data/pieceData.json` / `pieceInfo.js` — piece metadata (title/
  description/rules/icon) with parallel `*_zh` fields; `getPieceInfo(isEnglish)`
  picks between them. Every player-facing string in the app is gated on the
  `isEnglish` flag from `GameContext` (English or Traditional Chinese) —
  new UI text needs both.
- `src/theme.js` — Mantine theme plus custom responsive sizing tokens
  (`positionSizing`, `hqSizing`, `campSizing`, etc.), each with `md`/`sm`/
  `xs` variants

## Authentication

The client never sends a raw Firebase uid as a trust claim — it sends a
verified ID token and lets the server establish identity.

- `src/index.jsx` installs an axios request interceptor that attaches
  `Authorization: Bearer <token>` (via `getAuth().currentUser.getIdToken()`)
  to every REST call automatically, a no-op when nobody's logged in. New
  REST calls don't need to do anything extra to be authenticated.
- Socket emits that need to identify the caller send `idToken: user ? await
user.getIdToken() : null` (see `GameContext.jsx`'s `attemptRejoin`/
  `checkActiveGames`, or `Game.jsx`/`Menu.jsx`/`Lobby.jsx`/`NavBar.jsx`'s
  various emits) — never a raw `user.uid`. `user.uid` itself is still fine
  to use for local-only logic (React dependency arrays, deciding whether to
  call a function at all), just never as the payload proving identity to
  the server.

## Gameplay data flow

- **Optimistic moves**: `Game.jsx`'s `playerMakeMove` applies the move to
  local board state immediately via `utils/predictOutcome.js`'s
  `applyMoveOptimistically` (reusing the same combat-outcome classification
  `predictOutcome` uses for the UI preview), before the server round-trip
  resolves. `GameContext`'s `playerMadeMove` socket handler then overwrites
  local state with the authoritative board — this also silently corrects
  any case the optimistic guess couldn't resolve (e.g. attacking a
  still-fogged enemy piece, where the true outcome isn't knowable
  client-side).
- Because of this, **a rule-variant change must be mirrored in
  `predictOutcome.js`/`getSuccessors.js`** (this repo) to match
  `pieceMovement`/`getSuccessors.ts` (the backend) — a mismatch doesn't
  just make the outcome-prediction UI wrong, it makes the optimistic board
  update wrong too, until the server's correction arrives a moment later.
- **Board orientation.** The guest's board is rotated 180° client-side for
  display (`transformBoard` in `Game.jsx`); move coordinates sent to/from
  the server are always host-perspective and must be rotated
  (`rotateMove`) for a non-host client before display or before sending a
  move.

## Known gotchas

- **`GameContext`'s socket handlers close over stale state.** The `useEffect`
  that registers all `socket.on(...)` handlers has a narrow dependency
  array (`[roomId, errors]`), so it does not re-run when e.g. `playerName`
  or `isEnglish` changes. A handler that needs the _current_ value of some
  other piece of state should read it from a ref kept in sync via its own
  effect (see `playerNameRef`/`isEnglishRef`), not from the closed-over
  state variable directly — otherwise it'll silently use a stale value.
- **Mantine v7 needs the Emotion compat layer for `sx` to work.**
  `index.jsx` wraps the app in `MantineEmotionProvider` and passes
  `stylesTransform={emotionTransform}` to `MantineProvider` — Mantine 7
  dropped built-in Emotion support, and the `sx` prop (used throughout for
  ad hoc responsive styling) silently does nothing without this. Also
  needs an explicit `@mantine/core/styles.css` import (no longer automatic).
- **Responsive breakpoints are ad hoc, not Mantine's default system.**
  Small-screen handling is done via raw `@media (max-width: 450px)` /
  `(max-width: 375px)` queries inside `sx` props, matched against the
  `md`/`sm`/`xs` entries in `theme.js`'s sizing objects. If a new tile type
  or sizing object is added, it needs matching entries at all three
  breakpoints — a missing `xs` entry previously caused the board to
  overflow narrow phone screens.
- **Don't recreate a "shared empty board" module constant.** A prior bug
  (`HalfBoard.jsx`) built a single empty-board array once at module scope
  and reused it via `[...emptyBoard]` — that only shallow-copies the outer
  array, so writing into a cell of the "copy" mutated the shared row arrays
  for the rest of the browser tab's life. Always build a fresh board via a
  factory function (`makeEmptyBoard()`), not a shared constant.
- **Vite HMR and the socket connection.** `GameContext.jsx` closes the
  shared socket on `import.meta.hot.dispose` — without this, every hot
  reload during dev opens a new socket on top of the old one, which never
  gets closed (a no-op in production, where `import.meta.hot` doesn't
  exist).
- Deploys to Netlify (staging + prod); `VITE_API` is set per deploy context
  in Netlify's environment variable settings, not in this repo.
