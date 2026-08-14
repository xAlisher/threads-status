# Halt — 2026-08-14 (reconciled from the repo, not from the previous halt)

## ▶ Resume this session
```bash
cd /home/alisher/threads-status && claude --resume c0a48cf1-43d2-4116-a349-9bbb728b6424
```
Session `c0a48cf1-43d2-4116-a349-9bbb728b6424` · **originated in `/home/alisher/status-token-swap-send`**
(the swap/send prototype — the fidelity `tools/` source and that project's memory live there; the same
session carries both prototypes). Fallback: `cd /home/alisher/status-token-swap-send && claude --continue`.

> Recovered on 2026-08-14 with `~/fieldcraft/scripts/find-session.py threads-status` after the 08-13
> reboot killed the session — see `~/fieldcraft/protocols/find-session-to-resume.md`.

## Where we stopped
Threads prototype (`xAlisher/threads-status`, Status epic **#21090** — Conversation Threads across
Communities / Group chats / DMs). The thread feature set is **built and deployed**, well past the
foundation phase the 2026-07-17 halt describes (archived at `docs/halt-archive/halt-2026-07-17.md` —
its "Current state" was false by 62 commits; its "Context that's hard to re-derive" is still valid).
Last work: the **all-info Details panel** (#21971) replacing the standalone members pane, its Threads
tab, and the mobile Details header adopting the thread-page layout (back arrow + two-line title).

## Current state
- Repo `xAlisher/threads-status` · branch `main` · **working tree clean · nothing unpushed**
- Last commit: `8cfc5ee` (2026-08-13 22:00) — "mobile Details header: match thread layout (back +
  title/subtitle); links icon gets soft blue bg"
- Live: https://xalisher.github.io/threads-status/ (Pages deploy per commit)
- Shipped since the old halt: thread indicator + in-chat thread cards (spine, counter/lock badges,
  deleted-by tombstone), reply-in-thread, thread view (desktop side-panel / mobile full-screen),
  threads roster + hide/show threads menu, Slack-style composer with the send-copy checkbox,
  "Also sent to the channel" / "replied to a thread" tags, DM + Group surfaces (#21931),
  resizable desktop panels (#21969), all-info Details panel (#21971), Figma-exact mobile composer
- Latest state summarized in a comment on epic **#21090**; related: #21931 #21932 #21933 #21935 #21969 #21971

## Next steps (in order)
1. **Awaiting Alisher's direction** on further tweaks — no queued work item at halt time.
2. Volo's review comments → `REVIEW_CASES` menu in `src/main.js`, keyed by comment id, worked in a
   feedback loop (the pattern proven on the swap prototype).
3. Residual precision debt: icon rest/hover colours + shadows were built from source tokens but
   **never pixel-sampled against a golden** (Storybook on Sneg / live app). `tools/sample-color.sh`.
4. Repo has **no `PROJECT_KNOWLEDGE.md`** — the durable design decisions (thread card anatomy,
   composer send-copy semantics, desktop-vs-mobile routing rules) still live only in commit messages.

## Blockers
- None. `gh` writes work on the `xAlisher` account; the **status-im org API 403s under org-wide 2FA**
  → read the epic/comments unauthenticated: `curl https://api.github.com/repos/status-im/status-app/...`

## Context that's hard to re-derive
See `docs/halt-archive/halt-2026-07-17.md` § "Context that's hard to re-derive" — still accurate, and
the most valuable part of that file:
- **Don't rebuild Status UI from scratch** — the base was already recreated in `~/status-redesign`.
  Use the ORIGINAL theme only (current dark/light).
- **Fidelity pipeline is mandatory for any new recreation**: `tools/` (qml-callsite/states/resolve/icon
  + sample-color/element-map/screen-diff, `preflight.sh`), the `/status-fidelity` skill, the
  `recreate-guard` PreToolUse hook, `docs/recreate-from-source.md`. **Lift icons verbatim**, never draw.
- **QML source:** `~/status-app-src/ui` — `ChatView→ChatColumnView`, `StatusMessage.qml`,
  `MessageView.qml:1111` (quick actions), `StatusChatInputToolBar/ReplyArea`, `UserListPanel`.
  **No thread concept exists in source** — every thread element is design invention (`needs-design`).
- **Minimal-first per element** — the swap Recent tab took 6 rounds of additive iteration.
- Deep-link demo convention + saved states: `src/main.js` `USE_CASES` (`?actions=1`, `?reply=1`, `?fmt=1`).

## Key files
- `src/main.js` — shell, version switch (current / Threads), Saved-states `USE_CASES` + `REVIEW_CASES`
- `src/screens/community-channel.js` / `.css` — chat, thread cards, thread panel, Details panel
- `docs/threads-gap-review.md`, `docs/threads-gap-review-2.md` — gap reviews vs Figma + issue + source
- `docs/retro-log.md` — raw wins/fails captures (`/log fail`, `/log win`)
