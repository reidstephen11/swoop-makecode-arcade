# Card-image pipeline

Every block picture on the mission cards is a screenshot of the **real** MakeCode
Arcade editor, not a drawing. These four scripts regenerate them.

Run from this folder, after `npm install playwright && npx playwright install chromium`
in a scratch directory (nothing is installed into the project).

| Script | What it does |
|---|---|
| `blockshot.mjs` | For each `snippets/*.ts`: pastes it into the JavaScript tab of `arcade.makecode.com`, switches to Blocks, and screenshots the block canvas at 3× for print. Also grabs the toolbox strip. |
| `interact.mjs` | The shots that need a click: the right-click → **Duplicate** menu (Mission 4) and the sky colour palette (Mission 1). |
| `loadproject-shot.mjs` | Injects the real `swoop/` project into the editor's IndexedDB and screenshots blocks from it — used for the `array of` loot block, which only exists in the project. Set `SWOOP_DIR` to the project path. |
| `toolbox-labels.mjs` | Dumps every block label in the Info / Sprites / Music / Game / Scene drawers. **Run this before changing card wording** — it is how the Mission 3 card was corrected (the `on score` block defaults to **100**, not 0) and the Mission 5 card (`set scale to` is the last block in the Sprites drawer; the loot block's `⊕` is at its bottom, not its end). |

Output lands in `out/`; crop, pad and copy into `Printables/img/` (see the PIL
snippets in the work log). Screenshots are taken at `deviceScaleFactor: 3` because
they are printed, not viewed.

**The editor needs a long settle.** Every script waits 16–24 s after load and
12–13 s after a tab switch. Shorter waits return an empty canvas.
