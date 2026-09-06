# SWOOP session: independent QA and recommended refinements

Reviewed 6 September 2026. Audience: Year 5–6, mostly new to MakeCode Arcade. Confirmed conditions: 50 minutes, approximately 22 students, one laptop each, one teacher. Your intended outcome: students leave excited about being challenged through fun activities while learning in Meridan’s STEM Academy.

**Verdict: keep the concept and the five broad activities, but revise the beginner experience before delivery.** The game runs, the principal mission edits work, and the crow is an effective local hook. The main weaknesses are finding the first edit, inaccurate help, uneven extension support, and treating increasing difficulty and finishing cards as the measure of success. The desired exit feeling is: “I made something, figured something out, and want to try more of this at Meridan.”

This is a review, with concrete proposed changes. The student game, cards and teacher run sheet have not been rewritten. The evidence and replay scripts are saved alongside this report.

**What is already worth keeping**

- Start with a playable game and let students change it. That makes meaningful creation achievable within one session.
- Keep the crow, shiny objects, quiet default game, and small visible edits.
- Keep real block screenshots, short numbered instructions, a success check, and a help card.
- Keep the move from personalisation to tuning, an event, reuse and invention. Allow students to branch and revisit rather than requiring everyone to progress at the same speed.
- Keep “change → test → change” as the learning thread. Reward a useful discovery or helpful playtest as much as an elaborate feature.

**Fix before delivery**

| Priority | Finding and evidence | Recommended change |
|---|---|---|
| High | **The first mission is not easy to find.** In the original project at 1366×768, the bucket creation block is below the visible workspace. Large image arrays sit above it. The crow and catch stacks also overlap: their screen bounds overlap vertically by approximately 119 px. | Put the sky and bucket creation near the top, immediately after the two tuning numbers. Keep long arrays further down. Re-space the event stacks. Verify the opening view on the actual laptops; demonstrate panning and zooming once. |
| High | **The help card teaches an incorrect rule.** “A block floating on its own does nothing” contradicts Missions 3 and 4, whose event stacks must stand separately. | Say: “Action blocks go inside an event. Blocks with a rounded top, such as ‘on start’ and ‘on score’, stand on their own.” Show one event containing one action. |
| High | **Mission 5 contradicts itself.** Its sound instruction says “inside the catch block”, but its screenshot and “Top three sit inside on start” caption put sound at startup. A student following that picture gets a startup sound. | Split the illustration: scale and countdown in `on start`, below creation of the player; sound inside the existing Player–Shiny overlap event. Label the event. Explicitly select `player` and scale `1.5`. |
| High | **Two crows can remove two lives in one instant.** A controlled collision test placed two crows on the bucket: lives went from 3 to 1 by the next 100 ms probe. The original brief requests brief protection after a hit; the game lacks it. | Add approximately 0.75–1 second of protection from further crow damage, with a clear visual cue. Keep catching enabled during protection. Treat this as starter support, not another compulsory student task. |
| High | **Mission 2 gives conflicting instructions.** “Change both” conflicts with its own “Change one number at a time” warning. Calling the numbers “wrong” implies one answer; “if you can stand still…too easy” discourages accessible designs. | Ask students to choose a desired experience, predict the effect of one change, test briefly, and adjust. Present 700/60 as one example, not the correct answer. |
| Medium | **“Cosmetic only. Nothing can break” is inaccurate.** A fully erased bucket ran but scored 0 and lost no lives in the test: it has no visible pixels to collide with. Changing its size or painted shape can also change play. | Begin with recolouring a few pixels. Add “Keep some solid pixels so your catcher can catch.” Replace absolute reassurance with specific undo and restore steps. |
| Medium | **Mission 4’s reverse-crow extension needs more support than its wording suggests.** Both spawn stacks use the same two animation frames. Changing only the initial picture is overwritten by animation; flipping shared frames affects both streams. | Keep duplicating and retiming as the supported task. Label reversal as an advanced option requiring a separate frame list, both frames flipped, and that list selected in the copied animation. |
| Medium | **The final seven minutes combine playtesting, email, saving and departure.** There is no protected time to celebrate learning or connect it to future STEM challenges. Student access to email and sharing is unverified. | Separate partner testing, keeping work and the closing celebration. Test one complete student save/reopen journey on the school network before the session. |

