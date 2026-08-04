# Threads prototype — Gap & Blindspot Review, ROUND 2 (functional build)

**Target:** `~/threads-status` @ HEAD `e519ba5` — the now-*functional* build (store + all flows), not the
round-1 deep-link demo. Epic #21090; use-case issues #15–#26.
**Method:** diverse 4-lens panel, each read-only, each verified against the code before landing here.
**Regression verdict on `version=current` (the certified base): CLEAN** — triple-confirmed (Claude live
render R2-C1 · Najm import/side-effect trace · Kimi gating trace). Every thread affordance is `ver==='revamp'`-gated.

## Panel & method notes (the round-2 trial payoff)
| Lens | Model | Round-2 result |
|---|---|---|
| **Qamar** | Kimi K2 (CLI) | **Recovered** — round 1 it stalled 3× on the bwrap sandbox; round 2, with the "don't retry shell, read files" prompt + provided server, it ran `npm run build` clean and returned 20 well-cited findings. |
| **Najm** | GLM (Kimi fork, trial) | **Deepest trace (28 findings).** Found 2 uniques (copy-toggle-reset, channel-list over-filter) AND *disproved* Kimi's XSS finding by tracing the escape round-trip. Highest signal of the trial. |
| **Senty** | Codex / GPT-5 | 7 sharp findings; unique catches: reopen-bumps-activity (F4), context-menu focus-restore a11y (F5). |
| **Claude** | (visual + synthesis) | Regression render, in-chat card visual pass, store spot-check, verification of every finding below. |

Convergence = confidence: the ID-collision blocker and the menu-mispositioning major were each independently
found by **two** models; participant-dedup by **three**. The one model *disagreement* (XSS) is resolved below.

---

## BLOCKER (1)

### B1 · Thread IDs collide after any reload — a new thread can route to an old one
- **Found by:** Kimi R2-01 · Senty F1 · **verified** (Claude).
- **type:** bug / persistence · **source:** #15/#16/#17/#20 (store correctness)
- **evidence:** `thread-store.js:172-173` `let seq = 100; const nid = p => \`${p}${++seq}\`` resets on every
  module load; IDs derive from it (`:180` `id: nid('t-')`, `:197` `nid('r')`, `:203` `nid('pp')`). The full
  model IS persisted (`sessionStorage`), but `seq` is NOT. Create does a full reload (`threads.js:224-226`).
  After reload `seq` restarts at 100, so the next create reuses `t-101`, and `threadForParent`/`getThread`
  return the first match → the new thread silently aliases an existing one.
- **fix:** persist `seq` in the stored state and restore it in `ensure()` (must exceed all stored IDs), or
  switch to `crypto.randomUUID()`. **Quick, high-value.**

---

## MAJOR (9)

### M1 · Channel-list membership is wrong in BOTH directions (#22)
Two real bugs in the same area — the net set of threads shown under a channel is incorrect:
- **(a) no `followed` filter** — Kimi R2-04 · Senty F3. `channelListThreads` (`thread-store.js:146-155`)
  filters deleted/surface/keptVisible/closed/inactivity but never `t.followed`; `community-channel.js:311`
  renders all returned. AC #22 wants active/**followed** threads → non-followed leak in.
- **(b) `startsWith('cc-')` over-filter drops valid threads** — **Najm R2-2 (unique).**
  `community-channel.js:311` adds `.filter(t => String(t.parentMsgId).startsWith('cc-'))`, which drops
  `t-roadmap` (keptVisible, must always show per §6.1) and `t-design` (active, <1 week) — only `t-m1` survives.
- **fix:** remove the `startsWith('cc-')` filter; add `t.followed` to `channelListThreads` (or its caller).
  **Quick, high-value.**

### M2 · Copy-to-parent toggle resets to the URL param after every post (#17)
- **Found by:** Najm R2-1 (unique) · **verified** (Claude).
- `threads.js:209-212` toggles the switch in the DOM only; the next `render()` re-reads `copy` from the URL
  param (`copy=1`), so turning it **off** then posting silently re-enables copy-to-parent on the next reply.
- **fix:** persist the toggle in store/state, not the URL; read the live value at post time.

### M3 · Reopening a thread makes it "fresh" with no message — defeats the 1-week rule
- **Found by:** Senty F4 (unique, sharp) · **verified** (Claude).
- `thread-store.js:248-251` `reopenThread` sets `lastActivityTs = Date.now()`, so a long-stale thread jumps
  back into the active list per §6.1's `now - lastActivityTs > WEEK_MS` check — without any actual reply.
