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
- `src/thread-store.js` — sessionStorage-persisted, seeded (key `…-v4`; **bump the key when adding
  a field to seeded threads**, or a resumed session renders with it undefined). `closed` flag =
  **archived** (see below).
- `src/screens/community-channel.js` — the chat, in-chat thread cards, Details panel, copied-post
  rendering, and MOST binding (`bindThreadAffordances`, `bindThreadPanel`). Threads UI is
  `version=revamp` only.
- `src/screens/threads.js` — thread view, create flow, thread menu, composer. Imports `msg`,
  `CHANNEL_ICONS`, `INFO_ICON` from community-channel.js.
- URL params carry all view state (`chat`, `tpanel`, `tmain`, `info`, `surface`, `copy`, `mlist`).

### Starting a thread (#22273 / #22274)
Two entry points, deliberately different shapes:
- **From a NEW message (#22273)** — the composer thread icon is a **toggle**, not a link. On, a
  thread-name row appears *inside* `.chat-input__box` above the message row; off, it clears and
  hides. The name field is a **placeholder-only** prefill (first 50 chars of the message being
  typed, else "Add thread name here") so an untouched field means "no name chosen" and Send derives
  the title itself; `maxlength` = `store.TITLE_MAX` (100). Send → `createThread` → right sidebar.
  This is why the revamp channel composer is **live** (not `readonly`): a non-thread send calls
  `store.postChannelMessage`, otherwise Send would read as broken.
- **From an EXISTING message (#22274)** — context menu *and* hover quick-actions, thread icon
  immediately after Reply. Both call `startThreadFromMessage()`; the hover-bar button is **injected
  at bind time** (revamp-only path) so `quickActions()` keeps its certified 5-button set.

### Thread title (#22275)
Titles are **stored escaped** (like message text) because every surface interpolates them into HTML.
Inline rename reads the rendered `textContent` back, so entities round-trip instead of double-
escaping. Only `store.isCreator(t)` (`createdBy === 'You'`) gets the pencil. **Anything that caches a
title is a rename bug** — `parentPosts[].threadTitle` is a snapshot, so the "replied to a thread:
#name" header reads `store.getThread(id).title` live instead.

### Mute (#22282)
Mute lives **only in the thread "…" menu**, never as a header bell. The muted *state* still has to
read somewhere, so it is a passive glyph beside the header subtitle.

### Thread context menu (#22401)
One menu, two ways in: the **"…"** button on the thread view, and **right-click / long-press on a
thread row** in the channel or Messages list (`bindThreadRowMenu`, which passes `opts.at` so the menu
opens at the pointer and flips to stay in the viewport). Contents, each traced to its story:
`Edit name` (#22275) · `Follow/Unfollow` (#22283) · `Mute thread ›` (#22282) · `Mark as read`
(#22402) · `Copy link` desktop / `Share link` mobile (#22285) · `Pin to list` / `Unpin from list`
(#22284) · `Delete` (#22280). No Archive — see the archived note below.

- **Mute is a duration submenu**, not a toggle — `MuteChatMenuItem.qml` offers For 15 mins / 1 hour /
  8 hours / 24 hours / 7 days / Until I turn it back on. Once muted the row collapses to a single
  `Unmute thread`.
- **"Creator OR community admin"** gates Edit name and Delete (`store.canManageThread`). "You" own
  this community (the members list gives You the crown), so on the **channel** surface you can manage
  every thread; a DM/group has no admin, so it stays creator-only there. Test both.
- **Opening a thread auto-clears its unread**, so "Mark as read" cannot be observed from inside an
  open thread — verify it from the row context menu instead.

### Details panel: toggle + About
The **(i)** header button is a *pure panel toggle* (open → close, whatever tab is showing); the
search button is tab-aware (switches to Media, closes if Media is already up). The panel has **no
close X**. `info=closed` must be checked BEFORE the desktop "Details is the persistent right column"
fallback — otherwise the fallback reopens it instantly and the panel can never be dismissed (the old
close X was dead for exactly this reason). The tab row **scrolls horizontally**: six tabs do not fit
a narrow resizable panel, so the active tab is `scrollIntoView`d after every render.

**About** (last tab, community surface only — `infoTabsFor(surface)`) is built from source:
`ProfilePopupOverviewPanel.qml` for the description (primaryTextFontSize / directColor1 / wrap /
16px side margins) and `StatusCommunityTag.qml` for the pills (32px high, radius height/2, 1px
baseColor2 border, transparent fill → primaryColor2 on hover, 18px emoji + 5px gap + DemiBold
**AllLowercase** primaryColor1 name, content + 20 wide; Flow spacing 10). Lowercasing is a *font*
property in the source, so the markup keeps real casing and CSS does `text-transform: lowercase` —
search, copy-paste and screen readers still get the proper name.

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

- **Renaming is menu-only.** The hover pencil and the title dblclick are gone (#22275 §1, #21933 §2);
  `startTitleEdit` is reached solely from **Edit name** in the context menu, on desktop and mobile.
- **Replying revives and auto-follows.** Per Volo on the epic (#21090, answering jrainville §4
  and §5), a thread archives on inactivity and "clicking on it, you can send a new message to it and
  it reappears on the left chat list". `postReply` therefore clears `closed` and sets `followed` —
  without the follow the thread still would not show in the channel list (`channelListThreads`
  filters on it), so the two have to move together.
- **There is no archived FLAG and no manual archive.** Volo dropped the closed-thread feature on the
  epic; archiving is now purely `store.isArchived(t)` — *no messages for a week and not pinned*. It
  only affects list visibility: an archived thread stays repliable and stays in the Threads list, and
  a reply revives it automatically (`postReply` bumps `lastActivityTs` and follows it). Never
  reintroduce a `closed` field, a lock glyph, or an Archive menu item.
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
- **The one thread glyph** is `src/icons/thread-glyph.js` — a leaf module with no imports, because
  community-channel.js ⇄ threads.js is a **circular pair** and reading an icon across it at module-
  eval time hits a TDZ. Vadym's official icon replaces that one string.
- **`channelListThreads` filters to followed threads**, so a seeded thread with `followed: false`
  silently has no list row anywhere. That is why the DM thread is seeded followed.
- **Mobile is an app frame, not a scrolling page.** `.shell__mobile-content` is a flex column with
  `overflow: hidden`; the mounted screen fills it and only its own body scrolls, so the chat header
  pins top and the composer pins to `.shell__mobile-tabs`. Any new mobile screen must be added to
  the `> .mobile-list, > .thread-screen, > .info-panel { flex: 1; min-height: 0 }` rule or it will
  grow past the frame.
- **The chat composer is the DESKTOP markup on mobile too** (`renderCenterPanel` is shared) and its
  icon row is wider than the phone frame — Send was clipped off-screen. `.shell--mobile` rules give
  every flex level `min-width: 0` and shrink the buttons. Adding an icon there can re-break Send.
- **Destructive actions confirm first.** Thread delete goes through `confirmDeleteThread()`, shaped
  like `ConfirmationDialog.qml` / `DeleteMessageConfirmationPopup.qml`: title, body, "Do not show
  this again", flat Cancel + Danger confirm. Focus lands on **Cancel**, never the destructive button.
  The skip pref is only written when the user actually confirms, never on cancel.
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