Source locations: [opening layout](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/swoop/main.blocks>), [crow collision handler](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/swoop/main.ts:7>), [Mission 2 wording](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/Printables/Mission Cards.html:168>), [Mission 5 caption](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/Printables/Mission Cards.html:294>), [help-card rule](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/Printables/Mission Cards.html:324>), and [teacher claims](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/Printables/Teacher Run Sheet.html:82>).

**Game testing: what I actually verified**

I compiled the actual `swoop/main.ts` against MakeCode Arcade 4.1.17 using Microsoft’s CLI. I imported the saved project into the live editor, verified it opens in Blocks, inspected its layout at 1366×768, and exercised the loot array’s plus button. It creates the expected fifth image slot. I also converted the combined Mission 2+3+4 source back into Blocks successfully, with zero unsupported TypeScript blocks.

Fourteen instrumented configurations compiled, and 20 browser play runs exercised them. Tests ran in Chromium with background throttling disabled. The runtime recorded score, lives, player position and sprite counts every 100 ms; browser automation supplied left/right controller input. No player teleporting, score inflation or life restoration was used in the ordinary play runs. The two-crow collision case deliberately created a controlled collision.

| Check | Observed result |
|---|---|
| Original project compile and editor opening | Passed; Blocks opens and renders. Layout issues described above remain. |
| Movement, catching, damage and losing | Passed. Controller movement changed position, catches raised score, crow collisions reduced lives, and zero lives produced GAME OVER. |
| Starter, stationary at centre for 60 seconds | Score 2, 2 lives remaining. This contradicts treating the old “all lives gone by 25–36 seconds” observation as a guaranteed outcome. |
| Starter, move left and remain at edge for 30 seconds | Score 0, 3 lives remaining. The left edge is a safe place against this left-to-right, downward crow trajectory. It is not a useful score exploit in this run. |
| Starter, predictive automated controller for 60 seconds | Score 21, 2 lives remaining. First hit at approximately 5 seconds, before a first catch. |
| Mission 2, same controller policy for 60 seconds | Score 64, 1 life remaining. More activity is clearly observable. These independent random runs are not a controlled estimate of a catch-rate multiplier. |
| Mission 3: reach score 15 | YOU WIN, Score:15, visually verified. Last pre-win telemetry was around 14 seconds. |
| Mission 4: copied 2000 ms crow event | Additional crows spawned and moved; up to 3 were present together. This adds a stream of crows, not a fixed second character. |
| Missions 2+3+4 together | YOU WIN, Score:15, visually verified with the predictive controller. The simpler controller lost quickly, illustrating why automated success does not establish beginner suitability. |
| Crow from the right | Spawned and travelled left successfully. Its animation still faces right, as anticipated. |
| Larger bucket + catch sound code + 60-second countdown + win event | Compiled and ran; larger bucket and countdown visible; win achieved before timeout. Audible quality and classroom volume were not assessed. |
| Countdown timeout | An accelerated 3-second timeout test ended in GAME OVER despite 3 lives. Explain that students must reach the win target before time runs out. |
| Fifth loot image | Compiled and ran; score 19 in a 15-second automated run. Editor plus-button behaviour separately verified. |
| Zero spawn interval | No browser error in 12 seconds; up to 103 loot sprites and score 124. This is a short stress check on this Mac, not a promise about school laptops. |
| Fall speed 500 | Compiled and ran; very hard to catch. One automated run scored 1 before losing. |
| White sky | Ran successfully; dark sprite outlines preserve contrast. “You won’t see it” is too absolute. Ask students to test visibility instead. |
| Fully erased bucket | Invisible, score 0 and 3 lives after 12 seconds. Confirms the recovery issue in Mission 1. |
| Two simultaneous crow contacts | Lives 3→1. Confirms missing protection after a hit. |

The first automated controller chased catches and reacted late to hazards. A second predicted approaching crows. Both sets of results are retained rather than selecting only successful runs. Random spawns, different input policies and limited repetitions mean these numbers describe these runs; they do not establish a typical child’s score or a guaranteed completion time. Final win/loss screens were inspected because the last periodic telemetry can precede the final score or life change.

Evidence: [runtime summaries](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/QA/evidence/results.json>), [predictive-controller summaries](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/QA/evidence/refined-controller-results.json>), [full telemetry archive](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/QA/evidence/runtime-details.zip>), [editor measurements and Blocks round trip](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/QA/evidence/roundtrip.log>), [reviewed-file hashes](</Users/Reid/Library/CloudStorage/OneDrive-DepartmentofEducation/Fable projects/STEM/STEM Launchpad Session/MakeCode Arcade — Game Build/QA/evidence/reviewed-file-sha256.json>).

