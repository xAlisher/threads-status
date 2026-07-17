# Status Threads — prototype

A clickable vanilla HTML/CSS/JS prototype for **conversation threads** across Communities, Group
chats, and DMs — the design exploration for Status epic
[status-im/status-app#21090](https://github.com/status-im/status-app/issues/21090) (`needs-design`).

**Live:** https://xalisher.github.io/threads-status/

## Base (version = Current)
The faithful Community Channel chat is **ported from `status-redesign` ("QML-to-vanilla for Status")** —
an already-audited, source-traceable recreation of the live Status chat (message row with reply
connector / reactions / pinned / ENS + compressed-id header / delivery status / grouped messages, the
chat header, the channel list, and the composer), rendered against the original Status theme + shell.
Verified pixel-identical to the source via `tools/screen-diff.py`.

## Threads (version = Threads)
The thread UI we design on top of that base — thread indicator, start-a-thread, thread view
(desktop side-panel / mobile full-screen), navigation, threads index, notifications — then ported
across Group chats and DMs.

## Fidelity discipline
Any *new* Status sub-component recreated here goes through the gate in
[`docs/recreate-from-source.md`](docs/recreate-from-source.md): read the full component chain
(named file + base type + instantiated controls) with `tools/qml-callsite|states|resolve|icon`,
lift icons verbatim, and **pixel-sample every colour on both renders** (`tools/sample-color.sh`,
`element-map.py`, `screen-diff.py`) — never assume, never claim from the token. See `docs/skills/`
and the completed `docs/audit/*-community-channel.md`. `tools/recreate-guard.sh` is wired as a
PreToolUse hook on screen edits.

## Run locally
```bash
pnpm install
pnpm dev      # http://localhost:5173/threads-status/
pnpm build    # → dist/  (deployed to GitHub Pages on push to main)
```

## URL params
`?screen=chat&version=current|revamp&theme=dark|light&view=desktop|mobile` — plus per-state deep-links
as thread states land (toolbar Review menu drives reviewer-feedback deep-links).
