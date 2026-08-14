// Conversation Threads — shared in-memory thread store (epic status-im/status-app#21090).
// Single source of truth for all thread state. Every thread surface (in-chat card, thread view,
// threads list, channel-list rows, notifications) reads from here; every action (create, post,
// edit, follow, mute, close, delete, keep-visible, copy-to-parent) mutates here and notifies
// subscribers, which re-render. Persisted to sessionStorage so state is durable across the
// deep-link navigations (which do a full reload) within a tab.

const KEY = 'threads-status-store-v3'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// ---- surfaces: consistent thread experience across chat types (epic: Communities/Group/DM) ----
export const SURFACES = {
  channel: { label: '# general',   in: 'in # general',            copy: 'Send copy to #general',   screen: 'chat' },
  group:   { label: 'Design Team', in: 'in Design Team',          copy: 'Send copy to Design Team', screen: 'group' },
  dm:      { label: 'carmen.eth',  in: 'in chat with carmen.eth', copy: 'Send copy to carmen.eth',  screen: 'dm' },
}

let listeners = []
let state = null

// --- seed data: a realistic starting set so every surface renders live on first load ---
function seed() {
  const now = Date.now()
  const min = 60 * 1000, hr = 60 * min, day = 24 * hr
  return {
    // monotonic id counter — PERSISTED so ids never collide across the deep-link reloads
    seq: 100,
    // messages the user copied from a thread into a parent conversation (keyed by surface)
    // seeded example so the "replied to a thread" state is always visible in the demo
    parentPosts: {
      channel: [
        { id: 'pp-r2', name: 'You', initial: 'A', color: '#4360DF', time: '10:33', text: 'Thinking 3 levels max. Beyond that we collapse older replies.', threadId: 't-m1', threadTitle: 'Threads MVP' },
        { id: 'pp-r3', name: 'You', initial: 'A', color: '#4360DF', time: '10:34', text: 'Sharing the summary back to the channel too.', threadId: 't-m1', threadTitle: 'Threads MVP' },
      ],
      group: [], dm: [],
    },
    // toast queue drained by the renderer
    toast: null,
    threads: [
      {
        id: 't-m1', surface: 'channel', channelLabel: '# general', parentMsgId: 'cc-1',
        parentMsg: ['Marcus', 'M', '#26A69A', '10:25', '11 themes built in one session — Nord, Dracula, Solarized, even a hacker green-on-black one. All live-swappable.', { senderId: '0x04d7e1...a92b05' }],
        title: 'Threads MVP',
        messages: [
          { id: 'r1', name: 'Volo', initial: 'V', color: '#D37EF4', time: '10:31', text: "Nice. What's the main goal — better conversations or more engagement?", own: false, ts: now - 40 * min, opts: { ensName: 'volo.eth', senderId: '0x04zQ39...9d4Gs0' } },
          { id: 'r2', name: 'You', initial: 'A', color: '#4360DF', time: '10:33', text: 'Thinking 3 levels max. Beyond that we collapse older replies.', own: true, ts: now - 38 * min, opts: { delivery: 'delivered', alsoSent: true } },
          { id: 'r3', name: 'You', initial: 'A', color: '#4360DF', time: '10:34', text: 'Sharing the summary back to the channel too.', own: true, ts: now - 36 * min, opts: { delivery: 'delivered', alsoSent: true } },
        ],
        followed: true, muted: false, closed: false, deleted: false, keptVisible: false,
        unread: true, newCount: 2, lastActivityTs: now - 3 * min,
      },
      {
        id: 't-design', surface: 'channel', channelLabel: '# design', parentMsgId: 'm3',
        parentMsg: ['Elena', 'E', '#D37EF4', '09:12', 'Starting the design-tokens migration today — moving every hardcoded colour to a CSS var.', { ensName: 'elena.eth', senderId: '0x04a2b9...c3f8e1' }],
        title: 'Design tokens migration',
        messages: [
          { id: 'd1', name: 'Elena', initial: 'E', color: '#D37EF4', time: '09:20', text: 'Base palette is done. Semantic layer next.', own: false, ts: now - 12 * hr, opts: {} },
          { id: 'd2', name: 'Marcus', initial: 'M', color: '#26A69A', time: '09:44', text: 'Nice — I can restyle a whole screen from one file now.', own: false, ts: now - 11 * hr, opts: {} },
        ],
        followed: true, muted: false, closed: false, deleted: false, keptVisible: false,
        unread: false, lastActivityTs: now - 1 * hr,
      },
      {
        id: 't-roadmap', surface: 'channel', channelLabel: '# announcements', parentMsgId: 'm6',
        parentMsg: ['Marcus', 'M', '#26A69A', '08:00', 'Q3 roadmap is up for review — threads, wallet revamp, and the new activity center.', { senderId: '0x04d7e1...a92b05' }],
        title: 'Q3 roadmap',
        messages: [
          { id: 'q1', name: 'Dana', initial: 'D', color: '#2A799B', time: '08:15', text: 'Can we pull the activity center forward?', own: false, ts: now - 3 * hr, opts: {} },
        ],
        followed: false, muted: false, closed: false, deleted: false, keptVisible: true,
        unread: false, lastActivityTs: now - 3 * hr,
      },
      {
        id: 't-release', surface: 'channel', channelLabel: '# status-go', parentMsgId: 'm7',
        parentMsg: ['Kai', 'K', '#FE8F59', 'Mon', 'Release notes for v2.30 — anyone remember the exact migration order?', { senderId: '0x04f3c8...7d1e02' }],
        title: 'Old release notes',
        messages: [
          { id: 'x1', name: 'Sam', initial: 'S', color: '#C4A052', time: 'Mon', text: 'Archived — see the wiki.', own: false, ts: now - 15 * day, opts: {} },
        ],
        followed: false, muted: false, closed: true, deleted: false, keptVisible: false,
        unread: false, lastActivityTs: now - 15 * day,
      },
      {
        id: 't-group', surface: 'group', channelLabel: 'Design Team', parentMsgId: 'g1',
        parentMsg: ['Elena', 'E', '#D37EF4', '11:02', 'Should the send-copy toggle default on or off?', { ensName: 'elena.eth' }],
        title: 'Copy-to-parent default',
        messages: [
          { id: 'gr1', name: 'You', initial: 'A', color: '#4360DF', time: '11:05', text: 'Off by default — least surprise.', own: true, ts: now - 20 * min, opts: { delivery: 'delivered' } },
        ],
        followed: true, muted: false, closed: false, deleted: false, keptVisible: false,
        unread: true, newCount: 1, lastActivityTs: now - 6 * min,
      },
      {
        id: 't-dm', surface: 'dm', channelLabel: 'carmen.eth', parentMsgId: 'dm1',
        parentMsg: ['carmen.eth', 'C', '#887AF9', '14:20', 'Two topics at once — let me thread the design one.', {}],
        title: 'Avatar sizes',
        messages: [
          { id: 'dm_r1', name: 'carmen.eth', initial: 'C', color: '#887AF9', time: '14:21', text: '32px in the member list, 24 in the channel list.', own: false, ts: now - 2 * hr, opts: {} },
        ],
        followed: false, muted: false, closed: false, deleted: false, keptVisible: false,
        unread: false, lastActivityTs: now - 2 * hr,
      },
      {
        // deleted thread — still depicted in-chat as a tombstone under its parent (#21932 §4)
        id: 't-deleted', surface: 'channel', channelLabel: '# general', parentMsgId: 'cc-3',
        parentMsg: ['Elena', 'E', '#D37EF4', '10:30', 'Exactly. The design system lives in the browser now, not in Figma. Agent-readable and human-visible at the same time.', { ensName: 'elena.eth', senderId: '0x04a2b9...c3f8e1' }],
        title: 'Figma vs browser',
        messages: [
          { id: 'del1', name: 'Kai', initial: 'K', color: '#FE8F59', time: '10:31', text: 'Does this kill the Figma handoff entirely?', own: false, ts: now - 5 * hr, opts: {} },
        ],
        followed: false, muted: false, closed: false, deleted: true, keptVisible: false,
        unread: false, lastActivityTs: now - 5 * hr,
        deletedBy: { name: 'Marcus', initial: 'M', color: '#26A69A' }, deletedAtLabel: 'Today 1:04 PM',
      },
      {
        // closed thread — shown in-chat with a lock after the reply-count badge (no new replies)
        id: 't-closed-chat', surface: 'channel', channelLabel: '# general', parentMsgId: 'cc-6',
        parentMsg: ['Marcus', 'M', '#26A69A', '10:36', 'About 3 hours with two agents running — builder writes code, auditor verifies against QML. Cost maybe $25 in API tokens.', { senderId: '0x04d7e1...a92b05' }],
        title: 'Token cost breakdown',
        messages: [
          { id: 'tc1', name: 'Dana', initial: 'D', color: '#2A799B', time: '10:40', text: 'Is that per run or per day?', own: false, ts: now - 4 * hr, opts: {} },
          { id: 'tc2', name: 'Marcus', initial: 'M', color: '#26A69A', time: '10:42', text: 'Per full run. Wrapping this one up.', own: false, ts: now - 4 * hr, opts: {} },
        ],
        followed: true, muted: false, closed: true, deleted: false, keptVisible: false,
        unread: false, lastActivityTs: now - 4 * hr,
      },
    ],
  }
}

