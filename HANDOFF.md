> **Historical brief.** Audience, timing and delivery guidance were updated on 6 September 2026 after QA and user approval. Use [README.md](README.md) and the teacher run sheet for the current Year 5-6 session. Earlier completion and publishing claims below describe the original build.

# HANDOFF — Build "SWOOP", a MakeCode Arcade taster for Year 6

**You are picking this up cold. Read this whole file before writing code.**
Everything here is decided unless it appears under "Open items". Don't
relitigate the settled decisions — they came out of a scoping conversation
with Steve on 2026-09-05.

Your job: build a starter game and verify it works, using the feedback loop in
§5. **Printed resources are explicitly out of scope for now** — do not build
mission cards, run sheets or PDFs until Steve asks.

---

## 1. The session

| | |
|---|---|
| **Who** | ~22 Year 6 students, visiting Meridan State College on a STEM Launchpad taster day |
| **How long** | 50 minutes, single session |
| **Kit** | School laptops, **one each** (not pairs), browser only |
| **Platform** | MakeCode Arcade (`arcade.makecode.com`), **blocks**, not JavaScript |
| **Teacher** | Steve, solo, 22 individual students — no second adult assumed |
| **Take-home** | Students email themselves a MakeCode share link if they want it. Nothing physical goes home |

This is the **third** taster session for this cohort. Session 1 was VR; session
2 was the cyber-security challenge in the sibling folder
`../Agent Induction — Cyber (Raspberry Pi)/`. This one is **a light nod, not a
sequel** — same visual family, zero plot dependency, so a student who missed
session 2 is not disadvantaged.

**Steve loads the starter game onto the laptops himself before the session.**
Students do not type a URL, do not import anything, and do not sign in. They
open a laptop and the game is already in the editor. Design accordingly — there
is no "getting started" beat to build resources for.

### The constraint that shapes everything

One adult, 22 individual students, 50 minutes, most of whom have never opened
MakeCode. **The bottleneck is not coding — it is hunting for blocks in the
toolbox.** Every design decision should be measured against "does this reduce
time spent looking for a block". That is also why the missions are ordered so
the first one is unloseable: the first five minutes should produce confidence,
not a queue at the teacher's desk.

---

## 2. The game — SWOOP

### Premise

Meridan has a genuinely infamous **albino crow** on the grounds — the students
all know it. That bird is the antagonist.

> The crow has been raiding the school and stashing stolen shiny things — coins,
> keys, hair clips, a watch — in its nest. The nest has tipped. You're on the
> ground with a bucket, catching the loot before it hits the dirt. The crow is
> not happy about this, and it swoops.

Catch the shiny things for points. Get swooped and you lose a life. Three lives.

### Why this premise (do not "improve" it)

- **No vocabulary load.** "Catch the shiny stuff, dodge the bird" needs no
  explanation, so the first instruction is *play it* rather than *read this*.
  An earlier draft used falling "data packets" and was rejected precisely
  because Year 6 don't have that word.
