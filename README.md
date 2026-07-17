# Status Threads — prototype

A clickable vanilla HTML/CSS/JS prototype for **conversation threads** across Communities, Group
chats, and DMs — the design exploration for Status epic
[status-im/status-app#21090](https://github.com/status-im/status-app/issues/21090)
(`needs-design`).

Built the same way as the [Swap prototype](https://github.com/xAlisher/status-token-swap-send):
Status design-system tokens, a desktop/mobile viewport switch, and a **version toggle** —
`Current` (a faithful recreation of the live Status chat, recreated from the QML source) →
`Threads` (the thread UI we design on top).

**Live:** https://xalisher.github.io/threads-status/

## Run locally
```bash
pnpm install
pnpm dev      # http://localhost:5173/threads-status/
pnpm build    # → dist/  (deployed to GitHub Pages on push to main)
```

## Approach
1. Recreate the current community-channel chat faithfully (`version=current`) — message row, header,
   composer, reply patterns — from the Status QML source (`StatusMessage.qml`, `ChatView.qml`,
   `StatusChatInputNew.qml`, `StatusMessageReply.qml`; Storybook pages are the golden spec).
2. Design **threads** on top (`version=Threads`): thread indicator, start-a-thread, thread view
   (desktop side-panel / mobile full-screen), navigation, threads index, notifications.
3. Port across Group chats and DMs (thin `chatType` variants).

Work is tracked as issues in this repo; each is one build → verify → deploy cycle, reviewed
issue-by-issue, then handed to review in a feedback loop.

## URL params
`?screen=chat&version=current|revamp&theme=dark|light&view=desktop|mobile` — plus per-state deep-links
added as thread states land (the toolbar's Use-case and Review menus drive these).
