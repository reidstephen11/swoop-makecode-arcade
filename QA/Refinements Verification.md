# Approved refinements - implementation and verification

Implemented 6 September 2026 following user approval of the independent QA
recommendations. The starter game, mission cards, teacher run sheet and current
README are updated. The original QA report and evidence remain historical.

## Delivered changes

- The first two tuning settings, sky colour and bucket creation are the first
  four actions in `on start`. Long image arrays follow the player setup.
- Saved event stacks no longer overlap. At 1366 × 768, the opening view shows
  both tuning settings, the sky edit and the bucket edit. Other events require
  panning; the run sheet includes a navigation demonstration.
- Crow damage uses a timestamp guard set before damage is applied. SAFE text
  and cool-radial particles last 1000 ms. Further crows cannot remove life
  during that period; shiny-item collisions remain active.
- Scenery has depth -1 so moving bucket creation earlier does not draw the
  fence over the player.
- One item starts near the bucket, offering an early catch without changing
  the two tuning defaults. The starter remains quiet.
- Cards use one change/prediction/test at a time, allow relaxed or challenging
  designs, and replace card-count guarantees with observable learning.
- Help distinguishes standalone rounded-top events from actions inside events.
  Recovery guidance covers undo, solid catcher pixels and a working checkpoint.
- Mission 5 has complete, separate real-editor screenshots: scale/countdown in
  on start, sound inside the Player-Shiny catch event. Text identifies player,
  scale 1.5, background playback and countdown loss at zero.
- Mission 4 supports duplicating and retiming the whole crow event. The teacher
  reference gives the separate-frame-list steps for advanced reversal.
- The agreed 50-minute flow reserves minutes 37-43 for partner playtesting,
  43-47 for keeping work and 47-50 for celebration and Meridan STEM connections.
- Importable starter and checkpoint PNGs are in `Recovery/`. The checkpoint
  uses 700 ms drops, fall speed 60 and a score-15 win. Its source is included.
- README rebuild steps now use a complete scratch MakeCode project. The
  variant generator reads the delivered source and refuses to overwrite it.
  The old handoff is marked historical; the Mission 5 TypeScript snippet uses
  the generated variable name `player2`.

## Desktop verification

| Check | Result |
|---|---|
| Revised uninstrumented starter compile | Passed against MakeCode Arcade 4.1.17 |
| Recovery checkpoint compile | Passed against Arcade 4.1.17 |
| Five focused configurations | Starter, protection, combined missions, Mission 5 and shortened countdown all compiled |
| Two simultaneous crows | Life 3 → 2, not 3 → 1 |
| Catch during protection | Score increased by 1; life remained 2 |
| Another crow within protection | Life remained 2 |
| Crow after protection expired | Life decreased to 1 |
| Visible protection cue | SAFE text and particles inspected in simulator screenshot |
| Nearby first item | Stationary starter scored 1 and retained 3 lives within the 3-second run |
| Combined tuning + win + copied crow event | Earlier run reached YOU WIN at 15; final run lost at 3. Both screens retained; random spawns and controller policy affect success |
| Scale + background sound code + timer + win | Compiled; larger bucket/countdown visible; YOU WIN at score 15 |
| Countdown expiration | Shortened 3-second timer ended in GAME OVER while lives remained |
| Starter Blocks opening | No unsupported blocks; first edits visible; top-level rectangle intersection check passed |
| Starter PNG export/import | Imported through Import File in a fresh browser context; generated TypeScript exactly matched the verified starter |
| Checkpoint PNG export/import | Imported in another fresh context; tuning and win retained, no unsupported blocks; movement and effect durations retained |
| Printables | Three A4 card pages and two A4 teacher pages; all pages rendered and visually inspected; final Mission 5 spacing rechecked |
| Resource references | All HTML image paths resolve; first four startup actions checked in both projects |

During export/import verification, a prefixed `html:mutation` serialization was
found to silently drop optional arguments in MakeCode. It was corrected before
delivery. The final checks explicitly require movement speed 110/0, SAFE duration
1000 ms, effect duration 1000 ms and the original catch effect. The starter's exact
TypeScript comparison after import guards the full program, not only those values.
The checkpoint's generated TypeScript is saved alongside its source.

The focused tests ran in the real Arcade simulator with background throttling
disabled. The final replay disables automatic rebuilding and runs at most two
simulator contexts together. An earlier concurrent replay was interrupted by
timeouts and test-runner memory exhaustion; it is not used as passing evidence. Controlled collisions deliberately placed crows/items at the player to
isolate damage and catching. Ordinary mission runs used controller input.
Telemetry and screenshots are retained under `refinements/`; the final five-run
replay (including the scenery depth correction) is in `refinements/final-runtime/`.
Earlier successful runs are retained separately rather than selected as a typical
outcome. Executable replay
scripts and instructions are in `replay/`. Random scores and automated input do
not establish novice performance. Audio playback quality was not assessed.

Final artifacts and relevant source hashes are in `refinements/delivered-sha256.json`.

## Required school rehearsal - not completed on this desktop

- Open the starter in the school's managed student profile and check performance,
  first-edit visibility, panning/zoom and the actual trackpad right-click gesture.
- Make a visible customisation, save the original project PNG, import it in a
  fresh student profile, check the customisation, and rehearse collection and
  take-home distribution. Desktop import passes do not establish school permissions.
- Run one novice walkthrough and use it to adjust the opening pace and support.
- Print one set at 100%, single-sided, cut it and check readability. Test volume
  if students add sound.

No public starter share link was published. Local project PNGs provide the
preloading/recovery route; school-device checks and an actual novice trial still
need to happen before delivery.