function computeParticipants(t) {
  const seen = new Map()
  // dedup by stable identity (sender name), NOT initial+color — two people can share both
  const push = (id, i, c) => { const k = id || (i + '·' + c); if (!seen.has(k)) seen.set(k, { i, c }) }
  // parent author first
  push(t.parentMsg[0], t.parentMsg[1] || '?', t.parentMsg[2] || '#4360DF')
  t.messages.forEach(m => push(m.name, m.initial || '?', m.color || '#4360DF'))
  return [...seen.values()]
}

function load() {
  try { const raw = sessionStorage.getItem(KEY); return raw ? JSON.parse(raw) : null } catch { return null }
}
function persist() { try { sessionStorage.setItem(KEY, JSON.stringify(state)) } catch {} }

function ensure() {
  if (state) return state
  const p = new URLSearchParams(location.search)
  const doReset = p.get('reset') === '1'
  state = (doReset ? null : load()) || seed()
  // migrate/repair the id counter for states persisted before seq was tracked: never below the
  // highest numeric id already in use, so a resumed session can't mint a colliding id
  if (typeof state.seq !== 'number') state.seq = deriveSeq(state)
  // reset is one-shot: strip it from the URL so later navigations don't reseed and wipe live state
  if (doReset && typeof history !== 'undefined') {
    try { const u = new URL(location.href); u.searchParams.delete('reset'); history.replaceState(null, '', u) } catch {}
    persist()
  }
  return state
}

