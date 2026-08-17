# Retro log — threads-status

Raw captures, appended at the moment they happen via `/log fail <note>` and `/log win <note>`.
Synthesized by `/retro` into `PROJECT_KNOWLEDGE.md` (project lessons) and `~/fieldcraft/protocols/`
(process lessons), then cleared.

> Created 2026-08-14, late — this repo ran 62 commits without one. Everything below the first entry
> must be captured *at the moment*, not reconstructed: a commit message says what changed, never why
> the wrong thing was tried first, which is the reusable part (`~/fieldcraft/protocols/wins-and-fails.md`).

## Week of 2026-08-14

### Wins
- [process] **Render-and-DOM-check before every commit held for ~40 review rounds.** Each change was
  navigated to, verified via `javascript_tool` (DOM assertions) + a screenshot, and only then
  committed — no "built = works" claims. Caught real regressions (double-toggle, spine geometry,
  members-pane leak) before they shipped. This is the loop that keeps a fast product-review cadence honest.
- [process] **Reused one bind path for two layouts instead of forking it.** When the channel-list
  needed a thread in the *centre* column, generalising `bindThreadPanel(p, cfg)` (rootSel /
  threadIdParam / closeFn) covered both the side-panel and centre-column threads — no second copy of
  the composer/menu/edit wiring to keep in sync.
- [project] **Seeded persistent example states.** Rather than requiring a live reply to demo the
  "replied to a thread" / "Also sent to the channel" states, they were seeded in the store so the
  reviewer sees them on load. Demo states belong in the seed, not behind an interaction.

### Fails
- [process] **The session ID for this prototype was lost twice in 24h.** The 08-13 reboot killed
  session `c0a48cf1`; it was located by transcript search on 08-13 (session `1f0125ca`), the answer
  was given in chat only, and the same hunt had to be run again on 08-14. Root cause: `halt.md` was
  never refreshed after 2026-07-17, so the repo's own resume pointer was 62 commits stale and nobody
  trusted it. Fix: `halt.md` reconciled against `git log` and re-dated; recovery method written up in
  `~/fieldcraft/protocols/find-session-to-resume.md` (+ `scripts/find-session.py`).
- [process] **`halt.md` claimed "paused right before the first thread feature (#7)"** while every
  thread issue had shipped through the Details panel. Root cause: the halt was written as a record
  and then never touched while work continued by the same session — a halt is a resume-point with a
  ~2-week shelf life (`~/fieldcraft/protocols/halt-resume.md` § Expiry). The old file is preserved at
  `docs/halt-archive/halt-2026-07-17.md`; its "hard to re-derive" section aged fine, its state didn't.
- [process] **Called a checkbox click "broken" twice when the code was fine — the test click missed.**
  Raw screenshot click coordinates are device pixels; under `devicePixelRatio 1.1` a y=1027 click
  landed below the composer, reading as "didn't toggle." Wasted a diagnostic cycle chasing a
  non-bug. Root cause: trusting raw coordinates over hit-testing. Fix (now in `PROJECT_KNOWLEDGE.md`
  § Verification): when an action "doesn't work," suspect the harness first — verify with
  `elementFromPoint(x,y)` / events dispatched on the resolved element, not raw coordinates.
- [project] **Native + manual toggle on one custom checkbox cancelled out** (net no change → looked
  dead). And a `:focus-within`-revealed row hid on the mousedown blur before the click landed. Both
  are subtle web-input traps; fixes (`pointer-events:none` + `target===checkbox` guard;
  `preventDefault` the row mousedown) are in `PROJECT_KNOWLEDGE.md` § Gotchas.
- [process] **`/tmp/thserve` + the static server died across a reboot mid-session** and a build
  silently failed to relink (`ln: No such file or directory`) before I noticed. Fix: recreate dir +
  relink + restart-if-down in one guarded line; documented in `PROJECT_KNOWLEDGE.md` § Build/serve.

### Skills extracted
- Project → **created `PROJECT_KNOWLEDGE.md`** (closes the carried debt): architecture + URL-param
  state, the three thread-open surfaces, Details-panel model, archived-≠-locked semantics,
  send-copy/"replied to a thread" + "from a deleted thread", the input gotchas, and the verification
  method. Auto-memory checkpoint refreshed (`threads-prototype-checkpoint.md`).

### Open debt (carried, not yet a fail)
- Icon rest/hover colours + shadows were derived from source tokens but never pixel-sampled against a
  golden render (`tools/sample-color.sh` vs Storybook/live app).
- Details tabs (Media / Pins / Links) use one shared demo dataset across surfaces — not per-thread /
  per-chat; fine for the demo, but noted so it isn't mistaken for real scoping.
