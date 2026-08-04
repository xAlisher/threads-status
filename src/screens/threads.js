// Conversation Threads (Status epic #21090) — thread surfaces on top of the certified Community
// Channel. Reuses the message row `msg()`, composer icons, and quick-actions from community-channel.js.
// Fully data-driven from src/thread-store.js: create → view flow, editable composer with real send,
// "Send copy to #channel", follow/mute, close/delete, cross-surface, threads list + lifecycle.
// Routed by ?tview=create|thread|list with ?t=<threadId> / ?parent=<msgId> / ?surface / ?from.

import { msg, CHANNEL_ICONS, formatGroup } from './community-channel.js'
import * as store from '../thread-store.js'
import { SURFACES } from '../thread-store.js'

// ---- real Status icons lifted from StatusQ/src/assets/img/icons (recoloured → currentColor) ----
// Net-new thread glyph + clock have no source asset, so those stay hand-drawn (Status line style).
export const THREAD_ICONS = {
  // arrow-right.svg — flipped to point left for "back" via CSS (.thread-view__back svg)
  back: `<svg viewBox="0 0 24 24" fill="none"><path d="m13.4697 6.53033c-.2929-.29289-.2929-.76777 0-1.06066s.7677-.29289 1.0606 0l6 6.00003c.2929.2929.2929.7677 0 1.0606l-6 6c-.2929.2929-.7677.2929-1.0606 0s-.2929-.7677 0-1.0606l3.8661-3.8661c.315-.315.0919-.8536-.3536-.8536h-12.9822c-.41421 0-.75-.3358-.75-.75s.33579-.75.75-.75h12.9822c.4455 0 .6686-.5386.3536-.8536z" fill="currentColor"/></svg>`,
  // net-new reply-in-thread glyph (no QML source) — speech bubble with return arrow
  thread: `<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a8.38 8.38 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13.5 9.5 11 12l2.5 2.5M11 12h3.2a2.3 2.3 0 0 1 0 4.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // notification.svg
  bell: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.89941C13.2302 2.89946 14.6959 3.18992 15.8916 4.3877C17.077 5.57542 17.8869 7.54647 18.0635 10.6621C18.1092 11.4696 18.1292 11.7975 18.168 12C18.207 12.204 18.2817 12.4312 18.4746 13.0098L19.8643 17.1787L20.1709 18.0996H16.2412C16.0958 18.9805 15.6795 19.801 15.04 20.4404C14.2336 21.2468 13.1394 21.7002 11.999 21.7002C10.8589 21.7 9.76522 21.2466 8.95898 20.4404C8.31969 19.801 7.90424 18.9804 7.75879 18.0996H3.82812L4.13574 17.1787L5.52539 13.0098C5.71818 12.4314 5.79198 12.2039 5.83105 12C5.86979 11.7975 5.89078 11.4695 5.93652 10.6621C6.11306 7.54653 6.92203 5.57543 8.10742 4.3877C9.3032 3.18971 10.7697 2.89941 12 2.89941ZM9.18848 18.0996C9.31463 18.6063 9.57389 19.0748 9.94922 19.4502C10.4929 19.9938 11.2302 20.2996 11.999 20.2998C12.7681 20.2998 13.506 19.994 14.0498 19.4502C14.4252 19.0748 14.6834 18.6063 14.8096 18.0996H9.18848ZM12 4.2998C10.9825 4.2998 9.93753 4.53654 9.09863 5.37695C8.2494 6.22787 7.50018 7.80812 7.33398 10.7412C7.29148 11.4915 7.26708 11.9436 7.20605 12.2627C7.14528 12.5801 7.0333 12.9128 6.85352 13.4521L5.77148 16.6992H18.2285L17.1465 13.4521C16.9667 12.9127 16.8537 12.5802 16.793 12.2627C16.732 11.9436 16.7085 11.4914 16.666 10.7412C16.4998 7.80834 15.7505 6.22792 14.9014 5.37695C14.0625 4.53655 13.0174 4.29985 12 4.2998Z" fill="currentColor"/></svg>`,
  // notification-muted.svg
  bellOff: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m14.9386 19c-.3363 0-.5779.3279-.5466.6628.01.1075.0155.2199.0155.3372 0 1.3889-1.2063 2.75-2.75 2.75-1.5436 0-2.74998-1.3611-2.74998-2.75 0-.1173.0055-.2297.01555-.3372.0313-.3349-.21032-.6628-.54661-.6628h-2.08457l-2.01156 2.0116c-.29289.2929-.76777.2929-1.06066 0s-.29289-.7678 0-1.0607l15.90993-15.9099c.2929-.29289.7677-.29289 1.0606 0s.2929.76777 0 1.06066l-3.4017 3.40169.6699 3.85145c.13.748.4703 1.4435.981 2.0053l1.1769 1.2946c1.168 1.2847.2564 3.3453-1.4799 3.3453zm.553-9.19969-7.69971 7.69969h10.34451c.4341 0 .662-.5151.37-.8363l-1.1769-1.2946c-.7022-.7724-1.1701-1.7288-1.349-2.7573zm-7.95352 1.64099-2.07314 2.0731c.18837-.3624.32108-.7532.39175-1.1596l1.11547-6.41395c.39616-2.27792 2.37325-3.94085 4.68534-3.94085 1.4427 0 2.755.64744 3.6341 1.68774l-1.0662 1.0662c-.6006-.7696-1.5354-1.25394-2.5679-1.25394-1.5828 0-2.93632 1.13842-3.20752 2.69786zm3.16102 7.5775c.011-.0115.0266-.0188.0425-.0188h1.8319c.0159 0 .031.0068.042.0183.0029.0034.01.0119.0201.0255.023.0306.0609.0862.1011.1666.0791.1583.1708.4192.1708.7896 0 .6111-.5845 1.25-1.25 1.25s-1.25-.6389-1.25-1.25c0-.3704.0917-.6313.1708-.7896.0402-.0804.0781-.136.1011-.1666.0102-.0136.0168-.0216.0197-.025z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // checkmark.svg
  check: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m21.416 2.37592c.3447.22976.4378.69542.208 1.04006l-11.99996 18.00002c-.12464.1869-.32654.3082-.55014.3303s-.44535-.0571-.60423-.216l-6-6c-.29289-.2929-.29289-.7678 0-1.0607s.76777-.2929 1.06066 0l5.3531 5.3531 11.49257-17.23877c.2297-.34464.6954-.43777 1.04-.20801z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // net-new clock (no source) — thread-list "when"
  clock: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.4"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // lock.svg (12px source, scaled by CSS)
  lock: `<svg viewBox="0 0 10 12" fill="none"><path clip-rule="evenodd" d="m2 5.5v-1.74359c0-1.78315 1.32593-3.25641 3-3.25641s3 1.47326 3 3.25641v1.74359h.5c.82843 0 1.5.67157 1.5 1.5v3c0 .8284-.67157 1.5-1.5 1.5h-7c-.828427 0-1.5-.6716-1.5-1.5v-3c0-.82843.671573-1.5 1.5-1.5zm1.38462 0h3.23076v-1.74359c0-1.04908-.74044-1.87179-1.61538-1.87179s-1.61538.82271-1.61538 1.87179z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // close-circle.svg — "close thread" action
  closeCircle: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m16.0303 7.96955c.2929.29289.2929.76776 0 1.06066l-2.6161 2.61619c-.1953.1952-.1953.5118 0 .7071l2.6161 2.6162c.2929.2929.2929.7677 0 1.0606s-.7677.2929-1.0606 0l-2.6162-2.6161c-.1953-.1953-.5119-.1953-.7071 0l-2.61607 2.616c-.29289.2929-.76777.2929-1.06066 0s-.29289-.7678 0-1.0607l2.61603-2.616c.1953-.1953.1953-.5119 0-.7071l-2.61603-2.61607c-.29289-.29289-.29289-.76777 0-1.06066s.76777-.29289 1.06066 0l2.61607 2.61603c.1952.1953.5118.1953.7071 0l2.6162-2.61615c.2929-.2929.7677-.2929 1.0606 0z"/><path clip-rule="evenodd" d="m12 22c5.5228 0 10-4.4772 10-10 0-5.52285-4.4772-10-10-10-5.52285 0-10 4.47715-10 10 0 5.5228 4.47715 10 10 10zm0-1.5c4.6944 0 8.5-3.8056 8.5-8.5 0-4.69442-3.8056-8.5-8.5-8.5-4.69442 0-8.5 3.80558-8.5 8.5 0 4.6944 3.80558 8.5 8.5 8.5z" fill-rule="evenodd"/></g></svg>`,
  // delete.svg
  del: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m9.39286 2.25c-1.18347 0-2.14286.95939-2.14286 2.14286 0 .61145-.49568 1.10714-1.10714 1.10714h-3.14286c-.41421 0-.75.33579-.75.75s.33579.75.75.75h.73876c.25288 0 .46594.1888.49637.43983l1.33836 11.04147c.24343 2.0083 1.94796 3.5187 3.97094 3.5187h4.91117c2.023 0 3.7275-1.5104 3.9709-3.5187l1.3384-11.04147c.0304-.25103.2435-.43983.4963-.43983h.7388c.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75h-3.1429c-.6114 0-1.1071-.49568-1.1071-1.10714 0-1.18347-.9594-2.14286-2.1429-2.14286zm5.31594 3.25c.3663 0 .6146-.38913.5652-.75214-.0158-.11608-.024-.23459-.024-.355 0-.35504-.2878-.64286-.6429-.64286h-5.21424c-.35504 0-.64286.28782-.64286.64286 0 .12041-.00816.23892-.02397.355-.04942.36301.19882.75214.56518.75214zm3.1483 1.5c.2393 0 .4247.20925.3959.44679l-1.3156 10.85401c-.1521 1.2552-1.2175 2.1992-2.4818 2.1992h-4.91117c-1.26436 0-2.32969-.944-2.48184-2.1992l-1.31564-10.85401c-.02879-.23754.15663-.44679.39591-.44679z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // pin/keep-visible — pin.svg (inlined, not CHANNEL_ICONS.pinHeader: community-channel.js now imports
  // this module, and reading CHANNEL_ICONS here at eval time would hit a circular-import TDZ)
  pin: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m14.8956 7.28455c0-.82843-.6482-1.67563-1.4478-1.89228-.7996-.21664-1.4478.2793-1.4478 1.10773s.6482 1.67563 1.4478 1.89227c.7996.21665 1.4478-.2793 1.4478-1.10772z"/><path clip-rule="evenodd" d="m12 2c-3.31371 0-6 2.68629-6 6 0 2.9077 2.06835 5.3323 4.814 5.8828.2473.0496.436.2601.436.5123v6.6049c0 .4142.3358.75.75.75s.75-.3358.75-.75v-6.6049c0-.2522.1887-.4627.436-.5123 2.7457-.5505 4.814-2.9751 4.814-5.8828 0-3.31371-2.6863-6-6-6zm-4.5 6c0 2.4853 2.01472 4.5 4.5 4.5 2.4853 0 4.5-2.0147 4.5-4.5 0-2.48528-2.0147-4.5-4.5-4.5-2.48528 0-4.5 2.01472-4.5 4.5z" fill-rule="evenodd"/></g></svg>`,
}