function emit() { persist(); listeners.forEach(fn => { try { fn() } catch (e) { console.error(e) } }) }

// ---- subscription ----
export function subscribe(fn) { listeners.push(fn) }

// ---- reads ----
export function getThread(id) { return ensure().threads.find(t => t.id === id) || null }
export function participants(t) { return computeParticipants(t) }

// visible on a surface's threads list: not deleted; Active = open, Past = closed
export function threadsForSurface(surface) {
  return ensure().threads.filter(t => t.surface === surface && !t.deleted)
}
// all non-deleted threads (used by the combined threads list)
export function allThreads() { return ensure().threads.filter(t => !t.deleted) }

// threads to show under a parent message in the channel (the in-chat card)
export function threadForParent(parentMsgId, surface = 'channel') {
  return ensure().threads.find(t => t.parentMsgId === parentMsgId && t.surface === surface && !t.deleted) || null
}
// any thread incl. deleted — the in-chat card renders a "deleted" tombstone for these (#21932 §4)
export function threadForParentAny(parentMsgId, surface = 'channel') {
  return ensure().threads.find(t => t.parentMsgId === parentMsgId && t.surface === surface) || null
}

// channel-list rows (epic §6): active/followed threads that haven't disappeared (§6.1)
export function channelListThreads(surface = 'channel') {
  const now = Date.now()
  return ensure().threads.filter(t => {
    if (t.deleted || t.surface !== surface) return false
    if (t.keptVisible) return true            // §6.1: kept permanently visible (overrides all below)
    if (t.closed) return false                // §6.1: closes → disappears
    if (now - t.lastActivityTs > WEEK_MS) return false // §6.1: no new messages within 1 week
    if (!t.followed) return false             // #22: the channel list shows followed threads
    return true
  })
}

// posts the user copied into a parent conversation (epic §3.1)
export function parentPosts(surface = 'channel') { return ensure().parentPosts[surface] || [] }

// unread count on followed, non-muted threads (epic §5 notifications badge)
export function unreadCount() {
  return ensure().threads.filter(t => !t.deleted && t.followed && !t.muted && t.unread).length
}

export function takeToast() { const s = ensure(); const t = s.toast; if (t) { s.toast = null; persist() } return t }

// pending parent-message snapshot for the create flow — persisted so it survives the reload
export function setPendingParent(id, tuple) { const s = ensure(); (s.pendingParents = s.pendingParents || {})[id] = tuple; persist() }
export function getPendingParent(id) { return (ensure().pendingParents || {})[id] || null }

// ---- mutations ----
// id counter lives IN state (persisted) so ids are unique across reloads within a tab
const nid = (p) => `${p}${++ensure().seq}`
// highest numeric id suffix across all stored ids — the floor for a repaired seq
function deriveSeq(s) {
  let max = 100
  const scan = (id) => { const m = /(\d+)$/.exec(String(id || '')); if (m) max = Math.max(max, +m[1]) }
  ;(s.threads || []).forEach(t => { scan(t.id); (t.messages || []).forEach(msg => scan(msg.id)) })
  Object.values(s.parentPosts || {}).forEach(arr => (arr || []).forEach(pp => scan(pp.id)))
  return max
}