**The opening needs its own success check.** At the starter fall speed, loot takes roughly six seconds to travel from the top to the catcher. A crow can hit before that first catch, as the runs demonstrated. Consider an immediately reachable first item or a short gentle opening, and choose the initial pace through a novice trial. There is no need to make the starting experience dull for tuning to be a worthwhile design challenge.

**A more accessible mission structure**

Keep one shared activity, with a small achievable success and an optional deeper design problem. Students can choose help without being labelled “behind”, and confident students can move to an extension without waiting until minute 38.

| Mission | Small success | Further challenge | Evidence of learning |
|---|---|---|---|
| 1 — Make it yours | Recolour part of the bucket OR change the sky. Test it. | Draw a new catcher; check contrast and catching. | “I changed ___ and can see ___.” |
| 2 — Find your fun | Change ONE setting using a suggested value. Predict and test. | Design a relaxed and a frantic version; compare each over the same short play period. | “Increasing/decreasing ___ caused ___.” |
| 3 — Give it a win | Add the score event and WIN action with a brief teacher demonstration. Test temporarily at 2, then restore the chosen target, such as 15. | Design a target a partner can reach in roughly 30–60 seconds; change one setting based on their feedback. | “When the score reaches ___, ___ happens.” |
| 4 — Change the challenge | Duplicate the crow event and change its interval. | Make two crows fairer as well as harder: experiment with interval, flight path or player support. | “I reused ___ and changed ___.” |
| 5 — Invent a feature | Choose one clearly illustrated option: a fifth item, bigger bucket, sound, or a timer. | Build a shield, a difficulty ramp or another original mechanic using a small planning scaffold. | “My feature should ___; I tested it by ___.” |

The minimum success for the session should be **one owned change, one prediction/test, and one thing the student can explain or show**. Missions 1–3 can remain the supported route to a winnable game. “Everyone is guaranteed to finish three” and “most finish four” need a student trial before they are credible.

For a high ceiling, give advanced students a design brief rather than just “make it harder”. For example: “Make a shield that protects against exactly one crow. Decide how it appears, how the player knows they have it, and how to prove it has been used.” Provide a hint ladder: event → state/variable → action. A boss or shield is a multi-step feature; five minutes at the end is too little to introduce and support it reliably with one teacher.

**Proposed 50-minute flow**

| Time | Activity | Purpose and delivery detail |
|---|---|---|
| 0–3 | Play | Say “Click the game; use left/right to catch shiny things and dodge the crow.” Point to restart. Aim for an immediate action, not five minutes of unguided discovery. |
| 3–5 | Welcome and design brief | “Today you’re game designers at Meridan. Your challenge is to make a game someone enjoys. You don’t need to know the blocks yet.” Briefly show where to find a block, how to move around the workspace and how to undo. |
| 5–10 | Make one visible change | Everyone personalises something. Confident students can extend while others use recolouring as their first win. |
| 10–18 | Tune and test | Model one prediction, one number change and a short test. Invite students to choose relaxed, busy or tricky play. |
| 18–25 | Add a win | Short live demonstration of the two-block event. Offer a ready-made checkpoint if someone needs to recover. Test with a low temporary target. |
| 25–37 | Choose a challenge | More crows, visual design, sound/timer, or an original mechanic. Keep all choices available; students may finish their current change. |
| 37–43 | Partner playtest and refine | A neighbour plays. Give one observation and one suggestion, then change one thing. Use “I noticed…” and “What if…?” |
| 43–47 | Keep the game | Follow the school-tested save/share route. Have a fallback that preserves work locally for later distribution. |
| 47–50 | Celebrate and look forward | Show 2–3 varied successes: an artistic choice, a useful experiment and a new mechanic. Ask “What would you build next?” Connect their testing and learning to future STEM challenges. |

Do not turn the last three minutes into leftover administration. They are where students connect the enjoyable activity to the feeling that they could belong at Meridan and enjoy learning here.

**Specific wording to replace**