// participant avatar stack (in-chat card + list rows)
export function avatarStack(people) {
  const shown = people.slice(0, 4)
  return `<span class="thread-ava-stack">${shown.map((p, i) =>
    `<span class="thread-ava" style="background:${p.c};z-index:${shown.length - i}">${p.i}</span>`).join('')}${people.length > 4 ? `<span class="thread-ava thread-ava--more">+${people.length - 4}</span>` : ''}</span>`
}

// mobile composer action icons — lifted from Status assets (camera/image/arrow-up.svg → currentColor),
// @ and Aa drawn to the Figma DS mobile composer (node 13030-108833)
const MCOMPOSER_ICONS = {
  camera: `<svg viewBox="0 0 24 24" fill="none"><g clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"><path d="m18 12c0 2.7614-2.2386 5-5 5s-5-2.2386-5-5c0-2.76142 2.2386-5 5-5s5 2.23858 5 5zm-1.5 0c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5z"/><path d="m2 7c0-2.20914 1.79086-4 4-4h12c2.2091 0 4 1.79086 4 4v10c0 2.2091-1.7909 4-4 4h-12c-2.20914 0-4-1.7909-4-4zm4-2.5h12c1.3807 0 2.5 1.11929 2.5 2.5v10c0 1.3807-1.1193 2.5-2.5 2.5h-12c-1.38071 0-2.5-1.1193-2.5-2.5v-10c0-1.38071 1.11929-2.5 2.5-2.5z"/></g></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none"><g clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"><path d="m18.5 9.5c0 1.6569-1.3431 3-3 3s-3-1.3431-3-3c0-1.65685 1.3431-3 3-3s3 1.34315 3 3zm-1.5 0c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5c0-.82843.6716-1.5 1.5-1.5s1.5.67157 1.5 1.5z"/><path d="m6 3c-2.20914 0-4 1.79086-4 4v10c0 2.2091 1.79086 4 4 4h12c2.2091 0 4-1.7909 4-4v-10c0-2.20914-1.7909-4-4-4zm12 1.5h-12c-1.38071 0-2.5 1.11929-2.5 2.5v3.2322c0 .4455.53857.6686.85355.3536l1.40901-1.40902c.68342-.68342 1.79146-.68342 2.47488 0l10.08066 10.08072c.1191.119.2913.1736.4514.1218 1.0042-.3245 1.7305-1.2671 1.7305-2.3793v-10c0-1.38071-1.1193-2.5-2.5-2.5zm-14.46967 9.0303c-.0188.0188-.03033.0439-.03033.0705v3.3992c0 1.3807 1.11929 2.5 2.5 2.5h9.2322c.4455 0 .6686-.5386.3536-.8536l-8.40902-8.409c-.09764-.0976-.25593-.0976-.35356 0z"/></g></svg>`,
  mention: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 12v1.3a2.2 2.2 0 0 0 4.4 0V12a8 8 0 1 0-3 6.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  sendUp: `<svg viewBox="0 0 24 24" fill="none"><path d="m6.53033 10.5303c-.29289.2929-.76777.2929-1.06066 0s-.29289-.76774 0-1.06063l6.00003-6c.2929-.29289.7677-.29289 1.0606 0l6 6c.2929.29289.2929.76773 0 1.06063s-.7677.2929-1.0606 0l-3.8661-3.86609c-.315-.31498-.8536-.09189-.8536.35356v12.98223c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75v-12.98223c0-.44546-.5386-.66854-.8536-.35356z" fill="currentColor"/></svg>`,
}