export function createThread({ surface = 'channel', parentMsgId = null, parentMsg = null, title = '', firstMessage = '' }) {
  const s = ensure()
  const sc = SURFACES[surface] || SURFACES.channel
  const now = Date.now()
  const t = {
    id: nid('t-'), surface, channelLabel: sc.label, parentMsgId,
    parentMsg: parentMsg || ['You', 'A', '#4360DF', 'now', 'New thread', { own: true }],
    title: title.trim() || (firstMessage.trim().slice(0, 40)) || 'New thread',
    messages: [], followed: true, muted: false, closed: false, deleted: false, keptVisible: false,
    unread: false, lastActivityTs: now,
  }
  if (firstMessage.trim()) {
    t.messages.push({ id: nid('r'), name: 'You', initial: 'A', color: '#4360DF', time: timeNow(), text: escapeText(firstMessage.trim()), own: true, ts: now, opts: { delivery: 'sent' } })
  }
  s.threads.unshift(t)
  emit()
  return t
}

export function postReply(threadId, text, { copyToParent = false } = {}) {
  const t = getThread(threadId); if (!t || t.deleted) return null   // archived threads stay repliable
  const now = Date.now()
  const m = { id: nid('r'), name: 'You', initial: 'A', color: '#4360DF', time: timeNow(), text: escapeText(text.trim()), own: true, ts: now, opts: { delivery: 'sent', alsoSent: copyToParent } }
  t.messages.push(m)
  t.lastActivityTs = now
  if (copyToParent) {
    const s = ensure()
    ;(s.parentPosts[t.surface] = s.parentPosts[t.surface] || []).push({
      id: nid('pp'), name: 'You', initial: 'A', color: '#4360DF', time: timeNow(),
      text: escapeText(text.trim()), threadId: t.id, threadTitle: t.title,
    })
  }
  emit()
  return m
}

export function editMessage(threadId, msgId, text) {
  const t = getThread(threadId); if (!t) return
  const m = t.messages.find(x => x.id === msgId); if (!m || !m.own) return
  m.text = escapeText(text.trim())
  m.opts = { ...m.opts, edited: true }
  emit()
}

// simulate inbound activity on a thread (drives the notification badge — demo trigger)
export function simulateActivity(threadId) {
  const t = getThread(threadId); if (!t || t.closed || t.deleted) return
  const now = Date.now()
  t.messages.push({ id: nid('r'), name: 'Marcus', initial: 'M', color: '#26A69A', time: timeNow(), text: 'Good point — following up in the thread.', own: false, ts: now, opts: {} })
  t.lastActivityTs = now
  if (!t.muted) t.unread = true
  emit()
}

export function setFollowed(threadId, followed) {
  const t = getThread(threadId); if (!t) return
  t.followed = followed
  // unfollowing clears any pending unread — an unfollowed thread must not keep a stale dot (#19)
  if (!followed) { t.unread = false; ensure().toast = 'You unfollowed this thread' }
  emit()
}
export function setMuted(threadId, muted) {
  const t = getThread(threadId); if (!t) return
  t.muted = muted
  if (muted) t.unread = false // muting suppresses the notification (epic §5)
  ensure().toast = muted ? 'Thread muted' : 'Thread unmuted'
  emit()
}
export function closeThread(threadId) {
  const t = getThread(threadId); if (!t) return
  t.closed = true; t.unread = false
  ensure().toast = 'Thread archived'
  emit()
}
export function reopenThread(threadId) {
  const t = getThread(threadId); if (!t) return
  // reopen must NOT refresh activity — only a real reply does; otherwise a long-stale thread
  // would jump back into the active channel list (§6.1) with no new message
  t.closed = false
  ensure().toast = 'Thread unarchived'
  emit()
}
export function deleteThread(threadId) {
  const t = getThread(threadId); if (!t) return
  t.deleted = true
  ensure().toast = 'Thread deleted'
  emit()
}
export function setKeptVisible(threadId, kept) {
  const t = getThread(threadId); if (!t) return
  t.keptVisible = kept
  ensure().toast = kept ? 'Thread kept visible' : 'Thread no longer pinned'
  emit()
}
export function markRead(threadId, { silent = false } = {}) {
  const t = getThread(threadId); if (!t || !t.unread) return
  t.unread = false
  if (silent) persist(); else emit()
}

// ---- helpers ----
function timeNow() {
  const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
function escapeText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// expose a tiny debug handle for verification harnesses
if (typeof window !== 'undefined') window.__threadStore = {
  getThread, allThreads, ensure, simulateActivity, unreadCount,
  channelListThreads, threadsForSurface, setFollowed, setMuted, closeThread, deleteThread, setKeptVisible,
}
