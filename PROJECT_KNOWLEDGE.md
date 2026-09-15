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
**Both entry points share one composer treatment** — `threadNameRow()` + `bindThreadNameRow()` in
threads.js, used by the chat composer and by the thread-creation view. #22274 §1.2.3 made this
explicit: the create view must show the *same* name row and a thread icon that is already toggled
on. Do not fork them again.

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
  at bind time** (revamp-only path) so `quickActions()` keeps its certified 5-button set. The story
  says "context menu (Desktop **and Mobile**)" — the hover bar is invisible on touch, so messages
  also take a **long-press** (and right-click); without it mobile had no way to reach the menu at
  all. The create view then opens with the name row already open, its placeholder set to the first
  50 characters of the initiating message, the composer's thread icon toggled on, and focus in the
  **chat input** (§1.2.3.1) — not the name field.

### Thread title (#22275)
Titles are **stored escaped** (like message text) because every surface interpolates them into HTML.
Inline rename reads the rendered `textContent` back, so entities round-trip instead of double-
escaping. Only `store.isCreator(t)` (`createdBy === 'You'`) gets the pencil. **Anything that caches a
title is a rename bug** — `parentPosts[].threadTitle` is a snapshot, so the "replied to a thread:
#name" header reads `store.getThread(id).title` live instead.

### Mute (#22282)
Mute lives **only in the thread "…" menu**, never as a header bell. The muted *state* still has to
read somewhere, so it is a passive glyph beside the header subtitle.

