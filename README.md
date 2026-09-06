# SWOOP - Year 5-6 STEM Launchpad

A 50-minute MakeCode Arcade taster for about 22 students, one school laptop each,
with one teacher. Students catch the crow's shiny loot, dodge swoops and make the
game their own. The aim is excitement about creating, testing and learning at
Meridan, with one owned change, one prediction/test and one thing to explain.

## Ready-to-use resources

- `swoop/`: the editable starter, opening in Blocks.
- `Recovery/SWOOP-starter.png`: importable starter project for preloading.
- `Recovery/SWOOP-checkpoint.png`: importable recovery project with 700 ms loot,
  fall speed 60 and a win at score 15. `Recovery/SWOOP-checkpoint/` holds its source.
- `Printables/Mission Cards.pdf`: three A4 sheets, six cards including STUCK.
- `Printables/Teacher Run Sheet.pdf`: two A4 pages with the agreed timing,
  recovery guidance, extension support and save/reopen instructions.
- The matching HTML files are the print sources; `Printables/img/` holds real
  editor screenshots. Keep these standalone rather than pasting into an LMS
  that strips their CSS.

Use MakeCode Arcade **Import → Import File** to open a project PNG. These files
contain the code; an ordinary screenshot of the game does not. Save a student's
current work before opening a recovery copy. The checkpoint is a fresh working
version, not a restoration of that student's customisations.

## Approved refinements implemented - 6 September 2026

The first two blocks in `on start` remain the tuning numbers. The sky and bucket
creation now follow immediately, before long image arrays. Scenery is explicitly drawn behind the sprites. Event stacks have
space between them. The opening view was checked at 1366 × 768; students still
need a quick demonstration of panning and zooming to reach other events.

A nearby first item offers an early catch. After a crow hit, **SAFE** text and
particles mark one second of protection. Further crow overlaps cannot remove
life during that second, and catching still works. Protection is starter support,
not another required mission. Default gameplay remains quiet.

The cards now explain standalone events correctly, give specific undo and
catcher recovery steps, and use names, colours and shapes for navigation.
Mission 5 has separate complete screenshots for startup scale/countdown and
sound inside the existing Player-Shiny catch event. Instructions explicitly
select `player`, scale 1.5 and background playback.

| Mission | Small success | Further design challenge |
|---|---|---|
| 1 - Make it yours | Recolour some bucket pixels OR change the sky; test | Draw a catcher and test visibility and collisions |
| 2 - Find your fun | Predict, change one number, test for 20 seconds | Compare relaxed and frantic versions over equal play periods |
| 3 - Give it a win | Add the score event with WIN inside; test at 2, then choose a target | Tune a target using a partner's feedback |
| 4 - Change the challenge | Duplicate the whole crow event and retime it | Make the extra crow stream fair as well as challenging |
| 5 - Your twist | Choose one illustrated option: loot, scale, sound or timer | Plan an original feature using event, state and action hints |

An erased catcher has no solid pixels to collide with. Shape and size edits can
change play. Reversing a crow is advanced: use a separate frame list, flip both
frames, select that list in the copied animation, and change x to 166 and vx to
-72. Changing the shared original frame list changes both streams.

## Agreed 50-minute flow

| Time | Activity |
|---|---|
| 0-3 | Play with a short controls/restart instruction |
| 3-5 | Welcome, design brief and workspace navigation |
| 5-10 | Make one visible change |
| 10-18 | Predict, tune and test |
| 18-25 | Add and test a win |
| 25-37 | Choose a challenge or continue the current change |
| 37-43 | Partner playtest and one refinement |
| 43-47 | Keep each student's customised game |
| 47-50 | Celebrate varied successes and connect to future STEM challenges |

Missions 1-3 are the supported route, not a completion guarantee. Choices and
extensions are available early. Protect the closing three minutes.

## Verification and remaining classroom checks

The revised starter and focused gameplay variants compile against Arcade 4.1.17.
The real editor opens the starter in Blocks without unsupported blocks. Focused
runtime checks cover simultaneous hits, catching while protected, another hit
during protection, damage after expiry, an early catch, combined missions,
Mission 5 add-ons and countdown expiry. The test report and evidence are in
`QA/Refinements Verification.md` and `QA/refinements/`.

Earlier automated scores and survival times are historical observations, not
predictions of children's performance. Random spawns and input policies affect
outcomes. `QA/QA Review.md` records the original findings; the new verification
report records their implementation.

Before delivery, run these checks on an actual school laptop/student profile:

- Open the starter; confirm the first edit and the right-click gesture.
- Make a visible change, save its project PNG with the icon beside the project
  name, import it in a fresh profile, and check the change and gameplay.
- Rehearse the school-approved file collection and take-home route. Do not assume
  student email access. If using share links, test them and share again after edits.
- Walk one novice through editing, restarting and recovery; use that to tune pace.
- Print one cut set at 100% and check readability; test any classroom audio.

Desktop checks cannot establish school-network access, managed-profile
permissions, physical print quality or novice completion times. There is no public
starter share URL; the project PNG files support local preloading and recovery.

## Printing

Print both PDFs on A4, portrait, **100% scale, single-sided**. The cards have a cut
line at 148.5 mm: one straight cut across each sheet. A full set is three sheets;
22 individual sets require 66 sheets. Essential settings and placement instructions
are in the main text, with screenshots for orientation.

Rebuild the PDFs from the repository root with WeasyPrint, then render all pages
with Poppler and inspect layout before distributing:

```bash
weasyprint 'Printables/Mission Cards.html' 'Printables/Mission Cards.pdf'
weasyprint 'Printables/Teacher Run Sheet.html' 'Printables/Teacher Run Sheet.pdf'
```

## Build and maintenance

`main.blocks` defines the student view; `main.ts` is its generated TypeScript.
Keep both in sync through the real editor. The displayed Blocks variable is
`player`; the generated TypeScript name is `player2`. `pxt.json` selects Blocks.
Keep the starter README and assets file minimal to avoid an opening information
panel. The older `HANDOFF.md` is historical; this README and the run sheet are the
current delivery guidance.

Build in a **scratch directory**, not in `tools/` or the delivered starter:

```bash
mkdir -p /tmp/swoop-build
cd /tmp/swoop-build
npm install makecode playwright
npx playwright install chromium
npx makecode init arcade
```

Copy `pxt.json`, `main.ts`, `main.blocks`, `README.md` and `assets.json` from
`swoop/` into that scratch directory (replacing the initial sample). Then run:

```bash
npx makecode build
npx makecode serve --port 7788
```

`tools/variant.py` reads the delivered starter and writes a variant to the current
scratch directory; supply `dropEvery=700 fallSpeed=60 EXTRA=missions/m3.ts` as
needed. `tools/main.template.ts` and `ground.txt` remain an optional rendering
source and must track the delivered game. `tools/cardshots/README.md` describes
the real-editor screenshot pipeline. `QA/replay/README.md` documents the original
and revised tests. Never leave a file-watching server running while generating
multiple test variants. Disable browser background throttling for simulator tests.

Official save/export guidance: [project PNG export](https://arcade.makecode.com/publishing-games),
[import walkthrough](https://arcade.makecode.com/courses/csintro1/intro/makecode-orientation),
[sharing snapshots](https://arcade.makecode.com/share).
