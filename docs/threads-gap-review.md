# Threads prototype — gap & blindspot review (Figma × issue #21090 × Status source × code)

**Baseline reviewed:** `5ae8ff6` — `src/screens/threads.js` (221) + `threads.css` (115) + thread additions in
`community-channel.js` + `main.js`. **Live:** https://xalisher.github.io/threads-status/

**Method — a diverse 3-model panel + Claude visual, then synthesised & verified:**
- **Najm (GLM)** — exhaustive coverage checklist; ran `qml-states.sh` + read `MessageContextMenuView.qml` and
  verified which Status icon assets exist (source-grounded). ~30 findings with file:line. ✅ delivered.
- **Senty (Codex/GPT-5)** — skeptical audit; F1–F22, strong on "it's demo scaffolding, not a thread model" +
  **accessibility**. Its QML shell calls were sandbox-blocked, so it asserted only directly-observable code. ✅ delivered.
- **Claude** — visual Figma-vs-render diff (the CLI agents can't see pixels). CV1–CV5. ✅ delivered.
- **Qamar (Kimi K2)** — **stalled/failed twice** on the sandboxed shell (`bwrap: … Operation not permitted`),
  even with a read-only-only prompt and a running server provided. **No findings.** (Trial note below.)
- Every finding below was cross-checked against the code; the blockers were personally reproduced (grep/read).

---

## BLOCKERS — the prototype is a deep-link demo, not a functioning thread feature

| id | finding | source | evidence | found by |
|----|---------|--------|----------|----------|
| **B1** | **Thread affordances only exist under demo URL params.** The context menu, in-chat card, and composer thread-icon are injected only when `?menu=thread` / `?thread=card[-closed]` / `?qa=thread` is present, always on `msgs[0]`. No real long-press/⋯ trigger. | §1.1/1.2; Figma 1/4/5 | `community-channel.js:158–171` (`bindThreadAffordances`) | Najm A-1.1-PLACEMENT · Senty F2 · verified |
| **B2** | **Composer is read-only; no send or edit path.** Both create and thread composers use `<textarea … readonly>`; no send handler on the send button; no edit flow. §3 ("post and edit") is unimplemented. | §3; Figma 2/3 | `threads.js:47/51` readonly; no `addEventListener` on send (`:57`) | Najm A-3-SEND/A-3-EDIT · Senty F4 · **verified** |
| **B3** | **"Send copy to #channel" toggle is cosmetic** — it only flips a CSS `.on` class; nothing posts to the parent conversation (§3.1). | §3.1; Figma 3 | `threads.js:194–196` toggles `.on` only | Najm A-3.1-FUNC · Senty F7 · **verified** |
| **B4** | **Threads absent from the left channel / conversation list (§6),** and none of the §6.1 disappear rules (close / 1-week-inactive / keep-visible) exist. | §6/6.1; Figma 7 | `community-channel.js renderLeftPanel` has no thread rows; `threads.js:181` `left:null` | Najm A-6-SURFACE · Senty F15 · **verified** |
| **B5** | **No thread-activity notifications.** The mute bell only swaps its own icon/title; there is no notify-on-reply / followed-thread badge / activity-center wiring. | Old req + Notifications user stories; Figma 3 | `threads.js:205–211` mutates `dataset`/SVG only; else absent | Najm A-OLD-NOTIFICATIONS · Senty F9 |

---

## MAJOR

| id | finding | source | evidence | found by |
|----|---------|--------|----------|----------|
| **M1** | **Context-menu items have no handlers and no enabled/disabled gating.** Only "Reply in thread" is wired; Reply/Edit/Copy/Pin/Delete do nothing and show on every message regardless of ownership/type — real `MessageContextMenuView` gates each via `enabled` (`isMyMessage`/chatType/contentType). | §1.1; Status source | `community-channel.js:124–135` render; `:179–182` binds only `--accent` | Najm A-1.1-GATE · Senty F3 · verified |
| **M2** | **`msg()` omits Status message states** required by §2 ("same way as usual message conversation"): Sending (0.5 opacity), hasMention colour, image-album, read-more, sticker/audio/bridge. Thread replies inherit the gaps. | §2; `StatusMessage.qml` | `community-channel.js msg()`; `qml-states.sh StatusMessage` (StatusMessage.qml:124,184,326) | Najm A-2-STATES/C-MSG-STATES (ran the tool) |
| **M3** | **Hover quick-actions diverge from source:** missing mark-as-unread + delete (real `MessageView.qml` includes them), and pin/delete shown with no `d.canPost`/admin gating. | Status source | `community-channel.js quickActions()`; `MessageView.qml:1218,1239,1248` | Najm C-QA-SET/C-QA-GATE-CANPOST |
| **M4** | **Everything is hardcoded demo data, not a thread model.** Card ("Threads MVP", "3 replies", fixed people), the single PARENT/REPLIES, and the list are literals; the card is injected under only the first message with a constant count/people/unread. Nothing keys off a parent-message/conversation id. | §1/2/4/5 | `threads.js:27–35,135–140`; `community-channel.js:139–149,162–165` | Senty F1/F16 · Najm A-4-DATA |
| **M5** | **Cross-surface (group/DM) is label-only.** `surface=group|dm` only changes header/copy text; message rows, card, and list don't vary; back always returns to community `chat`; no origin-conversation/parent-message identity carried. | Solution (Communities/Group/DM); Old nav req | `threads.js:22–25,154–171,213–215` | Senty F13/F14 · Najm A-GOAL-CONSISTENCY |
| **M6** | **Search + More header actions are dead;** no participants screen / "add from chat input"; no close/delete-thread action (only the URL mock end-states). | Figma 3/9; §4.1/4.2 | `threads.js:75–76` (dead); participants/search/close/delete absent | Senty F10/F11/F12 · Najm B-9-* |
| **M7 (a11y)** | **Interactive elements aren't accessible:** the copy switch is a `<span>` (no switch role / aria-checked / keyboard); thread-list rows are `<div data-open-thread>` (not focusable/Enter-activatable); the context menu has no focus management, Escape, or outside-click dismiss. | a11y; Figma 1/3 | `threads.js:117–120,159,217–219`; `community-channel.js:153–182` | Senty F19/F20/F22 |
| **M8** | **New-thread composer icon opens an existing thread, not a create flow.** The composer thread-btn routes to `tview=thread` (same as the card), when §1.2 means *start* a thread → should route to `tview=create`. | §1.2; Figma 2 | `community-channel.js:175–177` routes both to `tview=thread` | Senty F6 · verify |

---

## MINOR / NIT (fidelity & polish)

| id | finding | source | evidence | found by |
|----|---------|--------|----------|----------|
| **N1** | **Hand-drawn icons where real Status assets exist:** bell/bellOff (`notification.svg`/`notification-muted.svg`), check (`checkmark.svg`), lock (`lock.svg`), back (`arrow-right.svg`), and menu unread/copy/del (`hide.svg`/`copy.svg`/`delete.svg`). The prototype *already* lifts `notification.svg` in `main.js` — inconsistent. (thread glyph + clock: no asset — hand-draw OK.) | recreate-from-source "lift, don't draw" | `threads.js:10–20`; `community-channel.js:117–119` | Najm C-ICONS-HAND-DRAW (verified assets) · Senty F18 |
| **N2 (visual)** | **Context menu is missing the quick-emoji-reactions bar** Figma frame 1 shows on top of the menu (👋🔨🚀🎃🎯🚗😀+). Prototype renders only the item list. | Figma frame 1 | `msgContextMenu()` — no reactions row | **Claude CV1** (pixel-only) |
| **N3 (visual)** | **Thread-view header adds a "Follow" pill not in the Figma design** (frame 3 header = back·search·mute·more; follow is frame 8). | Figma 3 vs §1.2 | `threads.js:65–81 threadHeader` | Claude CV3 · Najm A-1.2-FOLLOW-PLACEMENT |
| **N4** | **Context-menu order & label diverge from source:** source order is Reply-to → Edit → Copy → Pin → Mark-unread → Delete; label is "Reply to" not "Reply". (Figma shows "Reply"; flag Figma-vs-source conflict — prefer source.) | `MessageContextMenuView.qml` | `community-channel.js:126–135` | Najm A-1.1-ORDER/LABEL |
| **N5** | **Thread composer icon set diverges from Figma** (missing camera/image/@-mention; has extra stickers + formatting group). | Figma 2/3 | `threads.js:48–58 threadComposer` | Najm B-2-COMPOSER |
| **N6** | **In-chat card shows an extra "last reply 2m ago"** field not in §4's four data points (replies/new/title/avatars). | §4; Figma 5 | `community-channel.js:147` | Najm A-4-LASTACTIVITY |
| **N7** | **Parent message isn't marked as the thread origin in the thread view** (only in the create view's "Starting a thread from" label). "Identify which message started a thread" user story. | Figma 4; user story | `threads.js:122–126` (no parent indicator) | Najm A-US-IDENTIFY · Senty (nav) |
| **N8 (visual)** | Mute bell default state: Figma frame 3 shows a muted (slashed) bell; prototype defaults to a plain bell. | Figma 3 | `threads.js:77` | Claude CV5 |
| **N9** | New-thread "Message-typed" state (composer has text, no title) isn't deep-linkable; icon-only controls lean on `title` tooltips without `aria-label`/`aria-hidden`. | Figma 2; a11y | `threads.js:84–99`; `:46–53,205–211` | Najm B-2-STATES · Senty F21 |