- **fix:** don't touch `lastActivityTs` on reopen; only real replies refresh activity.

### M4 · Non-followed unread threads can never be cleared by opening them
- **Found by:** Kimi R2-02 · (Najm R2-9 the mirror symptom) · **verified**.
- `threads.js:236` `if (t0 && t0.followed && t0.unread && !t0.muted) markRead(...)` — the `followed` gate means
  an unfollowed thread that carries `unread` (e.g. after unfollow, which doesn't clear it) keeps its dot forever.
- **fix:** clear unread on open for any non-muted thread, OR clear `unread` in `setFollowed(id,false)`, AND gate
  the dot on `followed && unread` consistently (`thread-row`, `channel-thread`, `thread-card`).

### M5 · Cross-surface: group/DM threads don't return to their origin (#24)
- **Found by:** Kimi R2-03 (blocker-for-#24) · Senty F2 · Najm R2-8 (calls it a documented limitation).
- `threads.js:280` always sets `screen=chat`; in-chat affordances hardcode `surface='channel'`
  (`community-channel.js:194,222,248`). Only the channel screen exists, so back-nav can't reach group/DM.
- **Severity note:** partly by-design (prototype has one chat screen; comment on `:280` documents it). Landing
  as **major acceptance-gap** for #24, not a blocker — the surface identity IS carried in the URL for labels.
- **fix:** read the current surface from state; route `goBack` by `surface` once group/DM screens exist.

### M6 · Thread "more" menu is positioned in the wrong coordinate space
- **Found by:** Kimi R2-07 · Najm R2-3 (two models) · **verified**.
- `threads.js:326-328` computes `top` as `rect.bottom - rootRect.top`, but neither `.thread-screen`
  (`threads.css:5`) nor any ancestor is `position:relative` → the absolute menu anchors to the viewport, landing
  ~40–50px too high (toolbar offset). **fix:** add `position: relative` to `.thread-screen`. **Quick.**

### M7 · Context menu: Escape/dismiss doesn't restore focus to the "More" trigger (a11y, #26)
- **Found by:** Senty F5 (unique).
- `community-channel.js:202-206` moves focus into the menu then `menu.remove()`s without refocusing the invoking
  `.message__qa-btn[aria-label="More"]`. The *thread* menu does this correctly (`threads.js:339-340`) — so this
  is an inconsistency, keyboard focus is lost to `<body>`. **fix:** pass the trigger in, refocus on close.

### M8 · Reactions bar renders but does nothing (#26)
- **Found by:** Najm R2-13 · (Kimi R2-15 the general "dead menu items").
- `community-channel.js:129-132` reaction buttons have no `data-act`/handler — clicking an emoji applies no
  reaction. AC #26 says "add the quick-emoji-reactions bar"; it's present visually but inert.
- **fix:** wire a reaction toggle (store `reactions[]`, re-render), or at minimum a selected visual state.

### M9 · Hover quick-actions miss mark-unread + delete vs Status source (#25)
- **Found by:** Kimi R2-08.
- `community-channel.js:459-462` `quickActions` = react·reply·edit·pin·more; `MessageContextMenuView.qml`
  includes mark-as-unread and delete. **fix:** add the two, gated on ownership/`canPost`.

---

## MINOR (11)

- **m1 · keptVisible short-circuits closed** — Kimi R2-10 · Senty F4 · Najm R2-20 · Claude R2-C3.
  `thread-store.js:150-151` returns `true` for keptVisible *before* the `closed` check, so a kept-visible CLOSED
  thread stays in the channel list with no closed indicator. **Needs a product decision** (does keep-visible
  override §6.1's close-disappears?); if not, check `closed` first. Confirm with Volo.
- **m2 · Toast reappears on next reload** — Senty F6 · Najm R2-4. `takeToast` (`thread-store.js:165`) clears
  `s.toast` in memory but doesn't `persist()`, so a reload re-drains the old toast. fix: `persist()` after clear.
- **m3 · Participant dedup collides distinct people** — Kimi R2-17 · Senty F7 · Najm R2-11 (**three models**).
  `thread-store.js:98-103` key `i + c` (initial+color) merges two people who share both. fix: key by sender id/name.
- **m4 · Missing thread not-found state** — Kimi R2-11. `threads.js:191` a bad `t` id silently falls back to
  the first thread (even wrong surface). fix: explicit "thread not found" empty state.
- **m5 · Thread screens drop the activity-center badge** — Kimi R2-12. `renderThreads` returns `nav:null`
  (`threads.js:181-194`); the global unread badge vanishes inside thread screens. fix: return `renderNav()`.
- **m6 · `goBack` drops demo deep-link params** — Kimi R2-18. `threads.js:276-282` preserves only
  version/theme/view, dropping `actions/fmt/reply/qa/menu/thread` on return. fix: pass through unknown params.
- **m7 · `simulateActivity` has no UI trigger** — Najm R2-6. Badge shows "2" from seed, but muting-suppresses
  can only be demoed off pre-seeded unread, not live. fix: a "Simulate reply" button or `?activity=1` deep-link.
- **m8 · Inline-edit input built via `innerHTML`, escapes only quotes** — Kimi R2-06 (**downgraded**, see note).
  `threads.js:300-301`. A message with `"` or markup breaks the edit input. **Robustness, not live XSS.** fix:
  `createElement('input')` + `.value`.
- **m9 · Context-menu order & "Reply" label diverge from QML** — Kimi R2-09. fix: match
  `MessageContextMenuView.qml` order; label the plain reply "Reply to".
- **m10 · Copy-to-parent for group/DM surfaces is silently lost** — Najm R2-18. `postReply` stores to
  `parentPosts[t.surface]` but only `parentPosts('channel')` is rendered (`community-channel.js:389`).
  fix: render the current surface, or document as prototype limitation.
- **m11 · Composer-initiated thread shows placeholder "New thread" as parent** — Najm R2-15.
  `thread-store.js:181` synthesizes a fake parent; the user's first message becomes a reply below it instead of
  the opening post. fix: use the first message as the parent (Figma frame 2).

## NIT (8)
- Card uses same glyph open vs closed (Kimi R2-19 — use `THREAD_ICONS.lock`).
- Channel-list keep-visible pin is `📌` emoji, not `CHANNEL_ICONS.pinHeader` (Kimi R2-20).
- Seed `t-design`/`t-roadmap`/`t-release` parentMsgIds (`m3/m6/m7`) match no rendered `cc-*` message → their
  in-chat cards can never appear; only `t-m1` does (Najm R2-28). fix: remap seeds to `cc-*`.
- Dead code: `t.parent` never set (Najm R2-19), `threadEditable` opt unused (R2-23), `.thread-view__follow` CSS
  never rendered (R2-24), `.message--sending` class has no CSS (R2-12).
- `THREAD_GLYPH` duplicated in two files (Najm R2-21); `avatarStack` logic duplicated (R2-22).
- Reopen has no confirmation toast, unlike every other lifecycle action (Najm R2-10).
- `thread-more-menu` document listeners leak until the next interaction (self-cleaning) (Najm R2-17).
- `ucSelect` param parser truncates values containing `=` — latent, no current param affected (Najm R2-26).

---

## The one model disagreement — resolved (why the panel is worth it)
Kimi flagged **live XSS** (R2-05: `readMsg` returns raw `textContent`; R2-06: inline-edit `innerHTML`).
**Najm traced it and disproved the live-XSS half:** a message's text is read via `textContent` (browser
*unescapes* entities) and then re-emitted through `escapeText()` (`threads.js:197`) before hitting the DOM — the
round-trip is correct, typed content cannot inject. What *survives* is the inline-edit `innerHTML` builder
(R2-06 / m8 above), which only escapes `"` — a **robustness** gap, not a live exploit. Landed as a minor, not a
major. This is exactly the failure mode the diverse panel exists to catch: Kimi over-flags on enumeration
(known bias), a second careful model refutes it.

## Recommended first fixes (quick + high-value)
1. **B1** persist `seq` / UUID IDs — a genuine data-corruption blocker, ~3-line fix.
2. **M1(b)** drop the `startsWith('cc-')` channel-list filter (+ add `followed`) — one line restores 2/3 threads.
3. **M6** `position: relative` on `.thread-screen` — one line, fixes menu placement.
4. **M2** persist the copy-toggle — stops silent copy-to-parent after a user turns it off.
5. **M3** stop bumping `lastActivityTs` on reopen — one-line correctness for §6.1.

**Scorecard:** 1 blocker · 9 major · 11 minor · 8 nit · **0 regressions** to `version=current`.
Round-2 vs round-1: the 5 round-1 *blockers* (deep-link-demo, no store, no lifecycle) are **resolved** — this
build is genuinely functional. The remaining blocker is a single persistence bug, not a structural gap.