// editable composer — reuses .chat-input structure; NOT readonly (epic §3 post/edit).
// mobile = the Figma DS two-row layout (text on top, outlined icon toolbar + blue send below).
function threadComposer(placeholder, mobile = false) {
  if (mobile) {
    return `
    <div class="chat-input thread-view__composer mcomposer">
      <div class="mcomposer__handle" aria-hidden="true"></div>
      <textarea class="chat-input__field mcomposer__field" data-thread-input placeholder="${placeholder}" rows="1" aria-label="${placeholder}"></textarea>
      <div class="mcomposer__bar">
        <div class="mcomposer__actions">
          <button class="mcomposer__btn mcomposer__btn--text" title="Format" aria-label="Format text">Aa</button>
          <button class="mcomposer__btn" title="Camera" aria-label="Camera">${MCOMPOSER_ICONS.camera}</button>
          <button class="mcomposer__btn" title="Image" aria-label="Image">${MCOMPOSER_ICONS.image}</button>
          <button class="mcomposer__btn" title="Commands" aria-label="Commands">${CHANNEL_ICONS.chatCommands}</button>
          <button class="mcomposer__btn" title="Mention" aria-label="Mention">${MCOMPOSER_ICONS.mention}</button>
          <button class="mcomposer__btn" title="Emoji" aria-label="Emoji">${CHANNEL_ICONS.emojis}</button>
        </div>
        <button class="mcomposer__send" data-thread-send title="Send" aria-label="Send">${MCOMPOSER_ICONS.sendUp}</button>
      </div>
    </div>`
  }
  return `
    <div class="chat-input thread-view__composer">
      <div class="chat-input__row">
        <button class="chat-input__cmd-btn" title="Commands" aria-label="Commands">${CHANNEL_ICONS.chatCommands}</button>
        <div class="chat-input__box">
          <div class="chat-input__input-row">
            <textarea class="chat-input__field" data-thread-input placeholder="${placeholder}" rows="1" aria-label="${placeholder}"></textarea>
            <div class="chat-input__actions">
              ${formatGroup()}
              <button class="chat-input__btn" title="Emoji" aria-label="Emoji">${CHANNEL_ICONS.emojis}</button>
              <button class="chat-input__btn" title="GIF" aria-label="GIF">${CHANNEL_ICONS.gif}</button>
              <button class="chat-input__btn" title="Stickers" aria-label="Stickers">${CHANNEL_ICONS.stickers}</button>
              <button class="chat-input__btn chat-input__btn--send" data-thread-send title="Send" aria-label="Send">${CHANNEL_ICONS.send}</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
}

// close (X) — desktop side-panel dismiss (net-new; the full-screen view uses the back arrow instead)
const CLOSE_X = `<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`

function threadHeader({ title, sub, muted, back = true, menu = false, close = false }) {
  return `
    <div class="thread-view__header">
      ${back && !close ? `<button class="thread-view__back" data-back title="Back" aria-label="Back to conversation">${THREAD_ICONS.back}</button>` : ''}
      ${close ? `<span class="thread-view__lead-icon" aria-hidden="true">${THREAD_ICONS.thread}</span>` : ''}
      <div class="thread-view__titles">
        <span class="thread-view__title">${title}</span>
        <span class="thread-view__sub">${sub}</span>
      </div>
      <div class="thread-view__actions">
        <button class="chat-header__action-btn" title="Search" aria-label="Search thread">${CHANNEL_ICONS.search}</button>
        ${menu ? `<button class="chat-header__action-btn" data-mute title="${muted ? 'Unmute' : 'Mute'}" aria-label="${muted ? 'Unmute thread' : 'Mute thread'}" aria-pressed="${muted}">${muted ? THREAD_ICONS.bellOff : THREAD_ICONS.bell}</button>` : ''}
        ${menu ? `<button class="chat-header__action-btn" data-thread-more title="More" aria-label="Thread options" aria-haspopup="true">${CHANNEL_ICONS.more}</button>` : ''}
        ${close ? `<button class="chat-header__action-btn thread-view__close" data-back title="Close" aria-label="Close thread panel">${CLOSE_X}</button>` : ''}
      </div>
    </div>`
}

// ---- Creating Thread (Figma: parent pinned + "Thread name (optional)" + composer) ----
export function resolveParent(surface, parentMsgId) {
  const existing = parentMsgId ? store.threadForParent(parentMsgId, surface) : null
  if (existing) return existing.parentMsg
  if (parentMsgId) return store.getPendingParent(parentMsgId)
  return null // composer-initiated new thread: no parent message to pin
}
export function renderCreate(surface, parentMsgId, { panel = false, mobile = false } = {}) {
  const s = SURFACES[surface] || SURFACES.channel
  const parent = resolveParent(surface, parentMsgId)
  return `
    <div class="thread-view thread-create">
      ${threadHeader({ title: 'Creating Thread', sub: s.in, back: !panel, close: panel, menu: false })}
      <div class="thread-view__messages">
        ${parent ? `<div class="thread-view__parent-label">Starting a thread from</div><div class="thread-view__parent">${msg(...parent)}</div>` : `<div class="thread-view__parent-label">New thread ${s.in}</div>`}
      </div>
      <div class="thread-create__foot">
        <input class="thread-create__name" data-thread-name type="text" placeholder="Thread name (optional)" aria-label="Thread name (optional)" />
        ${threadComposer('Type message', mobile)}
      </div>
    </div>`
}

// ---- Thread view (parent + replies + composer + "Send copy" toggle) ----
export function renderThread(t, { copy, panel = false, mobile = false }) {
  const s = SURFACES[t.surface] || SURFACES.channel
  const title = t.title
  if (t.deleted) {
    return `<div class="thread-view thread-view--empty">
      ${threadHeader({ title, sub: s.in, muted: t.muted, menu: false, back: !panel, close: panel })}
      <div class="thread-empty">${THREAD_ICONS.thread}<div class="thread-empty__title">This thread was deleted</div><div class="thread-empty__sub">The thread and its replies are no longer available.</div><button class="thread-empty__back" data-back>Back to ${s.label}</button></div>
    </div>`
  }
  const closedBar = t.closed ? `<div class="thread-closed-bar">${THREAD_ICONS.lock}This thread is closed — no new replies can be posted.</div>` : ''
  const composer = t.closed ? '' : threadComposer('Reply in thread', mobile)
  const copyRow = t.closed ? '' : `
    <div class="thread-copy">
      <span class="thread-copy__label" id="thread-copy-label">${s.copy}</span>
      <button type="button" role="switch" aria-checked="${copy}" aria-labelledby="thread-copy-label" class="thread-copy__switch${copy ? ' on' : ''}" data-copy><span class="thread-copy__knob"></span></button>
    </div>`
  const replyRows = t.messages.map(m => msg(m.name, m.initial, m.color, m.time, m.text, { ...m.opts, id: m.id, threadEditable: m.own })).join('')
  return `
    <div class="thread-view" data-thread-id="${t.id}">
      ${threadHeader({ title, sub: s.in, muted: t.muted, menu: true, back: !panel, close: panel })}
      <div class="thread-view__messages">
        <div class="thread-view__parent">${msg(...t.parentMsg)}</div>
        <div class="thread-view__reply-sep"><span>${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}</span></div>
        ${replyRows || '<div class="thread-view__empty-replies">No replies yet — start the discussion.</div>'}
      </div>
      ${closedBar}
      ${composer}
      ${copyRow}
    </div>`
}

// ---- Threads list / index (epic §5 + §6.1 lifecycle) ----
function threadRow(t) {
  const people = store.participants(t)
  const when = relTime(t.lastActivityTs)
  return `
    <button class="thread-row${t.followed && t.unread ? ' unread' : ''}${t.closed ? ' closed' : ''}" data-open-thread="${t.id}" data-surface="${t.surface}" aria-label="${t.title}, ${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}${t.followed && t.unread ? ', unread' : ''}${t.closed ? ', closed' : ''}">
      <span class="thread-row__icon">${t.closed ? THREAD_ICONS.lock : THREAD_ICONS.thread}</span>
      <span class="thread-row__body">
        <span class="thread-row__top"><span class="thread-row__title">${t.title}</span>${t.keptVisible ? `<span class="thread-row__pin" title="Kept visible">${THREAD_ICONS.pin}</span>` : ''}${t.followed ? '<span class="thread-row__followed" title="Following">·</span>' : ''}${t.followed && t.unread ? '<span class="thread-row__dot" title="New messages"></span>' : ''}</span>
        <span class="thread-row__meta"><span class="thread-row__channel">${t.channelLabel}</span><span class="thread-row__sep">·</span><span>${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}</span><span class="thread-row__sep">·</span><span class="thread-row__when">${THREAD_ICONS.clock}${when}</span></span>
      </span>
      ${avatarStack(people)}
    </button>`
}
function renderList(surface) {
  const all = surface ? store.threadsForSurface(surface) : store.allThreads()
  const active = all.filter(t => !t.closed)
  const past = all.filter(t => t.closed)
  return `
    <div class="thread-list">
      <div class="thread-list__header"><button class="thread-view__back" data-back title="Back" aria-label="Back">${THREAD_ICONS.back}</button><span class="thread-list__title">Threads${surface ? ` — ${SURFACES[surface].label}` : ''}</span></div>
      <div class="thread-list__section">Active — ${active.length}</div>
      ${active.map(threadRow).join('') || '<div class="thread-list__empty">No active threads.</div>'}
      <div class="thread-list__section">Past — ${past.length}</div>
      ${past.map(threadRow).join('') || '<div class="thread-list__empty">No past threads.</div>'}
    </div>`
}

function relTime(ts) {
  const d = Date.now() - ts, m = 60000, h = 60 * m, day = 24 * h
  if (d < m) return 'now'
  if (d < h) return `${Math.floor(d / m)}m`
  if (d < day) return `${Math.floor(d / h)}h`
  if (d < 7 * day) return `${Math.floor(d / day)}d`
  return `${Math.floor(d / (7 * day))}w`
}

export function renderThreads(view, ver) {
  const p = new URLSearchParams(location.search)
  const surface = p.get('surface') || 'channel'
  const v = p.get('tview') || 'thread'
  const mobile = view === 'mobile'
  let center
  if (v === 'create') center = renderCreate(surface, p.get('parent'), { mobile })
  else if (v === 'list') center = renderList(p.get('surface') || null)
  else {
    const id = p.get('t')
    let t = id ? store.getThread(id) : null
    if (!t) t = store.threadsForSurface(surface)[0] || store.allThreads()[0]
    center = t ? renderThread(t, { copy: p.get('copy') === '1', mobile }) : '<div class="thread-empty">No thread selected.</div>'
  }
  return { nav: null, left: null, center: `<div class="thread-screen">${center}</div>`, right: null }
}

export function bindThreads() {
  const root = document.querySelector('.thread-screen')
  if (!root) return
  const p = new URLSearchParams(location.search)
  const surface = p.get('surface') || 'channel'
  const threadId = root.querySelector('[data-thread-id]')?.dataset.threadId || p.get('t')

  // drain any queued toast (unfollow/mute/close/delete confirmations)
  const queued = store.takeToast()
  if (queued) floatToast(root, queued)

  // "Send copy to #channel" switch (epic §3.1) — real ARIA switch, keyboard-activatable.
  // Persist the choice into the `copy` URL param (which renderThread reads) so posting a reply
  // — which triggers a re-render — doesn't silently snap the toggle back on/off.
  root.querySelector('[data-copy]')?.addEventListener('click', function () {
    const on = this.getAttribute('aria-checked') !== 'true'
    this.setAttribute('aria-checked', String(on)); this.classList.toggle('on', on)
    try { const u = new URL(location.href); on ? u.searchParams.set('copy', '1') : u.searchParams.delete('copy'); history.replaceState(null, '', u) } catch {}
  })

  // ---- create flow: Send creates a thread in the model (epic §15/UC1) ----
  if (p.get('tview') === 'create') {
    const send = () => {
      const nameEl = root.querySelector('[data-thread-name]')
      const inputEl = root.querySelector('[data-thread-input]')
      const text = (inputEl?.value || '').trim()
      if (!text) { inputEl?.focus(); return }
      const parentMsgId = p.get('parent')
      const parent = resolveParent(surface, parentMsgId)
      const t = store.createThread({ surface, parentMsgId, parentMsg: parent, title: nameEl?.value || '', firstMessage: text })
      const q = new URLSearchParams(location.search)
      q.set('screen', 'threads'); q.set('tview', 'thread'); q.set('t', t.id); q.set('surface', surface); q.set('from', p.get('from') || 'chat'); q.set('created', '1'); q.delete('parent')
      location.search = q.toString()
    }
    bindComposerSend(root, send)
    if (p.get('created') !== '1') root.querySelector('[data-thread-name]')?.focus()
  }

  // ---- thread view: post reply (epic §16/UC2) + copy-to-parent (epic §17/UC3) ----
  if (p.get('tview') === 'thread' && threadId) {
    // clear the unread badge on open (epic §5) — silent persist (no re-render; badge updates on next nav)
    const t0 = store.getThread(threadId)
    if (t0 && t0.unread && !t0.muted) store.markRead(threadId, { silent: true })
    const send = () => {
      const inputEl = root.querySelector('[data-thread-input]')
      const text = (inputEl?.value || '').trim()
      if (!text) return
      const copyOn = root.querySelector('[data-copy]')?.getAttribute('aria-checked') === 'true'
      store.postReply(threadId, text, { copyToParent: copyOn })
      // store.emit → main re-renders in place; focus the fresh composer + toast if copied
      requestAnimationFrame(() => {
        const el = document.querySelector('.thread-screen [data-thread-input]'); el && el.focus()
        if (copyOn) floatToast(document.querySelector('.thread-screen'), 'Reply also posted to ' + (SURFACES[surface]?.label || 'channel'))
      })
    }
    bindComposerSend(root, send)

    // mute toggle (epic §18) — durable in model, suppresses UC5 notifications
    root.querySelector('[data-mute]')?.addEventListener('click', () => {
      const t = store.getThread(threadId); store.setMuted(threadId, !t.muted)
    })
    // more menu → follow/unfollow · keep-visible · close · delete (epic §18/§21/§23)
    root.querySelector('[data-thread-more]')?.addEventListener('click', (e) => {
      e.stopPropagation(); openThreadMenu(root, threadId, e.currentTarget)
    })
    // inline edit of own thread messages (epic §16/UC2)
    bindInlineEdit(root, threadId)
  }

  // back → return to the originating surface (epic §24/UC10)
  root.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', goBack))

  // list row → open that thread, carrying its surface + return-to-list (epic §24)
  root.querySelectorAll('[data-open-thread]').forEach(r => r.addEventListener('click', () => {
    const q = new URLSearchParams(location.search)
    q.set('screen', 'threads'); q.set('tview', 'thread'); q.set('t', r.dataset.openThread); q.set('surface', r.dataset.surface || 'channel'); q.set('from', 'list')
    location.search = q.toString()
  }))
}

function goBack() {
  const p = new URLSearchParams(location.search)
  const from = p.get('from') || 'chat'
  const q = new URLSearchParams()
  q.set('version', p.get('version') || 'revamp'); q.set('theme', p.get('theme') || 'dark'); if (p.get('view')) q.set('view', p.get('view'))
  if (from === 'list') { q.set('screen', 'threads'); q.set('tview', 'list'); if (p.get('surface')) q.set('surface', p.get('surface')) }
  else if (from === 'mlist') { q.set('screen', 'chat'); q.set('mlist', '1') } // opened from the mobile channel/thread list → back to that list
  else { q.set('screen', 'chat') } // channel / group / dm origin all return to the community channel surface in this prototype
  location.search = q.toString()
}

// wire Send button + Enter-to-send on a composer
export function bindComposerSend(root, send) {
  const btn = root.querySelector('[data-thread-send]')
  const input = root.querySelector('[data-thread-input]')
  btn?.addEventListener('click', send)
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } })
}

// inline edit: click the hover Edit quick-action on an own message → editable field
export function bindInlineEdit(root, threadId) {
  root.querySelectorAll('.thread-view__messages .message[data-msg-id]').forEach(mEl => {
    const editBtn = mEl.querySelector('.message__qa-btn[aria-label="Edit"]')
    if (!editBtn) return
    editBtn.addEventListener('click', () => {
      const textEl = mEl.querySelector('.message__text'); if (!textEl || mEl.querySelector('.msg-edit')) return
      const current = textEl.textContent.replace(/\s*\(edited\)\s*$/, '')
      const box = document.createElement('div'); box.className = 'msg-edit'
      box.innerHTML = `<input class="msg-edit__input" value="${current.replace(/"/g, '&quot;')}" aria-label="Edit message"/><button class="msg-edit__save">Save</button><button class="msg-edit__cancel">Cancel</button>`
      textEl.style.display = 'none'; textEl.after(box)
      const inp = box.querySelector('.msg-edit__input'); inp.focus(); inp.setSelectionRange(current.length, current.length)
      const commit = () => store.editMessage(threadId, mEl.dataset.msgId, inp.value)
      box.querySelector('.msg-edit__save').addEventListener('click', commit)
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { box.remove(); textEl.style.display = '' } })
      box.querySelector('.msg-edit__cancel').addEventListener('click', () => { box.remove(); textEl.style.display = '' })
    })
  })
}

