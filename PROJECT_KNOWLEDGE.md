# PROJECT_KNOWLEDGE — threads-status

Living record of what this prototype is and the non-obvious things that bite. Architecture and
patterns that otherwise live only in commit messages. Update on every retro.

## What it is

Clickable prototype of Conversation Threads (epic `status-im/status-app#21090`, reviewer **Volo =
GitHub `sunleos``). Vanilla JS + Vite, deploys to `xalisher.github.io/threads-status` via `deploy.yml`.
Commit direct to `main`. It's a **product-review loop**, not a source-fidelity recreation — the
reviewer leaves numbered comments; each round is one focused change, rendered + verified, committed.

## Build / serve loop

`npx vite build 2>&1 | tail -1` then symlink `dist` into the local static server:
`mkdir -p /tmp/thserve && ln -sfn ~/threads-status/dist /tmp/thserve/threads-status`.
Serve with `cd /tmp/thserve && python3 -m http.server 4189`. **`/tmp/thserve` and the server die
across reboots/idle** — recreate the dir, relink, and restart in one line before testing (don't
assume they persist). Cache-bust every navigation with `&cb=xxx`; `&reset=1` reseeds the store.

## Architecture

- `src/main.js` — two screens: `chat` (community / DM / group) and `threads` (full-screen thread,
  **mobile only**). `normalizeDesktopThreads()` rewrites any `screen=threads` on desktop into the
  `chat` equivalent (thread → side panel or centre column), so there is **no standalone full-screen
  thread on desktop**. The desktop shell is a flex row: nav · left · center · right, with resizable
  dividers (widths persisted in `localStorage panelWidths`).
- `src/thread-store.js` — sessionStorage-persisted, seeded. `closed` flag = **archived** (see below).
- `src/screens/community-channel.js` — the chat, in-chat thread cards, Details panel, copied-post
  rendering, and MOST binding (`bindThreadAffordances`, `bindThreadPanel`). Threads UI is
  `version=revamp` only.
- `src/screens/threads.js` — thread view, create flow, thread menu, composer. Imports `msg`,
  `CHANNEL_ICONS`, `INFO_ICON` from community-channel.js.
- URL params carry all view state (`chat`, `tpanel`, `tmain`, `info`, `surface`, `copy`, `mlist`).

### Thread open surfaces (desktop)
- **in-chat card** → right **side panel** (`tpanel`).
- **channel-list row** → thread in the **centre column** (`tmain`) + its Details in the third column.
  `bindThreadPanel(p, cfg)` binds *either* — pass `{rootSel, threadIdParam, closeFn}`.
- Mobile: both go full-screen (`screen=threads`).

### Details panel (#21971)
`info` param → Members · Media · Pins · Links · Threads, each searchable. It **replaces the old
standalone members pane** — Details (default Members) is the persistent right column; a thread takes
the column while open and closing it falls back to Details. `info=closed` hides it. Opened by the
single **(i)** header button (desktop right column; mobile = full-screen overlay with a back-arrow
thread-style header — the (i) is *not* on the thread page). Threads tab row → `openThreadMain`.

## Semantics / conventions

- **Archived ≠ closed/locked.** The `closed` store flag means *archived*: tucked out of the active
  roster, but **still repliable** (composer stays, no lock, no "no new replies" bar). `postReply`
  must not block on `closed`. UI: archive-box icon, never a lock. Menu: Archive / Unarchive.
- **Send-copy → "replied to a thread: #name".** A reply with the send-copy checkbox posts to the
  thread AND appends a `parentPost` to the channel, grouped/stacked per thread under one header
  (`renderCopiedGroups`). The thread reply gets an "Also sent to the channel" tag (`opts.alsoSent`).
  If the thread is later deleted, the copy persists but the tag reads **"from a deleted thread"** (no
  dead link) — check `store.getThread(id)?.deleted` at render.

## Gotchas (bit us; verify before repeating)

- **Custom checkbox double-toggle.** A `<label>`-wrapped custom checkbox toggled by BOTH the native
  click and a manual row handler → they cancel (net no change), so clicks look dead. Fix:
  `pointer-events:none` on the checkbox so every mouse click routes through the row's single manual
  toggle; guard the handler with `e.target === checkbox` so keyboard Space (native) doesn't double.
- **`:focus-within`-revealed rows hide mid-click.** Pressing non-focusable label text blurs the
  input on `mousedown` → the row `display:none`s before the click lands. Fix: `preventDefault` the
  row's `mousedown` to keep focus.
- **Two composer bind paths.** `bindThread` (threads.js) and `bindThreadPanel` (community-channel.js)
  both wire the thread composer — keep send-copy / edit / menu logic in sync across both.
- **`.thread-view__back svg` is flipped** (`transform: scaleX(-1)`). Reusing an already-left arrow
  under that class points it right — cancel the flip for reused headers.

## Verification method

Every change is rendered and DOM-checked before commit (CDP: `javascript_tool` reads the DOM;
`computer` screenshots). **When a UI action "doesn't work," suspect the test harness first** — raw
screenshot click coordinates are in device pixels and mismatch the page viewport under
`devicePixelRatio ≠ 1`, producing false "didn't toggle" reads. Verify interactions with
`elementFromPoint(x,y)` hit-testing or events dispatched on the resolved element, not raw coordinates.
