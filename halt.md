# Halt — 2026-07-17

## ▶ Resume this session
```bash
cd /home/alisher/threads-status && claude --resume c0a48cf1-43d2-4116-a349-9bbb728b6424
```
Working folder: `/home/alisher/threads-status` · session `c0a48cf1-43d2-4116-a349-9bbb728b6424`.
Note: this session **originated in `/home/alisher/status-token-swap-send`** (the swap prototype — its memory + the fidelity `tools/` source live there). Fallback: `cd /home/alisher/status-token-swap-send && claude --continue`.

## Where we stopped
Building the **threads prototype** (`xAlisher/threads-status`, Status epic **#21090** — Conversation Threads across Communities/Group chats/DMs, `needs-design`). Just finished the **foundation phase**: ported the faithful Community Channel chat from `~/status-redesign` + the fidelity pipeline, then closed all foundation gaps through the `/status-fidelity` gate — **hover quick-actions toolbar, composer reply-preview + formatting group, members sidebar**. `version=current` base is fully certified. Paused right before the first **thread feature** (issue #7 thread indicator = first net-new design work).

## Current state
- Repo `xAlisher/threads-status` · branch `main` · working tree clean
- Last commit: `c06bbec` — "fidelity: members sidebar (UserListPanel) — final foundation gap"
- Build: passing; deploy green. **Live:** https://xalisher.github.io/threads-status/
- Open reviews: none. Foundation issues #2–#6 delivered + ✅-commented (NOT closed — awaiting Alisher's issue-by-issue review). Thread issues #7–#14 open, not started.

## Next steps (in order)
1. On Alisher's "go": start **issue #7 — Thread indicator** (a root message with replies shows "N replies · participant avatars · last activity" beneath it). **Net-new design — no QML source** (needs-design). Keep minimal-first.
2. **#8 Reply-in-thread** — add to the hover quick-actions bar (already built) → opens the thread view.
3. **#9 Thread view** (parent + replies + composer; desktop side-panel / mobile full-screen), reusing the certified message row + composer.
4. Then #10 nav → #11 threads index → #12 notifications → #13 group/DM → #14 polish.
5. Save each certified thread state to the **"Saved states"** toolbar menu (`main.js` `USE_CASES`). Deploy per issue (auto-rerun the `deploy-pages` flake). Report each for Alisher's review before the next.
6. When all thread issues land → hand off to **Volo**; his comments → `REVIEW_CASES` menu in `main.js` (keyed by comment id), worked in a feedback loop (like the swap prototype).

## Blockers
- None. (gh writes work on the `xAlisher` account; the **status-im org API 403s under org-wide 2FA** — read the epic/comments via unauthenticated `curl https://api.github.com/repos/status-im/status-app/...`.)

## Context that's hard to re-derive
- **THE lesson (Alisher's correction, do not repeat):** don't rebuild Status UI from scratch — the base was **already recreated** in `~/status-redesign` ("QML-to-vanilla for Status": community-channel + 81 themes + audit workflow). Saved as memories `status-ui-recreation-assets` + `recreate-precision-over-rebuild` (in the swap-send session memory dir). Use **only the ORIGINAL theme** (current dark/light) — per Alisher.
- **Fidelity pipeline (required for ANY new recreation):** `~/threads-status/tools/` (qml-callsite/states/resolve/icon = source layer; sample-color/element-map/screen-diff = render layer; `preflight.sh`), the `/status-fidelity` skill, `recreate-guard` PreToolUse hook (`.claude/settings.json`), `docs/recreate-from-source.md`. **Rule:** read the full component chain (named file + base + instantiated controls), enumerate every state branch, **LIFT icons verbatim** (`tools/qml-icon.sh`, recolor #000→currentColor — I caught myself hand-drawing a crown, don't), **pixel-sample colours on BOTH renders**. Golden = live app / Sneg Storybook (`sb-shot.sh`) / tokens.
- **QML source:** `/home/alisher/status-app-src/ui` (mirror `~/basecamp/refs/status-desktop`). Chat: `ChatView→ChatColumnView`; `StatusMessage.qml` (row); `MessageView.qml:1111` (quickActions set + gating); `StatusChatInputToolBar/ReplyArea`; `UserListPanel` + `StatusMemberListItem`. **No thread concept exists in source** — #7+ is design invention.
- **Deep-link demo convention** (force-show states via `bindCommunityChannel`, `main.js` saved states): `?actions=1` hover quick-actions · `?reply=1` composer reply preview · `?fmt=1` formatting group. Add one per thread feature.
- **Residual precision debt:** icon rest/hover colours + shadows built from source tokens but **not yet pixel-sampled vs a golden** (Storybook on Sneg / live app). Do a `sample-color.sh` pass if time, else Volo review catches.
- **Interpretation lesson (from swap):** keep each thread element **minimal-first** — the swap Recent tab took 6 rounds from additive iteration.

## Key files
- `~/threads-status/src/main.js` — shell, versions (current / Threads), Saved-states `USE_CASES` + `REVIEW_CASES` menus.
- `~/threads-status/src/screens/community-channel.js` / `.css` — the ported chat + gap-fills (`quickActions`, `replyPreview`, `formatGroup`, `renderRightPanel`, `bindCommunityChannel`).
- Plan: `~/.claude/plans/enchanted-swimming-stardust.md`.
