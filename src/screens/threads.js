// Conversation Threads (Status epic #21090) — thread surfaces on top of the certified Community
// Channel. Reuses the message row `msg()`, composer icons, and quick-actions from community-channel.js.
// Routed by ?view=create|thread|list ; states via ?state / ?copy / ?following / ?surface.
// Figma-designed: create→view flow + "Send copy to #channel" toggle. Un-mocked pieces (thread list,
// follow/unfollow, closed/deleted) are built minimal-first from the epic text.

import { msg, CHANNEL_ICONS, formatGroup } from './community-channel.js'

// --- net-new thread icons (no thread concept in QML source; Status line style, 24 viewBox) ---
const THREAD_ICONS = {
  back: `<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // reply-in-thread glyph — speech bubble with a return arrow (mirrors the Figma context-menu icon)
  thread: `<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a8.38 8.38 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13.5 9.5 11 12l2.5 2.5M11 12h3.2a2.3 2.3 0 0 1 0 4.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  bellOff: `<svg viewBox="0 0 24 24" fill="none"><path d="M13.7 21a2 2 0 0 1-3.4 0M18 8a6 6 0 0 0-9.3-5M6 8c0 7-3 9-3 9h13M3 3l18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.4"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
}

// --- surfaces: community channel / group chat / DM (epic — consistent across chat types) ---
const SURFACES = {
  channel: { in: 'in # general',      copy: 'Send copy to # general' },
  group:   { in: 'in Design Team',    copy: 'Send copy to Design Team' },
  dm:      { in: 'in chat with carmen.eth', copy: 'Send copy to carmen.eth' },
}

// the demo thread's parent + replies (Volo / Alisher, matching the Figma frames)
const PARENT = ['Volo', 'V', '#D37EF4', '09:30', 'Morning! 👋 We need to start exploring the new Threads feature this sprint.',
  { reactions: ['😍 1', '🧠 1*'], ensName: 'volo.eth', senderId: '0x04zQ39...9d4Gs0' }]
const REPLIES = [
  ['Alisher', 'A', '#4360DF', '09:31', "Nice. What's the main goal? Better conversations or more engagement?", { senderId: '0x04zQ39...9d4Gs0' }],
  ['You', 'A', '#4360DF', '09:33', 'Thinking 3 levels max. Beyond that we collapse older replies.', { delivery: 'delivered' }],
]

// participant avatar stack (in-chat card + list rows)
function avatarStack(people) {
  return `<span class="thread-ava-stack">${people.map((p, i) =>
    `<span class="thread-ava" style="background:${p.c};z-index:${people.length - i}">${p.i}</span>`).join('')}</span>`
}

// composer — reuses .chat-input structure + formatGroup(); placeholder configurable
function threadComposer(placeholder) {
  return `
    <div class="chat-input thread-view__composer">
      <div class="chat-input__row">
        <button class="chat-input__cmd-btn" title="Commands">${CHANNEL_ICONS.chatCommands}</button>
        <div class="chat-input__box">
          <div class="chat-input__input-row">
            <textarea class="chat-input__field" placeholder="${placeholder}" rows="1" readonly></textarea>
            <div class="chat-input__actions">
              ${formatGroup()}
              <button class="chat-input__btn" title="Emoji">${CHANNEL_ICONS.emojis}</button>
              <button class="chat-input__btn" title="GIF">${CHANNEL_ICONS.gif}</button>
              <button class="chat-input__btn" title="Stickers">${CHANNEL_ICONS.stickers}</button>
              <button class="chat-input__btn chat-input__btn--send" title="Send">${CHANNEL_ICONS.send}</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
}

function threadHeader({ title, sub, following, muted, back = true, follow = true }) {
  const followBtn = follow ? `<button class="thread-view__follow${following ? ' on' : ''}" data-follow>${following ? `${THREAD_ICONS.check}<span>Following</span>` : '<span>Follow</span>'}</button>` : ''
  return `
    <div class="thread-view__header">
      ${back ? `<button class="thread-view__back" title="Back">${THREAD_ICONS.back}</button>` : ''}
      <div class="thread-view__titles">
        <span class="thread-view__title">${title}</span>
        <span class="thread-view__sub">${sub}</span>
      </div>
      <div class="thread-view__actions">
        ${followBtn}
        <button class="chat-header__action-btn" title="Search">${CHANNEL_ICONS.search}</button>
        <button class="chat-header__action-btn" data-mute title="${muted ? 'Unmute' : 'Mute'}">${muted ? THREAD_ICONS.bellOff : THREAD_ICONS.bell}</button>
        <button class="chat-header__action-btn" title="More">${CHANNEL_ICONS.more}</button>
      </div>
    </div>`
}

