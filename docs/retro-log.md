# Retro log — threads-status

Raw captures, appended at the moment they happen via `/log fail <note>` and `/log win <note>`.
Synthesized by `/retro` into `PROJECT_KNOWLEDGE.md` (project lessons) and `~/fieldcraft/protocols/`
(process lessons), then cleared.

> Created 2026-08-14, late — this repo ran 62 commits without one. Everything below the first entry
> must be captured *at the moment*, not reconstructed: a commit message says what changed, never why
> the wrong thing was tried first, which is the reusable part (`~/fieldcraft/protocols/wins-and-fails.md`).

## Week of 2026-08-14

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

### Open debt (carried, not yet a fail)
- Icon rest/hover colours + shadows were derived from source tokens but never pixel-sampled against a
  golden render (`tools/sample-color.sh` vs Storybook/live app).
- No `PROJECT_KNOWLEDGE.md` — thread card anatomy, send-copy semantics and the desktop/mobile routing
  rules exist only in commit messages.