### Thread composer placeholder + search
The reply placeholder is "Reply in **[thread icon]** [name]" (#21933 §2). A native `<textarea>`
placeholder is plain text, so it is drawn as a **ghost overlay** (`[data-ghost-placeholder]`) sitting
on the field's text origin with `pointer-events: none`, hidden as soon as there is content; the
textarea keeps the plain string as its `aria-label`. The header **Search** opens `openThreadSearch`
(#22281), shaped after `StatusSearchPopup.qml` with the location row pinned to the thread; picking a
result sets the `hl` param, so it reuses the same jump-and-flash path as a copied channel message.

### Thread context menu (#22401)
One menu, reachable from **every representation of a thread**: the **"…"** button on the thread
view, and **right-click / long-press** on a channel-list row, a Messages chat-list row, the in-chat
thread card, or a card in the Details ▸ Threads list. Because they share one menu, destructive
actions cannot diverge — the delete confirmation fires from all of them. Add a new thread
representation and it must go into `bindThreadRowMenu`'s selector list too (`bindThreadRowMenu`, which passes `opts.at` so the menu
opens at the pointer and flips to stay in the viewport). Contents, each traced to its story:
`Edit name` (#22275) · `Follow/Unfollow` (#22283) · `Mute thread ›` (#22282) · `Mark as read`
(#22402) · `Copy link` desktop / `Share link` mobile (#22285) · `Pin to list` / `Unpin from list`
(#22284) · `Delete` (#22280). No Archive — see the archived note below.

- **The toast queue must be drained on EVERY screen.** `store.takeToast()` used to run only where a
  thread view is bound, so a context-menu action fired from a roster row (no thread open) queued a
  toast that surfaced later over an unrelated thread. `bindThreadAffordances` now drains whatever is
  left after the thread binders. `floatToast` also makes its root `position: relative` if it is
  static — otherwise the absolutely-positioned toast centres on the window, not the column.
- **Menus are positioned `fixed`, in viewport coordinates** — never `absolute` against the container
  they are appended to. `root` differs per surface: `.thread-panel` is `position: relative` but
  `.shell__center .thread-view` is **static**, so an absolute offset measured against root silently
  resolved against `<body>` and threw the menu ~380px sideways and 68px up. Testing only the side
  panel hid it. `placeMenu`/`placeFlyout` clamp to the viewport; on mobile they lay out as a sheet
  inside the **phone frame** (`.shell--mobile`), because `fixed` would otherwise span the whole
  browser window around the phone mock.
- **A muted thread shows the muted mark on every list representation** (#22282 §1): the channel/chat
  list row and the thread card (so the Details ▸ Threads list carries it too), alongside the glyph
  already in the thread header.
- **Mute is a duration submenu**, not a toggle — `MuteChatMenuItem.qml` offers For 15 mins / 1 hour /
  8 hours / 24 hours / 7 days / Until I turn it back on. Once muted the row collapses to a single
  `Unmute thread`.
- **"Creator OR community admin"** gates Edit name and Delete (`store.canManageThread`). "You" own
  this community (the members list gives You the crown), so on the **channel** surface you can manage
  every thread; a DM/group has no admin, so it stays creator-only there. Test both.
- **Opening a thread auto-clears its unread**, so "Mark as read" cannot be observed from inside an
  open thread — verify it from the row context menu instead.
- **The in-chat thread card is a COLUMN** (#21932): title row on top — **icon, then title, then the
  unread badge** — followed by avatars + count. The icon led the title, moved to the top-right on
  10 Sep, and was moved back on 14 Sep ("users read left to right"); do not move it again without
  checking the issue., then the last-message line, all flush to
  the card's left edge. The **deleted-thread tombstone reuses `.thread-card`**, so it needs
  `flex-direction: row` put back explicitly or it stacks into a tall pile.
- **Participants are creator-first, then most recent participation** (§2.2.1), six shown then `+N`.
  The creator is `t.createdBy`, NOT the author of the parent message — they are often different.
- **The card count includes the starting message** (§2.1), so it reads "N messages", not "N replies".
- **A read thread row carries NO badge.** Thread rows follow the channel-badge rule (`channelItem`):
  a count while unread, nothing once read. The roster row used to fall back to a *reply-count* badge
  when read, so "Mark as read" only changed the number and colour — the counter never went away.
- **Unread has two halves.** `unread` drives the badges (channel row, in-chat card, thread row,
  Activity Center); `newCount` drives the **new-messages marker** inside the thread
  (`NewMessagesMarker.qml` recreated: primaryColor1 rules either side of bold "N missed message(s)
  since <time>", NEW badge h16/radius 4). `markRead` (silent, on open) clears BOTH but does not
  re-render, so the marker stays on screen for the pass you are reading and is gone next visit;
  `markAllRead` clears both and emits, so the marker disappears at once. Without `newCount`,
  #22402 §2 has nothing visible to clear.

### Details panel: toggle + About
The **(i)** lives on the chat header **and** on a thread filling the main pane, so Details is always
toggleable from the central column (without it, #22279 §1's "thread spans centre and right when Info
is closed" was unreachable by hand). The side panel has no room for it and the mobile thread page
deliberately omits it. The **(i)** header button is a *pure panel toggle* (open → close, whatever tab is showing); the
search button is tab-aware (switches to Media, closes if Media is already up). The panel has **no
close X**. `info=closed` must be checked BEFORE the desktop "Details is the persistent right column"
fallback — otherwise the fallback reopens it instantly and the panel can never be dismissed (the old
close X was dead for exactly this reason). The tab row **scrolls horizontally**: six tabs do not fit
a narrow resizable panel, so the active tab is `scrollIntoView`d after every render.

The **Pins tab renders real chat messages** (#21971 §6): `PINNED_MESSAGES` holds msg() argument
tuples used by BOTH the chat stream and the tab, so the pin chip, avatar, name/time/tick, text and
reactions cannot drift apart. Adding a pinned message means adding a tuple, not editing two places.

Tabs are **Members · Threads · Pins** — the body's §1 list. **Media and Links are hidden, not
deleted** (#21971 §8, out of scope for the ticket): their renderers remain and `INFO_TABS_HIDDEN`
records them, so re-enabling is moving two entries back into `INFO_TABS`. A deep link to a hidden or
removed tab falls back to Members.

There is **no About tab** — removed on 14 Sep (#21971 §7): it described the channel/group/dm rather
than belonging in this panel, and its (i) icon read as a duplicate of the header's Info toggle.
Tabs are **icon-only and pinned to the bottom** of the panel (#21971 comment 3b) — `INFO_TAB_ICONS`;
Volo asked Rsttskyy for the final set and specifically for a different Members icon, so `group.svg`
stands in there. Search is **collapsed behind a button** in the panel header, matching
`UserListPanel.qml`: checkable button, box hidden until toggled, cleared on toggle, focused when
shown, Escape closes. The **Threads** tab renders real in-chat thread cards (comment 1) sorted by
latest activity — they sit in the right column, outside `bindThreadAffordances`'s `scope`, so they
are bound explicitly or they silently stop opening. Their rule needs `.info-panel` in front:
`.shell--mobile .thread-card` sets the chat's 48px left indent at equal specificity and wins on
source order, which put an ~80px empty gutter beside every card on mobile (#21971 §10).

### Thread open surfaces (desktop)
Closing a thread **closes the right column entirely** (`info=closed`) so the main pane expands —
#22279 §2.1 / #21933 §3. It used to fall back to the Details panel, which meant the sidebar never
actually went away. A main-pane thread (`tmain`) spans centre **and** right whenever Info is closed,
so `info=closed` must beat the `|| 'members'` fallback in the tmain branch as well as the normal one.
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
- **A copied post links back to its reply.** `parentPosts[].msgId` points at the thread message it
  came from, so clicking the copied line (or the #name link) opens the thread and flashes that exact
  reply (#21935 §2), carried through the open paths as the `hl` URL param. If you add a new way to
  create a copy, set `msgId` or the jump silently lands nowhere.
- **Send-copy → "replied to a thread: #name".** A reply with the send-copy checkbox posts to the
  thread AND appends a `parentPost` to the channel, grouped/stacked per thread under one header
  (`renderCopiedGroups`). The thread reply gets an "Also sent to the channel" tag (`opts.alsoSent`).
  If the thread is later deleted, the copy persists but the tag reads **"from a deleted thread"** (no
  dead link) — check `store.getThread(id)?.deleted` at render.

## Gotchas (bit us; verify before repeating)

- **The send-copy control is an ICON TOGGLE** on the thread composer's quick-icon bar (#21935), not
  a checkbox row. That removed the two workarounds below — keep them recorded because the same traps
  apply to any `:focus-within`-revealed row, but the send-copy row itself is gone.
- **Custom checkbox double-toggle.** A `<label>`-wrapped custom checkbox toggled by BOTH the native
  click and a manual row handler → they cancel (net no change), so clicks look dead. Fix:
  `pointer-events:none` on the checkbox so every mouse click routes through the row's single manual
  toggle; guard the handler with `e.target === checkbox` so keyboard Space (native) doesn't double.
- **`:focus-within`-revealed rows hide mid-click.** Pressing non-focusable label text blurs the
  input on `mousedown` → the row `display:none`s before the click lands. Fix: `preventDefault` the
  row's `mousedown` to keep focus.
- **The thread icon is the official `Thread.svg`** (supplied 2026-09-15), recoloured to
  `currentColor`. It lives in `src/icons/thread-glyph.js` — a leaf module with no imports, because
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
- **Deleting records WHO and WHEN.** `deleteThread` sets `deletedBy` and `deletedAtLabel`; without
  them the tombstone falls back to a placeholder and reads "? Someone deleted this thread" with no
  timestamp — which is what shipped for weeks, because only the *seeded* deleted thread carried the
  fields and nothing exercised the real delete path.
- **Every Delete goes through `confirmDeleteThread`** — the thread menu (from all four thread
  representations, "…" button or right-click/long-press) and the MESSAGE context menu's Delete when
  that message started a thread (deleting the root message deletes the thread). There is no path
  that deletes without the confirmation.
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
