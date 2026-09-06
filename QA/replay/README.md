# Replaying the QA

Run in a fresh scratch directory. These scripts overwrite scratch `main.ts`; do not run them inside `swoop/` or the repository root.

1. Install `makecode` and `playwright` with npm in the scratch directory, install Playwright Chromium, and run `makecode init arcade` there. The reviewed versions were Arcade 4.1.17, CLI 1.3.6, Node 22.23.0 and Playwright 1.63.0.
2. Copy `main.blocks`, `main.ts`, `README.md`, `assets.json` and `pxt.json` from the reviewed `swoop/` directory into that scratch directory. Copy the `.mjs` files from this folder into the scratch directory.
3. Run `./node_modules/.bin/makecode build` to check the uninstrumented delivered project against the real API.
4. Run `node build-variants.mjs`. This saves `original.ts`, creates fourteen configurations, adds a 100 ms telemetry event in the scratch build, compiles each to JavaScript and saves its binary. It restores the original source afterwards. Do not run a MakeCode file-watching server during this build, as concurrent rebuilds can race.
5. Start `./node_modules/.bin/makecode serve --port 7788` in a separate terminal. Then run `node run-tests.mjs` and `node run-refined.mjs` from the scratch directory. Each browser context receives its own compiled variant through request interception; input goes through the real simulator controller. Tests emit JSON, logs and screenshots under `evidence/`.
6. `node editor-roundtrip.mjs` loads the original project into a new disposable browser context, measures its saved layout, and checks the combined mission source back in Blocks. It uses the live MakeCode editor and may need adjustment if that editor changes. It does not publish a project.
7. Inspect screenshots as well as telemetry. End-game rendering can start before the next 100 ms log, so the last telemetry record may still say score 14 or life 1 even though the final screenshot shows a win at 15 or game over. Browser/audio/hardware conditions and random spawns affect scores and survival.

The controlled `doublehit` variant creates two crows at the player when the A button is pressed. This is a deliberate collision test, not an ordinary gameplay run. `blank` creates a fully transparent catcher. The shortened `countdown` case uses three seconds to test expiration. All other ordinary play runs move using controller input.

The first controller chases loot and dodges late; the second evaluates future crow positions. Their outcomes are observations, not child performance benchmarks. The saved source hashes identify the reviewed files. No test probes were inserted into the student project.

## Approved refinements regression checks

Use a fresh scratch project with the same dependencies and copied starter files
as above. Copy `build-refinements.mjs`, `run-refinements.mjs`,
`verify-refined-editor.mjs` and `save-reopen.mjs` here too. Copy
`tools/cardshots/snippets/08-m5-catch.ts` to scratch `m5-catch.ts`, and copy
`Recovery/SWOOP-checkpoint/` to scratch `checkpoint/`.

1. With no watching server running, run `node build-refinements.mjs`. It compiles
   five focused variants and restores the original source in a finally block.
2. Start `npx makecode serve --no-watch --port 7790`. Run `node run-refinements.mjs`. The
   protection case asserts one life lost for two simultaneous crows, a catch
   during protection, no additional damage within one second, and damage after
   expiry. Other cases cover early catching, combined missions, Mission 5 and
   countdown expiration. Inspect final win/loss screenshots as well as telemetry.
3. Finish the simulator runs before starting browser editor checks. Run `node verify-refined-editor.mjs`. It opens the starter at 1366 × 768,
   rejects intersecting top-level block bounds and exports `SWOOP-starter.png`.
4. Run `node save-reopen.mjs`. It imports that PNG in a fresh profile, checks
   exact starter TypeScript equality and specific optional arguments, exports
   the checkpoint, then imports it in another fresh profile. It rejects grey
   blocks or missing checkpoint settings. It never publishes a project.

The early editor attempt exposed a namespace-serialization problem: prefixed
`html:mutation` nodes silently lost optional arguments on reopening. The final
files preserve unprefixed mutation elements with their namespace declaration,
and the regression checks explicitly guard movement and effect durations.

Current evidence is in `QA/refinements/`; the earlier `QA/evidence/` folder remains
the historical review. Automated scores are observations, not novice benchmarks.
