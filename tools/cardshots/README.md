# Card-image pipeline

Every block picture on the mission cards is a screenshot of the **real** MakeCode
Arcade editor, not a drawing. These four scripts regenerate them.

Copy this folder into a scratch directory whose parent contains the installed
Playwright `node_modules`, after `npm install playwright` and
`npx playwright install chromium` there. Run scripts from the copied folder;
nothing is installed into the delivered project.

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

## Refined Mission 5 artwork

`07-m5-blocks.ts` contains player creation, scale and countdown inside on start.
`08-m5-catch.ts` contains sound inside the complete Player-Shiny catch event.
Copy their generated screenshots to `Printables/img/m5-start.png` and
`Printables/img/m5-catch.png`. Check the whole event heading and the full scale
block are visible. The old `m5-ideas.png` is historical and no longer used.

When adjusting exported block XML, preserve unprefixed HTML-namespace `mutation`
elements exactly. A prefixed form such as `html:mutation` is ignored by MakeCode
and can silently drop optional arguments. Verify the TypeScript after a real
project PNG export/import; a successful compile of the pre-export source is not
enough to catch this.