- Opening: replace “You’re not writing a game today. You’re changing one” with “You’re game designers today. Start with this game, then make choices that make it yours.”
- Mission 1: “Click the bucket picture. Change a few colours or draw your own catcher. Keep some solid pixels. Click Done, restart, and try catching something.”
- Mission 2: “Choose the feel: relaxed, busy or tricky. Change one number. Before you play, predict what will happen. Test for 20 seconds. Keep it or change it again.” Add direction cues: **smaller dropEvery = more frequent loot; larger fallSpeed = faster falling**. Offer 700 and 60 as separate experiments.
- Mission 3: “The pink ‘on score’ block stands on its own. The purple WIN action goes inside it.” Call this an event; the original handoff’s “first conditional” description is imprecise.
- Mission 4: replace “One crow isn’t scary” with “Want a new challenge? Copy the crow event and change when it arrives.” Add the laptop’s actual right-click gesture if students use trackpads.
- Mission 5: “Choose one idea.” Give every option a placement, a value or selection to change, and a visible success check. For sound, put it in the existing catch event and choose “in background”; for countdown, explain losing at zero.
- Help card: use **name + colour + shape**, with search as another route. Colour alone is a poor navigation rule, and it breaks down when red variable blocks contain blocks from other drawers.
- Recovery: “Undo your last change. If the catcher disappeared, open its picture and draw some solid pixels. If you’re still stuck, we can reopen a working copy.” Do not imply that unlimited undo or browser refresh always restores everything.
- Teacher language: replace “anyone behind” with “keep working on the change you chose”; replace card-count completion targets with observable learning and an enjoyable result.

**Printables and preparation**

Both PDFs have the expected page counts and A4 size: three sheets containing six student cards, plus two teacher pages. All HTML image references resolve. I reviewed all pages with two PDF renderers and inspected suspected defects at higher magnification. Close-ups confirm the headings are intact; the main issues are content and visual guidance. The Mission 5 block image cuts into the scale block and does not show a clear event heading; regenerate it with complete blocks and correct placement. Mission 4’s context-menu image is useful, but add a small complete crow-stack image for orientation if space permits.

The main student text is around 11 pt, but captions and footer labels fall to approximately 8–9 pt. Keep essential instructions in the main text, particularly the numeric suggestions and event placement. Print one set at 100% on the actual printer and check readability after cutting; no physical print test was possible here. Use single-sided printing for the described cut-card workflow.

Before the day, prepare a clean starter and a known-working checkpoint; check they open under the student browser/profile. Browser-local saving does not by itself get a project home and can be lost if browser data is cleared. Anonymous sharing does not require signing in, but it creates a snapshot: students need to share again after later edits. Test opening a resulting link in a second browser/profile. [MakeCode saving documentation](https://arcade.makecode.com/save), [sharing documentation](https://arcade.makecode.com/share).

If email or public sharing is blocked, use a school-approved export/collection route and arrange later distribution. A generic starter link does not preserve a student’s customised game. The repository still contains no published starter share link; this review did not publish one.

The Academy’s published values—Curiosity, Creativity, Courage and Collaboration—fit this activity well. Make them visible through predicting, personalising, trying again and giving feedback rather than adding a long promotional speech. Its published emphasis on designing, coding, building and testing gives you a natural closing connection. [Meridan STEM Academy](https://meridansc.eq.edu.au/curriculum/excellence-programs/s-t-e-m-academy).

**Maintenance and limits of this QA**

The repository’s previous test numbers should remain historical observations, not student performance predictions. Its harness records output but does not establish the broad claim that every relevant mistake has been tested. The `tools/` rebuild instructions are incomplete for a clean checkout: they invoke MakeCode there without providing its own project manifest. Also, `tools/missions/m5.ts` uses `player`, whereas the delivered TypeScript uses `player2`; that snippet cannot simply be appended to the shipped TypeScript. The visible Blocks variable is correctly named `player`, so this is a maintenance issue rather than a card error. Test from the delivered project and document the scratch-directory setup explicitly.

The handoff still refers to Year 6 only, magpie season, deferred printables and older repository arrangements. Mark it as historical and make the README/run sheet the current source of truth, updated for Year 5–6 and the agreed timing.

Not tested: the school network/filter, managed student profiles, school-laptop performance, student email/export permissions, actual paper printing, classroom audio, or real students completing the tasks. These need a short school-device check and, ideally, one novice walkthrough. The gameplay and editor evidence above are complete for this desktop test scope.

Recommended order: fix block layout and inaccurate help → correct Mission 5 artwork → add hit protection → adopt the choice-based mission wording and protected closing time → rehearse the student save/reopen route on a school laptop.