// thread "more" menu — follow · keep-visible · close · delete (epic §18/§21/§23)
export function openThreadMenu(root, threadId, anchor) {
  root.querySelector('.thread-more-menu')?.remove()
  const t = store.getThread(threadId); if (!t) return
  const menu = document.createElement('div')
  menu.className = 'msg-cmenu thread-more-menu'
  menu.setAttribute('role', 'menu')
  const item = (icon, label, act, cls = '') => `<button class="msg-cmenu__item${cls}" role="menuitem" data-act="${act}">${icon}<span>${label}</span></button>`
  menu.innerHTML =
    item(THREAD_ICONS.check, t.followed ? 'Unfollow thread' : 'Follow thread', 'follow') +
    item(THREAD_ICONS.pin, t.keptVisible ? 'Unpin from list' : 'Keep visible', 'keep') +
    (t.closed ? item(THREAD_ICONS.thread, 'Reopen thread', 'reopen') : item(THREAD_ICONS.closeCircle, 'Close thread', 'close')) +
    item(THREAD_ICONS.del, 'Delete thread', 'delete', ' msg-cmenu__item--danger')
  // position under the anchor
  const rect = anchor.getBoundingClientRect(); const rootRect = root.getBoundingClientRect()
  menu.style.position = 'absolute'; menu.style.top = (rect.bottom - rootRect.top + 4) + 'px'; menu.style.right = (rootRect.right - rect.right) + 'px'; menu.style.left = 'auto'
  root.appendChild(menu)
  const acts = {
    follow: () => store.setFollowed(threadId, !t.followed),
    keep: () => store.setKeptVisible(threadId, !t.keptVisible),
    close: () => store.closeThread(threadId),
    reopen: () => store.reopenThread(threadId),
    delete: () => store.deleteThread(threadId),
  }
  menu.querySelectorAll('.msg-cmenu__item').forEach(btn => btn.addEventListener('click', () => acts[btn.dataset.act]?.()))
  // a11y: focus first, Escape + outside-click dismiss
  menu.querySelector('.msg-cmenu__item')?.focus()
  const dismiss = (e) => { if (!menu.contains(e.target) && e.target !== anchor) { menu.remove(); document.removeEventListener('mousedown', dismiss); document.removeEventListener('keydown', onKey) } }
  const onKey = (e) => { if (e.key === 'Escape') { menu.remove(); anchor.focus(); document.removeEventListener('mousedown', dismiss); document.removeEventListener('keydown', onKey) } }
  setTimeout(() => { document.addEventListener('mousedown', dismiss); document.addEventListener('keydown', onKey) }, 0)
}

export function floatToast(root, text) {
  if (!root) return
  root.querySelector('.thread-toast')?.remove()
  const el = document.createElement('div')
  el.className = 'thread-toast'
  el.setAttribute('role', 'status')
  el.innerHTML = `${THREAD_ICONS.check}${text}`
  root.appendChild(el)
  setTimeout(() => el.classList.add('hide'), 2600)
  setTimeout(() => el.remove(), 3000)
}