// ---- Creating Thread (Figma: parent pinned + "Thread name (optional)" + composer) ----
function renderCreate(surface, state) {
  const s = SURFACES[surface] || SURFACES.channel
  const name = state === 'title' || state === 'created' ? 'Threads MVP' : ''
  return `
    <div class="thread-view thread-create">
      ${threadHeader({ title: 'Creating Thread', sub: s.in, following: false, muted: false, follow: false })}
      <div class="thread-view__messages">
        <div class="thread-view__parent-label">Starting a thread from</div>
        ${msg(...PARENT)}
      </div>
      <div class="thread-create__foot">
        <input class="thread-create__name" type="text" value="${name}" placeholder="Thread name (optional)" ${state ? '' : 'autofocus'} />
        ${threadComposer('Type message')}
      </div>
      ${state === 'created' ? toast(`${THREAD_ICONS.check}Thread “Threads MVP” created`) : ''}
    </div>`
}

// ---- Thread view (parent + replies + composer + "Send copy" toggle) ----
function renderThread(surface, { copy, following, muted, state }) {
  const s = SURFACES[surface] || SURFACES.channel
  const title = 'Threads MVP'
  if (state === 'deleted') {
    return `<div class="thread-view thread-view--empty">
      ${threadHeader({ title, sub: s.in, following, muted })}
      <div class="thread-empty">${THREAD_ICONS.thread}<div class="thread-empty__title">This thread was deleted</div><div class="thread-empty__sub">The thread and its replies are no longer available.</div></div>
    </div>`
  }
  const closedBar = state === 'closed' ? `<div class="thread-closed-bar">${THREAD_ICONS.lock}This thread is closed — no new replies can be posted.</div>` : ''
  const composer = state === 'closed' ? '' : threadComposer('Reply in thread')
  const copyRow = state === 'closed' ? '' : `
    <label class="thread-copy${copy ? ' on' : ''}">
      <span class="thread-copy__label">${s.copy}</span>
      <span class="thread-copy__switch" data-copy><span class="thread-copy__knob"></span></span>
    </label>`
  return `
    <div class="thread-view">
      ${threadHeader({ title, sub: s.in, following, muted })}
      <div class="thread-view__messages">
        ${msg(...PARENT)}
        <div class="thread-view__reply-sep"><span>${REPLIES.length} replies</span></div>
        ${REPLIES.map(r => msg(...r)).join('')}
      </div>
      ${closedBar}
      ${composer}
      ${copyRow}
      ${following === 'toast' ? toast('You unfollowed this thread') : ''}
    </div>`
}