---

## Coverage by epic section (net)
§1 create ◑ (entry present but demo-only, gating/handlers missing) · §1.2 follow ◑ (label toggle, not durable) ·
§2 view ◑ (rows reused; message states missing) · §3 post/edit ✗ (read-only, no send) · §3.1 copy-to-parent ✗
(cosmetic) · §4 in-chat data ◑ (4/4 fields + extra, hardcoded) · §4.1 closed ✅ (display) · §4.2 delete ◑
(end-state only) · §5 thread list ✅ (static) · §6 conversation-list ✗ · §6.1 disappear rules ✗ ·
Notifications ✗ · cross-surface ◑ (labels only).

## Trial note — Qamar (Kimi) vs Najm (GLM) vs Senty (Codex)
On this run: **Najm/GLM was the standout** — completed, ran the fidelity tools, and produced the most
source-grounded findings. **Senty/Codex** delivered and owned the accessibility + "it's-all-stub" lens (its
QML shell calls were sandbox-blocked; it correctly refused to assert unverified source claims). **Qamar/Kimi
failed twice** — it spun on empty progress and died on the sandboxed shell (`bwrap` blocks its Bash/tool
calls), unrecovered even with a read-only prompt + a provided server. For this environment, GLM/Codex are the
reliable reviewers; Kimi needs its shell-sandbox issue resolved before it's usable here.

## Recommended next steps (priority order)
1. **Decide the prototype's ambition** — if it stays a *design* prototype, the "blockers" B1–B3 are expected
   demo scaffolding; re-tag them as "demo-only, by design" and focus on Figma/source fidelity. If it must
   *demonstrate the flow*, wire B1 (real triggers), B2 (editable composer + demo send), B3 (copy-on-send).
2. Address the **design/fidelity misses that are cheap and unambiguous**: N1 (lift real icons), N2 (context-menu
   reactions bar), N3 (follow placement), N4 (menu order/label), M7 (a11y roles/keyboard).
3. Confirm scope on the **epic-only, un-mocked features**: §6 conversation-list threads (B4), §6.1 rules,
   notifications (B5), participants/search/delete (M6) — these need design before build.