- **It's a real bird they actually know.** The local hook is the whole point.
  This was originally a magpie (tying to MAGPIE, session 2's thief); Steve
  pointed out the school's albino crow and it is strictly better. If you want
  the session-2 easter egg, put a single black feather in the stash or use
  `MAGPIE` as the default high-score name — **optional, and it must never be
  load-bearing.**
- **Every mission becomes self-explaining in the premise's own words**, which
  is the real test of a theme. See §3.

### Technical consequence of an albino crow — take this seriously

**The antagonist is a white bird.** On a light sky background it is invisible,
which kills the game. Use a dusk / dark-teal / storm-grey sky so a white sprite
reads clearly, and give the crow a dark outline. Check this on the actual
simulator screenshot, not in your head. Mission 1 lets students change the sky
colour — make sure the crow is still visible in the plausible colours they'll
pick, or constrain what Mission 1 offers.

### Mechanics

- Player: a bucket/catcher sprite, moves with the D-pad. `setStayInScreen(true)`.
- Shiny things fall from the top at random x. Overlap → `+1` score, small effect.
- The crow swoops. Overlap with player → `-1` life, brief flash/invulnerability.
- 3 lives, score displayed. Game over at zero lives.
- **No music.** Steve's call — 22 laptops of chiptune is a wall of noise. Sound
  effects are a *side quest* students can add if they want, not a default.

### It must be genuinely playable on load

The starter is **thin, not broken**. A student must be able to play something
fun within 30 seconds of the laptop opening, without reading anything. Only
Mission 2 involves a real defect; Missions 3–5 are additions. Do not scatter
bugs through the starter to create work — a starter that isn't fun destroys the
opening five minutes.

---

## 3. The five missions

Ordered so that difficulty and risk both climb. **M1–M3 are the guaranteed
core** — every student should finish these and have a shippable game. M4 is
where most will actually end. M5 is stretch for early finishers.

Build the starter so that each mission is a small, findable edit.

| # | Mission | What the student does | Why it's in the sequence |
|---|---------|----------------------|--------------------------|
| **1** | **Make it yours** | Redraw the catcher sprite in the sprite editor. Change the sky colour. | No logic at all. Unloseable. Creates ownership and teaches where the asset editor lives. |
| **2** | **Fix the difficulty** | Two numbers are deliberately wrong — the shiny things spawn far too rarely and fall in slow motion, so the game is dull. Change them, play, change again. | The only genuine *fix*. This is where they learn **change → test → change**, which is the actual transferable skill of the session. |
| **3** | **Win the season** | Right now you can only lose. Add: catch 15 and you've survived magpie season. | First conditional, first new event block. Turns a toy into a game. |
| **4** | **Add a second crow** | Copy the swoop pattern that already exists in the code and adapt it. | Highest-transfer task here: reuse an existing structure and change its meaning. Also the one students *want* to do, and the difficulty change is immediately felt. |
| **5** | **Your twist** | Open-ended — helmet power-up, bigger bucket, a third bird, sound effects, a boss crow. | Early finishers. Deliberately unspecified. |

**Design the starter code so M2's two numbers are obvious and adjacent** — a
spawn interval and a fall speed, ideally near the top, ideally the only bare
numbers a student has to touch. Don't bury them among other literals.

**M4 only works if the swoop pattern is copyable.** Write the single crow's
spawn-and-move logic as one clean, self-contained group of blocks that reads as
a unit when decompiled. If it's tangled with the shiny-thing logic, M4 becomes
impossible for a Year 6 student and the mission fails.

### Suggested timing (Steve to finalise)

| Time | Beat |
|------|------|
| 0–5 | Arrive, laptops open, **play the game** |
| 5–8 | What you're doing today: you're not writing a game, you're changing one |
| 8–13 | M1 Make it yours |
| 13–20 | M2 Fix the difficulty |
| 20–28 | M3 Win the season |
| 28–38 | M4 Add a second crow |
| 38–43 | M5 / catch-up |
| 43–50 | Playtest round + email yourself the link |

---

## 4. Hard constraint — it must decompile to BLOCKS

Year 6 students work in blocks. You will write TypeScript (it's far easier to
generate and test), but **MakeCode must be able to convert it back into clean
blocks**, or the whole thing is worthless.

The TS→blocks decompiler only handles a restricted subset. Known constraints —
**treat the unverified ones as "must confirm with the blocks check in §5.4"**:

- `let` at top level, **not** `const`.
- Event handlers as `function () { }` — **no arrow functions**.
- No classes, interfaces, generics, or destructuring.
- String building with `+` concatenation, **not** template literals.
- Sprite images as `img\`...\`` literals.
- Custom sprite kinds via `namespace SpriteKind { export const Shiny = SpriteKind.create() }`.
- Plain `function foo() { }` declarations for anything reusable.

**If a block renders grey / "unsupported" in the editor, that code is a
failure** no matter how cleanly it compiles. Rewrite it.

---

## 5. Your feedback loop — this is already proven, use it

**Do not hand Steve code and ask him to check it.** A full loop exists and was
verified end-to-end on 2026-09-05. Reproduce it before you start building.

Work in a scratch directory, not in this folder.

### 5.1 Setup

```bash
npm install makecode          # Microsoft's official CLI, v1.3.6 verified
npx makecode init arcade      # downloads the Arcade target, writes pxt.json + main.ts
```

Requires network — `build` uses MakeCode's cloud compiler. `init` pulls the
editor at v4.1.17 and auto-selects hardware variant `n3`.

### 5.2 Tier 1 — compile check (~15s per run)

```bash
npx makecode build
```

Type-checks your code against the **real Arcade API**. This has teeth — it was
tested with deliberate errors and returned:

```
main.ts(31,20): error TS2345: Argument of type '"banana"' is not assignable to parameter of type 'number'.
main.ts(32,9): error TS2551: Property 'onOverlapp' does not exist on type 'typeof sprites'. Did you mean 'onOverlap'?
```

Run this after every edit. It catches every API mistake before anything reaches
a laptop.

### 5.3 Tier 2 — actually play it

```bash
npx makecode serve --port 7788
```

Starts a local simulator at `http://127.0.0.1:7788` with **file-watching
auto-rebuild** — edit `main.ts` and it recompiles on save.

Drive it with the Browser tools:

1. `navigate` to `http://127.0.0.1:7788`.
2. The sim renders tiny by default. The iframe is **same-origin**, so enlarge it
   with `javascript_tool`:
   ```js
   const f = document.getElementById('simframe');
   f.style.cssText = 'position:fixed;top:0;left:0;width:720px;height:540px;border:0;z-index:9999';
   document.body.style.margin = '0';
   ```
   Also `resize_window` to about `800x620` so screenshots are legible. Reset with
   preset `desktop` when you're done.
3. Click the sim to focus it, then send input with `computer` → `key` (`Left`,
   `Right`, `Up`, `Down`, `A`, `B`; use `repeat` for sustained movement).
4. `screenshot` to see the result.

**Verified working:** clicking the sim, pressing `Left` ×25 and `Up` ×15 moved
the player and the score ticked 0 → 1 on catching an item.

### 5.4 Tier 3 — programmatic assertions, not eyeballing

`console.log` from inside the running game surfaces to the browser console.
Add a temporary probe:

```ts
// --- test harness — STRIP FROM THE STUDENT BUILD ---
game.onUpdateInterval(500, function () {
    console.log("TEST score=" + info.score() + " life=" + info.life() + " px=" + player.x + " py=" + player.y)
})
```

Read it back with `read_console_messages` (pattern `TEST`). Verified output:

```
[log] l>TEST score=0 life=3 px=80 py=60
```

Use this to script a **per-mission regression**: apply each mission's edit, drive
scripted input, assert that score/lives/position change the way the mission
promises. That's how you prove M2's numbers actually fix the difficulty and M4's
second crow actually costs a life.

**Strip every probe from the build you publish.**

### 5.5 The one check the CLI cannot do

The CLI proves the code *compiles*. It does **not** prove it *decompiles into
blocks*, which is the thing that matters most (§4). Do this manually, yourself,
in the browser:

1. Open `arcade.makecode.com`.
2. Load the project.
3. Switch to the **Blocks** view.
4. Screenshot and confirm every block renders properly — **no grey
   "unsupported" fallback blocks**, and the M4 swoop group reads as one
   copyable unit.

This is your check to run, not Steve's.

### 5.6 Publishing the share link

```bash
npx makecode share
```

**Steve has approved you generating the share link yourself.** Note this
publishes the game publicly to Microsoft's servers — that's understood and
agreed. Publish only the final, verified, probe-free build, and hand Steve the
URL.

---

## 6. Deliverables

**In scope now:**

1. `SWOOP` starter game — `main.ts` + `pxt.json`, kept in this folder so it's
   version-controlled alongside everything else.
2. A verified share link for the starter (§5.6).
3. A short `README.md` in this folder: what the game is, the five missions, how
   to rebuild and re-share it.
4. Per-mission regression evidence (§5.4) — enough that Steve can trust the
   missions do what the table in §3 says.

**Explicitly NOT in scope yet — do not build these:**

- Mission cards, block lookup card, teacher run sheet, side quest cards.
- Any PDF or printed resource.

Steve will ask when he wants them. When he does, the print pipeline is the
sibling folder's: HTML + CSS in `src/`, built with WeasyPrint via
`src/build_pdfs.sh`, so the cards match the Agent Induction visual family.

---

## 7. Open items

- **The crow's student nickname.** If the students have a name for the albino
  crow, that name should probably be the game's — or at least the antagonist's.
  Ask Steve. This is the single highest-value unknown: a bird the students
  already have a name for makes the game theirs on sight.
- **School filter not yet tested.** Everything in §5 was verified on Steve's
  home network. Nobody has confirmed on a school laptop that (a)
  `arcade.makecode.com` loads, (b) the preloaded project opens, (c) students can
  *create* a share link — (c) is the one that decides whether the take-home
  works at all. Steve's test to run, not yours, but flag it if it's still open
  when you finish.
- **Session timing** in §3 is a proposal, not agreed.

---

## 8. Conventions for this folder

- Keep a `.worklog.md` here and **update it as you go**, not at the end. Status
  line at the top, `Done`, and a `Next / Open` heading — that heading is
  load-bearing, a `SessionStart` hook parses it and resurfaces pending items in
  the next session.
- Don't touch `../Agent Induction — Cyber (Raspberry Pi)/`. That session is
  delivered and its worklog is a runbook for re-running it.
- This repo has **two copies** — here in OneDrive and on `zeus` (Steve's Linux
  laptop), synced peer-to-peer with no hosted remote. zeus is currently the
  stale side. See the root `README.md`.
