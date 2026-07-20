# Contributing to luzhanqi-web

## Workflow

1. Branch off `main` (`type/short-description`, e.g. `fix/last-move-arrow`,
   `feat/rule-variant-toggle`, `chore/dep-bump`, `docs/...`).
2. Open a PR into `main`. CI (`.github/workflows/ci.yml`: lint, build,
   `npm test`) must pass — it's a required status check, so the merge
   button stays disabled until it's green.
3. Use [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`, optionally
   with a scope) for commit messages and PR titles.
4. Merge (this repo uses merge commits, not squash/rebase, so `git log`
   keeps a per-PR merge commit).

That's it from a contributor's side — everything after merge is automatic.
See `AGENTS.md`'s "Deployment" section for what happens next (staging
deploy → automated smoke test → promotion to production), and never push
directly to the `production` branch, which only the promotion workflow
should touch.

## Local development

- `npm install`, then `npm run start` — Vite dev server. See `README.md`
  for the required `.env`/`.env.local`.
- There's no real automated test suite yet (`npm test` is a placeholder) —
  **verify UI changes by actually running the app and driving the feature
  in a browser**, not just by reading the diff. Send/take a screenshot for
  anything visual.
- `npm run lint` / `npm run build` — same checks CI runs, useful to run
  locally before pushing.

## Getting oriented

Start with `AGENTS.md` — it covers the codebase layout, the
authentication model, the optimistic-move/board-orientation gameplay data
flow, and known gotchas (stale closures in `GameContext`, Mantine v7's
Emotion requirement, etc.) worth reading before touching game logic, auth,
or the board UI.