// ---- Threads list / index (epic 5/6: active + past threads in a channel) ----
const THREADS = [
  { title: 'Threads MVP', channel: '# general', replies: 3, when: '2m', unread: true, people: [{ i: 'V', c: '#D37EF4' }, { i: 'A', c: '#4360DF' }, { i: 'K', c: '#FE8F59' }] },
  { title: 'Design tokens migration', channel: '# design', replies: 12, when: '1h', unread: false, people: [{ i: 'E', c: '#D37EF4' }, { i: 'M', c: '#26A69A' }] },
  { title: 'Q3 roadmap', channel: '# announcements', replies: 5, when: '3h', unread: false, pinned: true, people: [{ i: 'M', c: '#26A69A' }, { i: 'A', c: '#4360DF' }, { i: 'D', c: '#2A799B' }] },
  { title: 'Old release notes', channel: '# status-go', replies: 8, when: '2w', closed: true, people: [{ i: 'S', c: '#C4A052' }, { i: 'K', c: '#FE8F59' }] },
]
function threadRow(t) {
  return `
    <div class="thread-row${t.unread ? ' unread' : ''}${t.closed ? ' closed' : ''}" data-open-thread>
      <span class="thread-row__icon">${t.closed ? THREAD_ICONS.lock : THREAD_ICONS.thread}</span>
      <div class="thread-row__body">
        <div class="thread-row__top"><span class="thread-row__title">${t.title}</span>${t.pinned ? '<span class="thread-row__pin" title="Kept visible">📌</span>' : ''}${t.unread ? '<span class="thread-row__dot" title="New messages"></span>' : ''}</div>
        <div class="thread-row__meta"><span class="thread-row__channel">${t.channel}</span><span class="thread-row__sep">·</span><span>${t.replies} replies</span><span class="thread-row__sep">·</span><span class="thread-row__when">${THREAD_ICONS.clock}${t.when}</span></div>
      </div>
      ${avatarStack(t.people)}
    </div>`
}
function renderList() {
  const active = THREADS.filter(t => !t.closed)
  const past = THREADS.filter(t => t.closed)
  return `
    <div class="thread-list">
      <div class="thread-list__header"><button class="thread-view__back" title="Back">${THREAD_ICONS.back}</button><span class="thread-list__title">Threads</span></div>
      <div class="thread-list__section">Active — ${active.length}</div>
      ${active.map(threadRow).join('')}
      <div class="thread-list__section">Past — ${past.length}</div>
      ${past.map(threadRow).join('')}
    </div>`
}

function toast(html) { return `<div class="thread-toast">${html}</div>` }

export function renderThreads() {
  const p = new URLSearchParams(location.search)
  const surface = p.get('surface') || 'channel'
  const v = p.get('tview') || 'thread'   // create | thread | list (?view= stays the viewport, per main.js)
  let center
  if (v === 'create') center = renderCreate(surface, p.get('state'))
  else if (v === 'list') center = renderList()
  else center = renderThread(surface, {
    copy: p.get('copy') === '1',
    following: p.get('following') === '1' ? true : (p.get('following') === 'toast' ? 'toast' : false),
    muted: p.get('muted') === '1',
    state: p.get('state'),
  })
  // Desktop: thread surface sits in the center slot as a focused panel; nav/left kept minimal for the prototype.
  return { nav: null, left: null, center: `<div class="thread-screen">${center}</div>`, right: null }
}

export function bindThreads() {
  const root = document.querySelector('.thread-screen')
  if (!root) return
  // "Send copy to #channel" toggle (epic 3.1)
  root.querySelector('[data-copy]')?.addEventListener('click', (e) => {
    e.currentTarget.closest('.thread-copy').classList.toggle('on')
  })
  // follow / unfollow (epic 1.2) — toggles label; unfollowing floats a toast
  root.querySelector('[data-follow]')?.addEventListener('click', function () {
    const on = this.classList.toggle('on')
    this.innerHTML = on ? `${THREAD_ICONS.check}<span>Following</span>` : '<span>Follow</span>'
    if (!on) floatToast(root, 'You unfollowed this thread')
  })
  // mute bell toggle
  root.querySelector('[data-mute]')?.addEventListener('click', function () {
    const muted = this.dataset.muted === '1'
    this.dataset.muted = muted ? '0' : '1'
    this.innerHTML = muted ? THREAD_ICONS.bell : THREAD_ICONS.bellOff
    this.title = muted ? 'Mute' : 'Unmute'
  })
  // back → return to the community channel
  root.querySelectorAll('.thread-view__back').forEach(b => b.addEventListener('click', () => {
    const p = new URLSearchParams(location.search); p.set('screen', 'chat'); p.delete('view'); location.search = p.toString()
  }))
  // list row → open that thread
  root.querySelectorAll('[data-open-thread]').forEach(r => r.addEventListener('click', () => {
    const p = new URLSearchParams(location.search); p.set('screen', 'threads'); p.set('tview', 'thread'); location.search = p.toString()
  }))
}

function floatToast(root, text) {
  root.querySelector('.thread-toast')?.remove()
  const el = document.createElement('div')
  el.className = 'thread-toast'
  el.innerHTML = `${THREAD_ICONS.check}${text}`
  root.appendChild(el)
  setTimeout(() => el.classList.add('hide'), 2600)
}
