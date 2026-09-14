// Conversation Threads (Status epic #21090) — thread surfaces on top of the certified Community
// Channel. Reuses the message row `msg()`, composer icons, and quick-actions from community-channel.js.
// Fully data-driven from src/thread-store.js: create → view flow, editable composer with real send,
// "Send copy to #channel", follow/mute, close/delete, cross-surface, threads list + lifecycle.
// Routed by ?tview=create|thread|list with ?t=<threadId> / ?parent=<msgId> / ?surface / ?from.

import { msg, CHANNEL_ICONS, formatGroup, INFO_ICON } from './community-channel.js'
import * as store from '../thread-store.js'
import { SURFACES } from '../thread-store.js'
import { THREAD_GLYPH } from '../icons/thread-glyph.js'

// ---- real Status icons lifted from StatusQ/src/assets/img/icons (recoloured → currentColor) ----
// Net-new thread glyph + clock have no source asset, so those stay hand-drawn (Status line style).
export const THREAD_ICONS = {
  // arrow-right.svg — flipped to point left for "back" via CSS (.thread-view__back svg)
  back: `<svg viewBox="0 0 24 24" fill="none"><path d="m13.4697 6.53033c-.2929-.29289-.2929-.76777 0-1.06066s.7677-.29289 1.0606 0l6 6.00003c.2929.2929.2929.7677 0 1.0606l-6 6c-.2929.2929-.7677.2929-1.0606 0s-.2929-.7677 0-1.0606l3.8661-3.8661c.315-.315.0919-.8536-.3536-.8536h-12.9822c-.41421 0-.75-.3358-.75-.75s.33579-.75.75-.75h12.9822c.4455 0 .6686-.5386.3536-.8536z" fill="currentColor"/></svg>`,
  // the shared thread glyph (src/icons/thread-glyph.js) — one swap-point for the official icon
  thread: THREAD_GLYPH,
  // notification.svg
  bell: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.89941C13.2302 2.89946 14.6959 3.18992 15.8916 4.3877C17.077 5.57542 17.8869 7.54647 18.0635 10.6621C18.1092 11.4696 18.1292 11.7975 18.168 12C18.207 12.204 18.2817 12.4312 18.4746 13.0098L19.8643 17.1787L20.1709 18.0996H16.2412C16.0958 18.9805 15.6795 19.801 15.04 20.4404C14.2336 21.2468 13.1394 21.7002 11.999 21.7002C10.8589 21.7 9.76522 21.2466 8.95898 20.4404C8.31969 19.801 7.90424 18.9804 7.75879 18.0996H3.82812L4.13574 17.1787L5.52539 13.0098C5.71818 12.4314 5.79198 12.2039 5.83105 12C5.86979 11.7975 5.89078 11.4695 5.93652 10.6621C6.11306 7.54653 6.92203 5.57543 8.10742 4.3877C9.3032 3.18971 10.7697 2.89941 12 2.89941ZM9.18848 18.0996C9.31463 18.6063 9.57389 19.0748 9.94922 19.4502C10.4929 19.9938 11.2302 20.2996 11.999 20.2998C12.7681 20.2998 13.506 19.994 14.0498 19.4502C14.4252 19.0748 14.6834 18.6063 14.8096 18.0996H9.18848ZM12 4.2998C10.9825 4.2998 9.93753 4.53654 9.09863 5.37695C8.2494 6.22787 7.50018 7.80812 7.33398 10.7412C7.29148 11.4915 7.26708 11.9436 7.20605 12.2627C7.14528 12.5801 7.0333 12.9128 6.85352 13.4521L5.77148 16.6992H18.2285L17.1465 13.4521C16.9667 12.9127 16.8537 12.5802 16.793 12.2627C16.732 11.9436 16.7085 11.4914 16.666 10.7412C16.4998 7.80834 15.7505 6.22792 14.9014 5.37695C14.0625 4.53655 13.0174 4.29985 12 4.2998Z" fill="currentColor"/></svg>`,
  // notification-muted.svg
  bellOff: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m14.9386 19c-.3363 0-.5779.3279-.5466.6628.01.1075.0155.2199.0155.3372 0 1.3889-1.2063 2.75-2.75 2.75-1.5436 0-2.74998-1.3611-2.74998-2.75 0-.1173.0055-.2297.01555-.3372.0313-.3349-.21032-.6628-.54661-.6628h-2.08457l-2.01156 2.0116c-.29289.2929-.76777.2929-1.06066 0s-.29289-.7678 0-1.0607l15.90993-15.9099c.2929-.29289.7677-.29289 1.0606 0s.2929.76777 0 1.06066l-3.4017 3.40169.6699 3.85145c.13.748.4703 1.4435.981 2.0053l1.1769 1.2946c1.168 1.2847.2564 3.3453-1.4799 3.3453zm.553-9.19969-7.69971 7.69969h10.34451c.4341 0 .662-.5151.37-.8363l-1.1769-1.2946c-.7022-.7724-1.1701-1.7288-1.349-2.7573zm-7.95352 1.64099-2.07314 2.0731c.18837-.3624.32108-.7532.39175-1.1596l1.11547-6.41395c.39616-2.27792 2.37325-3.94085 4.68534-3.94085 1.4427 0 2.755.64744 3.6341 1.68774l-1.0662 1.0662c-.6006-.7696-1.5354-1.25394-2.5679-1.25394-1.5828 0-2.93632 1.13842-3.20752 2.69786zm3.16102 7.5775c.011-.0115.0266-.0188.0425-.0188h1.8319c.0159 0 .031.0068.042.0183.0029.0034.01.0119.0201.0255.023.0306.0609.0862.1011.1666.0791.1583.1708.4192.1708.7896 0 .6111-.5845 1.25-1.25 1.25s-1.25-.6389-1.25-1.25c0-.3704.0917-.6313.1708-.7896.0402-.0804.0781-.136.1011-.1666.0102-.0136.0168-.0216.0197-.025z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // edit_pencil.svg — rename affordance on the thread title (#22275)
  edit: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m16.187 3.24584c1.2612-1.26112 3.3058-1.26112 4.567.00001 1.2611 1.26112 1.2611 3.3058 0 4.56692l-11.75175 11.75173c-.42718.4272-.95618.7384-1.53706.9044l-4.20764 1.2022c-.26236.0749-.54473.0018-.73767-.1912-.19294-.1929-.26611-.4753-.19115-.7376l1.20219-4.2077c.16596-.5809.47723-1.1099.90441-1.5371zm3.5044 1.06253c-.6743-.6743-1.7675-.6743-2.4418 0l-11.75175 11.75173c-.24661.2466-.4263.552-.52211.8873-.36205 1.2672.80948 2.4387 2.07664 2.0767.33534-.0958.64073-.2755.88734-.5222l11.75168-11.75166c.6743-.6743.6743-1.76756 0-2.44187z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // checkmark-circle.svg — "Mark as read" (#22402), the same icon the chat menu uses
  checkCircle: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m20.5 12c0 4.6944-3.8056 8.5-8.5 8.5-4.69442 0-8.5-3.8056-8.5-8.5 0-4.69442 3.80558-8.5 8.5-8.5 4.6944 0 8.5 3.80558 8.5 8.5zm1.5 0c0 5.5228-4.4772 10-10 10-5.52285 0-10-4.4772-10-10 0-5.52285 4.47715-10 10-10 5.5228 0 10 4.47715 10 10zm-5.2272-1.8839c.2929-.29292.2929-.76779 0-1.06069-.2929-.29289-.7677-.29289-1.0606 0l-5.1266 5.12649-2.29806-2.2981c-.29289-.2929-.76777-.2929-1.06066 0-.2929.2929-.29289.7678 0 1.0607l2.82842 2.8284c.2929.2929.7678.2929 1.0607 0z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // copy.svg — "Copy link" on desktop (#22285)
  copy: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m6.25 10.5c.41421 0 .75-.3358.75-.75 0-.41421-.33579-.75-.75-.75h-.25c-2.20914 0-4 1.7909-4 4v5c0 2.2091 1.79086 4 4 4h5c2.2091 0 4-1.7909 4-4v-.25c0-.4142-.3358-.75-.75-.75s-.75.3358-.75.75v.25c0 1.3807-1.1193 2.5-2.5 2.5h-5c-1.38071 0-2.5-1.1193-2.5-2.5v-5c0-1.3807 1.11929-2.5 2.5-2.5z"/><path clip-rule="evenodd" d="m9 6c0-2.20914 1.7909-4 4-4h5c2.2091 0 4 1.79086 4 4v5c0 2.2091-1.7909 4-4 4h-5c-2.2091 0-4-1.7909-4-4zm4-2.5h5c1.3807 0 2.5 1.11929 2.5 2.5v5c0 1.3807-1.1193 2.5-2.5 2.5h-5c-1.3807 0-2.5-1.1193-2.5-2.5v-5c0-1.38071 1.1193-2.5 2.5-2.5z" fill-rule="evenodd"/></g></svg>`,
  // chevron-right — submenu affordance
  chevron: `<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // checkmark.svg
  check: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m21.416 2.37592c.3447.22976.4378.69542.208 1.04006l-11.99996 18.00002c-.12464.1869-.32654.3082-.55014.3303s-.44535-.0571-.60423-.216l-6-6c-.29289-.2929-.29289-.7678 0-1.0607s.76777-.2929 1.06066 0l5.3531 5.3531 11.49257-17.23877c.2297-.34464.6954-.43777 1.04-.20801z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // net-new clock (no source) — thread-list "when"
  clock: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.4"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // lock.svg (12px source, scaled by CSS)
  lock: `<svg viewBox="0 0 10 12" fill="none"><path clip-rule="evenodd" d="m2 5.5v-1.74359c0-1.78315 1.32593-3.25641 3-3.25641s3 1.47326 3 3.25641v1.74359h.5c.82843 0 1.5.67157 1.5 1.5v3c0 .8284-.67157 1.5-1.5 1.5h-7c-.828427 0-1.5-.6716-1.5-1.5v-3c0-.82843.671573-1.5 1.5-1.5zm1.38462 0h3.23076v-1.74359c0-1.04908-.74044-1.87179-1.61538-1.87179s-1.61538.82271-1.61538 1.87179z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  // close-circle.svg — "close thread" action
  closeCircle: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m16.0303 7.96955c.2929.29289.2929.76776 0 1.06066l-2.6161 2.61619c-.1953.1952-.1953.5118 0 .7071l2.6161 2.6162c.2929.2929.2929.7677 0 1.0606s-.7677.2929-1.0606 0l-2.6162-2.6161c-.1953-.1953-.5119-.1953-.7071 0l-2.61607 2.616c-.29289.2929-.76777.2929-1.06066 0s-.29289-.7678 0-1.0607l2.61603-2.616c.1953-.1953.1953-.5119 0-.7071l-2.61603-2.61607c-.29289-.29289-.29289-.76777 0-1.06066s.76777-.29289 1.06066 0l2.61607 2.61603c.1952.1953.5118.1953.7071 0l2.6162-2.61615c.2929-.2929.7677-.2929 1.0606 0z"/><path clip-rule="evenodd" d="m12 22c5.5228 0 10-4.4772 10-10 0-5.52285-4.4772-10-10-10-5.52285 0-10 4.47715-10 10 0 5.5228 4.47715 10 10 10zm0-1.5c4.6944 0 8.5-3.8056 8.5-8.5 0-4.69442-3.8056-8.5-8.5-8.5-4.69442 0-8.5 3.80558-8.5 8.5 0 4.6944 3.80558 8.5 8.5 8.5z" fill-rule="evenodd"/></g></svg>`,
  // archive box — passive marker on a thread that has gone quiet for a week (no manual action)
  archive: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="4" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" stroke="currentColor" stroke-width="1.6"/><path d="M10 12h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  // link — Share link action
  link: `<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 14.5 14.5 9.5M8 12l-2 2a3 3 0 1 0 4.24 4.24l2-2M16 12l2-2a3 3 0 1 0-4.24-4.24l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
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
  // wallet.svg lifted (fill #131D2F → currentColor) — the Figma DS composer's 4th icon is Wallet, not commands
  wallet: `<svg viewBox="0 0 24 24" fill="none"><path d="M12.0005 1.7998C14.1269 1.79981 15.8372 1.86152 17.1919 2.09961C18.5524 2.33875 19.6344 2.76869 20.4331 3.56738C21.2317 4.36609 21.6618 5.44808 21.9009 6.80859C22.1153 8.0288 22.1828 9.53754 22.1948 11.3789C22.1977 11.4185 22.2007 11.4589 22.2007 11.5H22.1958C22.1966 11.664 22.2007 11.8308 22.2007 12C22.2007 12.0992 22.198 12.1976 22.1978 12.2949C22.1981 12.3628 22.2007 12.4313 22.2007 12.5H22.1958C22.1861 14.3965 22.12 15.9446 21.9009 17.1914C21.6617 18.5519 21.2318 19.6339 20.4331 20.4326C19.6344 21.2313 18.5524 21.6613 17.1919 21.9004C15.8372 22.1385 14.1269 22.2002 12.0005 22.2002C9.87405 22.2002 8.1638 22.1385 6.80908 21.9004C5.44857 21.6613 4.36658 21.2312 3.56787 20.4326C2.76919 19.6339 2.33924 18.5519 2.1001 17.1914C1.88096 15.9446 1.81487 14.3965 1.80518 12.5H1.80029C1.80029 12.4313 1.80292 12.3628 1.80322 12.2949C1.80294 12.1976 1.8003 12.0992 1.80029 12C1.80029 11.8308 1.80434 11.664 1.80518 11.5H1.80029C1.80029 11.4589 1.8033 11.4185 1.80615 11.3789C1.81818 9.53752 1.88566 8.02881 2.1001 6.80859C2.33923 5.44801 2.76917 4.3661 3.56787 3.56738C4.36659 2.76866 5.44848 2.33875 6.80908 2.09961C8.16381 1.86153 9.87402 1.7998 12.0005 1.7998ZM15.4663 10.2109C15.3571 10.4289 15.1969 10.6951 14.9644 10.9609C14.4034 11.6019 13.4661 12.2002 12.0005 12.2002C10.5349 12.2002 9.59758 11.6019 9.03662 10.9609C8.80394 10.695 8.64289 10.429 8.53369 10.2109C8.38903 10.2154 8.21566 10.2205 8.021 10.2305C7.42516 10.261 6.63774 10.3213 5.85693 10.4414C5.0647 10.5633 4.3288 10.7396 3.80908 10.9795C3.3918 11.1721 3.25923 11.3328 3.21826 11.4268C3.20972 11.6614 3.20494 11.9099 3.20264 12.1729C3.20608 14.2106 3.26987 15.7593 3.479 16.9492C3.693 18.1666 4.04437 18.9286 4.55811 19.4424C5.07187 19.9561 5.83391 20.3075 7.05127 20.5215C8.27462 20.7365 9.87713 20.7998 12.0005 20.7998C14.1239 20.7998 15.7264 20.7365 16.9497 20.5215C18.1671 20.3075 18.9291 19.9561 19.4429 19.4424C19.9566 18.9286 20.308 18.1666 20.522 16.9492C20.7311 15.7593 20.7949 14.2106 20.7983 12.1729C20.796 11.9099 20.7903 11.6614 20.7817 11.4268C20.7406 11.3328 20.6085 11.1719 20.1919 10.9795C19.6722 10.7396 18.9362 10.5633 18.144 10.4414C17.3633 10.3213 16.5758 10.261 15.98 10.2305C15.7849 10.2205 15.6112 10.2154 15.4663 10.2109ZM12.0005 6.7002C9.88157 6.7002 8.2655 6.7629 7.02686 6.93555C5.78284 7.10895 4.99188 7.38436 4.47021 7.75684C3.91812 8.15119 3.58523 8.71574 3.3999 9.63184C4.06853 9.35418 4.88002 9.17614 5.64404 9.05859C6.48803 8.92875 7.32591 8.86398 7.94873 8.83203C8.26106 8.81602 8.52212 8.80774 8.70557 8.80371C8.7973 8.8017 8.87028 8.8013 8.92041 8.80078C8.94518 8.80053 8.96459 8.79987 8.97803 8.7998H9.54736L9.67822 9.3252V9.32324C9.6784 9.32377 9.67882 9.32486 9.6792 9.32617C9.68082 9.33176 9.68416 9.34428 9.68994 9.36133C9.70172 9.39598 9.72271 9.45136 9.75439 9.52051C9.81867 9.6607 9.9245 9.85061 10.0894 10.0391C10.4035 10.398 10.9665 10.7998 12.0005 10.7998C13.0345 10.7998 13.5976 10.398 13.9116 10.0391C14.0765 9.85057 14.1823 9.66071 14.2466 9.52051C14.2783 9.45131 14.2993 9.39598 14.311 9.36133C14.3168 9.34422 14.3202 9.33173 14.3218 9.32617V9.3252L14.4536 8.7998H15.0229C15.0364 8.79988 15.0558 8.80053 15.0806 8.80078C15.1307 8.80129 15.2037 8.8017 15.2954 8.80371C15.4789 8.80775 15.7399 8.81602 16.0522 8.83203C16.6751 8.86398 17.513 8.92875 18.3569 9.05859C19.1206 9.17609 19.9317 9.35438 20.6001 9.63184C20.4148 8.71594 20.0827 8.15116 19.5308 7.75684C19.0091 7.38437 18.2181 7.10896 16.9741 6.93555C15.7355 6.76289 14.1194 6.7002 12.0005 6.7002ZM12.0005 3.2002C9.87709 3.2002 8.27463 3.26351 7.05127 3.47852C5.83379 3.69251 5.07187 4.04385 4.55811 4.55762C4.09604 5.01969 3.76684 5.68283 3.54932 6.69727C3.58417 6.67057 3.61953 6.64405 3.65576 6.61816C4.4466 6.05328 5.49969 5.73475 6.8335 5.54883C8.17295 5.36213 9.86953 5.2998 12.0005 5.2998C14.1314 5.29981 15.828 5.36212 17.1675 5.54883C18.5012 5.73476 19.5544 6.0533 20.3452 6.61816C20.3812 6.64386 20.4161 6.67077 20.4507 6.69727C20.2332 5.68303 19.9048 5.01966 19.4429 4.55762C18.9291 4.04387 18.1671 3.69251 16.9497 3.47852C15.7264 3.2635 14.1239 3.2002 12.0005 3.2002Z" fill="currentColor"/></svg>`,
}

// #22273 §1.1 / #22274 §1.2.3.2 — the thread-name row that sits INSIDE the composer's input box,
// above the message row. One implementation, two callers: the chat composer (where the thread toggle
// reveals it) and the thread-creation view (where it is already open and pre-filled from the message
// the thread starts from). The name is always a PLACEHOLDER, never a value, so an untouched field
// means "no name chosen" and Send derives the title itself.
export const THREAD_NAME_PLACEHOLDER = 'Add a thread name (optional)'
export function threadNameRow({ hidden = true, placeholder = THREAD_NAME_PLACEHOLDER } = {}) {
  return `
          <div class="chat-thread-name" data-thread-name-row${hidden ? ' hidden' : ''}>
            <span class="chat-thread-name__glyph">${THREAD_GLYPH}</span>
            <input class="chat-thread-name__input" data-chat-thread-name data-thread-name type="text" maxlength="${store.TITLE_MAX}" placeholder="${escAttr(placeholder)}" aria-label="Thread name" />
            <button class="chat-thread-name__clear" data-chat-thread-clear title="Clear thread name" aria-label="Clear thread name" hidden>${CLOSE_X}</button>
          </div>`
}

// wire the row: clear button visibility + the toggle that shows/hides it (#22273 §1.1.1 clears on off)
export function bindThreadNameRow(root) {
  const row = root.querySelector('[data-thread-name-row]')
  const input = root.querySelector('[data-chat-thread-name]')
  const clear = root.querySelector('[data-chat-thread-clear]')
  const toggle = root.querySelector('[data-thread-toggle]')
  if (!row || !input) return
  const syncClear = () => { if (clear) clear.hidden = !input.value }
  input.addEventListener('input', syncClear)
  clear?.addEventListener('click', () => { input.value = ''; syncClear(); input.focus() })
  toggle?.addEventListener('click', () => {
    const on = row.hidden            // currently hidden → turning on
    row.hidden = !on
    toggle.classList.toggle('checked', on)
    toggle.setAttribute('aria-pressed', String(on))
    if (!on) { input.value = ''; syncClear() }
    else input.focus()
  })
  syncClear()
}

// editable composer — reuses .chat-input structure; NOT readonly (epic §3 post/edit).
// mobile = the Figma DS two-row layout (text on top, outlined icon toolbar + blue send below).
function threadComposer(placeholder, mobile = false, { copyLabel = '', copy = false, nameRow = null } = {}) {
  // #21935 — "also send to the parent" is a TOGGLE ICON on the composer's quick-icon bar, not a
  // checkbox row. Volo asked for this explicitly; it also removes the two focus/click workarounds
  // the revealed checkbox row needed.
  const copyToggle = (cls) => copyLabel
    ? `<button class="${cls} chat-input__copy-btn${copy ? ' checked' : ''}" data-copy-toggle type="button" title="${copyLabel}" aria-label="${copyLabel}" aria-pressed="${!!copy}">${ALSO_SEND_GLYPH}</button>`
    : ''
  const copyInline = ''
  // #22274 §1.2.3.3 — in the thread-creation view the composer's thread icon is already toggled on
  const nameRowHtml = nameRow ? threadNameRow(nameRow) : ''
  const toggleOn = nameRow && nameRow.hidden === false
  const threadToggle = (cls) => nameRow
    ? `<button class="${cls} chat-input__thread-btn${toggleOn ? ' checked' : ''}" data-thread-toggle type="button" title="Thread name" aria-label="Thread name" aria-pressed="${!!toggleOn}">${THREAD_GLYPH}</button>`
    : ''
  if (mobile) {
    return `
    <div class="chat-input thread-view__composer mcomposer">
      <div class="mcomposer__handle" aria-hidden="true"></div>
      ${nameRowHtml}
      <textarea class="chat-input__field mcomposer__field" data-thread-input placeholder="${placeholder}" rows="1" aria-label="${placeholder}"></textarea>
      ${copyInline}
      <div class="mcomposer__bar">
        <div class="mcomposer__actions">
          ${threadToggle('mcomposer__btn')}
          <button class="mcomposer__btn mcomposer__btn--text" title="Format" aria-label="Format text">Aa</button>
          <button class="mcomposer__btn" title="Camera" aria-label="Camera">${MCOMPOSER_ICONS.camera}</button>
          <button class="mcomposer__btn" title="Image" aria-label="Image">${MCOMPOSER_ICONS.image}</button>
          <button class="mcomposer__btn" title="Wallet" aria-label="Wallet">${MCOMPOSER_ICONS.wallet}</button>
          <button class="mcomposer__btn" title="Mention" aria-label="Mention">${MCOMPOSER_ICONS.mention}</button>
          <button class="mcomposer__btn" title="Emoji" aria-label="Emoji">${CHANNEL_ICONS.emojis}</button>
          ${copyToggle('mcomposer__btn')}
        </div>
        <button class="mcomposer__send" data-thread-send title="Send" aria-label="Send">${MCOMPOSER_ICONS.sendUp}</button>
      </div>
    </div>`
  }
  return `
    <div class="chat-input thread-view__composer">
      <div class="chat-input__row">
        <div class="chat-input__box">
          ${nameRowHtml}
          <div class="chat-input__input-row">
            <textarea class="chat-input__field" data-thread-input placeholder="${placeholder}" rows="1" aria-label="${placeholder}"></textarea>
            <button class="chat-input__btn chat-input__btn--send" data-thread-send title="Send" aria-label="Send">${CHANNEL_ICONS.send}</button>
          </div>
          ${copyInline}
          <div class="chat-input__actions chat-input__actions--below">
            ${threadToggle('chat-input__btn')}
            <button class="chat-input__btn" title="Commands" aria-label="Commands">${CHANNEL_ICONS.chatCommands}</button>
            ${formatGroup()}
            <button class="chat-input__btn" title="Emoji" aria-label="Emoji">${CHANNEL_ICONS.emojis}</button>
            <button class="chat-input__btn" title="GIF" aria-label="GIF">${CHANNEL_ICONS.gif}</button>
            <button class="chat-input__btn" title="Stickers" aria-label="Stickers">${CHANNEL_ICONS.stickers}</button>
            ${copyToggle('chat-input__btn')}
          </div>
        </div>
      </div>
    </div>`
}

// "#←" — channel hash + arrow: the composer toggle uses the same mark that tags the sent message
const ALSO_SEND_GLYPH = `<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 4 8 20M15.5 4 14 20M4.8 9h13M4.2 15h13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`
// close (X) — desktop side-panel dismiss (net-new; the full-screen view uses the back arrow instead)
const CLOSE_X = `<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`

function threadHeader({ title, sub, muted, back = true, menu = false, close = false, info = false }) {
  return `
    <div class="thread-view__header">
      ${back && !close ? `<button class="thread-view__back" data-back title="Back" aria-label="Back to conversation">${THREAD_ICONS.back}</button>` : ''}
      ${close ? `<span class="thread-view__lead-icon" aria-hidden="true">${THREAD_ICONS.thread}</span>` : ''}
      <div class="thread-view__titles">
        <span class="thread-view__title-row">
          <span class="thread-view__title" data-thread-title>${title}</span>
        </span>
        <span class="thread-view__sub">${sub}${muted ? `<span class="thread-view__muted" title="Muted" aria-label="Muted">${THREAD_ICONS.bellOff}</span>` : ''}</span>
      </div>
      <div class="thread-view__actions">
        <button class="chat-header__action-btn" title="Search" aria-label="Search thread">${CHANNEL_ICONS.search}</button>
        ${info ? `<button class="chat-header__action-btn" data-open-info="members" data-info-toggle title="Details" aria-label="Details">${INFO_ICON}</button>` : ''}
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
// ONE prefill rule, shared by both start-a-thread entry points: the first 50 characters of the
// source message — the existing message for #22274 §1.1.2, the message being typed for #22273 §2.3.
export const TITLE_PREFILL_CHARS = 50
export function titleFromText(text) {
  return (text || '').trim().replace(/\s+/g, ' ').slice(0, TITLE_PREFILL_CHARS)
}
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function renderCreate(surface, parentMsgId, { panel = false, mobile = false } = {}) {
  const s = SURFACES[surface] || SURFACES.channel
  const parent = resolveParent(surface, parentMsgId)
  // §1.2.2 / §1.2.3.2 — the title is prefilled from the first 50 characters of the initiating
  // message, as the placeholder of the name row inside the composer
  const prefillName = parent ? titleFromText(parent[4]) : ''
  return `
    <div class="thread-view thread-create">
      ${threadHeader({ title: 'Creating Thread', sub: s.in, back: !panel, close: panel, menu: false })}
      <div class="thread-view__messages">
        ${parent ? `<div class="thread-view__parent-label">Starting a thread from</div><div class="thread-view__parent">${msg(...parent)}</div>` : `<div class="thread-view__parent-label">New thread ${s.in}</div>`}
      </div>
      <div class="thread-create__foot">
        ${threadComposer('Type message', mobile, { nameRow: { hidden: false, placeholder: prefillName || THREAD_NAME_PLACEHOLDER } })}
      </div>
    </div>`
}

// #22402 §2 — the unread run inside a thread, so "Mark as read" has something visible to clear.
// Recreated from NewMessagesMarker.qml: 1px primaryColor1 rules either side of bold centred
// "%n missed message(s) since %1" (additionalTextSize), plus a 16px / radius-4 "NEW" badge at the
// right in indirectColor1 on primaryColor1.
function newMessagesMarker(count, sinceLabel) {
  const n = count === 1 ? '1 missed message' : `${count} missed messages`
  return `<div class="new-msgs-marker" role="separator" aria-label="${n} since ${sinceLabel}">
      <span class="new-msgs-marker__rule new-msgs-marker__rule--lead"></span>
      <span class="new-msgs-marker__text">${n} since ${sinceLabel}</span>
      <span class="new-msgs-marker__rule"></span>
      <span class="new-msgs-marker__badge">NEW</span>
    </div>`
}

// ---- Thread view (parent + replies + composer + "Send copy" toggle) ----
export function renderThread(t, { copy, panel = false, mobile = false, highlight = '' }) {
  const s = SURFACES[t.surface] || SURFACES.channel
  const title = t.title
  if (t.deleted) {
    return `<div class="thread-view thread-view--empty">
      ${threadHeader({ title, sub: s.in, muted: t.muted, menu: false, back: !panel, close: panel })}
      <div class="thread-empty">${THREAD_ICONS.thread}<div class="thread-empty__title">This thread was deleted</div><div class="thread-empty__sub">The thread and its replies are no longer available.</div><button class="thread-empty__back" data-back>Back to ${s.label}</button></div>
    </div>`
  }
  // archiving is NOT restrictive and NOT manual — a thread just falls out of the lists after a
  // week of quiet, and replying here brings it straight back
  const composer = threadComposer(`Reply in #${t.title}`, mobile, { copyLabel: s.copy, copy })
  // the unread run sits at the end of the list; the marker goes immediately before it
  const unreadFrom = t.newCount > 0 ? Math.max(0, t.messages.length - t.newCount) : -1
  const replyRows = t.messages.map((m, i) =>
    (i === unreadFrom ? newMessagesMarker(t.newCount, m.time) : '') +
    // #21935 §2 — the reply a copied channel message came from gets flashed when you jump to it
    msg(m.name, m.initial, m.color, m.time, m.text, { ...m.opts, id: m.id, threadEditable: m.own, highlight: m.id === highlight })).join('')
  return `
    <div class="thread-view" data-thread-id="${t.id}">
      ${threadHeader({ title, sub: s.in, muted: t.muted, menu: true, back: !panel, close: panel, info: !panel && !mobile })}
      <div class="thread-view__messages">
        <div class="thread-view__parent">${msg(...t.parentMsg)}</div>
        <div class="thread-view__reply-sep"><span>${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}</span></div>
        ${replyRows || '<div class="thread-view__empty-replies">No replies yet — start the discussion.</div>'}
      </div>
      ${composer}
    </div>`
}

// ---- Threads list / index (epic §5 + §6.1 lifecycle) ----
function threadRow(t) {
  const archived = store.isArchived(t)   // computed from inactivity, never a stored flag
  const people = store.participants(t)
  const when = relTime(t.lastActivityTs)
  return `
    <button class="thread-row${t.followed && t.unread ? ' unread' : ''}${archived ? ' archived' : ''}" data-open-thread="${t.id}" data-surface="${t.surface}" aria-label="${t.title}, ${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}${t.followed && t.unread ? ', unread' : ''}${archived ? ', archived' : ''}">
      <span class="thread-row__icon">${archived ? THREAD_ICONS.archive : THREAD_ICONS.thread}</span>
      <span class="thread-row__body">
        <span class="thread-row__top"><span class="thread-row__title">${t.title}</span>${t.keptVisible ? `<span class="thread-row__pin" title="Pinned to list">${THREAD_ICONS.pin}</span>` : ''}${t.followed ? '<span class="thread-row__followed" title="Following">·</span>' : ''}${t.followed && t.unread ? `<span class="thread-row__count" title="New messages">${t.newCount || 1}</span>` : ''}</span>
        <span class="thread-row__meta"><span class="thread-row__channel">${t.channelLabel}</span><span class="thread-row__sep">·</span><span>${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}</span><span class="thread-row__sep">·</span><span class="thread-row__when">${THREAD_ICONS.clock}${when}</span></span>
      </span>
      ${avatarStack(people)}
    </button>`
}
function renderList(surface) {
  const all = surface ? store.threadsForSurface(surface) : store.allThreads()
  const active = all.filter(t => !store.isArchived(t))
  const past = all.filter(t => store.isArchived(t))
  return `
    <div class="thread-list">
      <div class="thread-list__header"><button class="thread-view__back" data-back title="Back" aria-label="Back">${THREAD_ICONS.back}</button><span class="thread-list__title">Threads${surface ? ` — ${SURFACES[surface].label}` : ''}</span></div>
      <div class="thread-list__section">Active — ${active.length}</div>
      ${active.map(threadRow).join('') || '<div class="thread-list__empty">No active threads.</div>'}
      <div class="thread-list__section">Archived — ${past.length}</div>
      ${past.map(threadRow).join('') || '<div class="thread-list__empty">No archived threads.</div>'}
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

  // "Send copy to #channel" checkbox (epic §3.1).
  // Persist the choice into the `copy` URL param (which renderThread reads) so posting a reply
  // — which triggers a re-render — doesn't silently snap the checkbox back on/off.
  bindCopyToggle(root)

  // ---- create flow: Send creates a thread in the model (epic §15/UC1) ----
  if (p.get('tview') === 'create') {
    bindThreadNameRow(root)          // #22274 §1.2.3 — clear button + the composer's thread toggle
    const send = () => {
      const nameEl = root.querySelector('[data-chat-thread-name]')
      const inputEl = root.querySelector('[data-thread-input]')
      const text = (inputEl?.value || '').trim()
      if (!text) { inputEl?.focus(); return }
      const parentMsgId = p.get('parent')
      const parent = resolveParent(surface, parentMsgId)
      const typed = (nameEl?.value || '').trim()
      const ph = nameEl?.placeholder || ''
      const title = typed || (ph && ph !== THREAD_NAME_PLACEHOLDER ? ph : '')
      const t = store.createThread({ surface, parentMsgId, parentMsg: parent, title, firstMessage: text })
      const q = new URLSearchParams(location.search)
      q.set('screen', 'threads'); q.set('tview', 'thread'); q.set('t', t.id); q.set('surface', surface); q.set('from', p.get('from') || 'chat'); q.set('created', '1'); q.delete('parent')
      location.search = q.toString()
    }
    bindComposerSend(root, send)
    if (p.get('created') !== '1') root.querySelector('[data-thread-input]')?.focus()
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
      const copyOn = isCopyOn(root)
      store.postReply(threadId, text, { copyToParent: copyOn })
      // store.emit → main re-renders in place; focus the fresh composer + toast if copied
      requestAnimationFrame(() => {
        const el = document.querySelector('.thread-screen [data-thread-input]'); el && el.focus()
        if (copyOn) floatToast(document.querySelector('.thread-screen'), 'Reply also posted to ' + (SURFACES[surface]?.label || 'channel'))
      })
    }
    bindComposerSend(root, send)

    // more menu → follow · mute · mark-read · copy link · pin · delete (#22401)
    root.querySelector('[data-thread-more]')?.addEventListener('click', (e) => {
      e.stopPropagation(); openThreadMenu(root, threadId, e.currentTarget)
    })
    // inline edit of own thread messages (epic §16/UC2)
    bindInlineEdit(root, threadId)
    bindHighlight(root)
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

// The composer is a single-row textarea by default, so a long message scrolls inside one line of
// height. Grow it with the content up to the CSS max-height (past which it scrolls). Returns the
// measure fn so callers can re-fit after clearing the field programmatically (send).
export function autosize(el) {
  if (!el) return () => {}
  const max = parseInt(getComputedStyle(el).maxHeight, 10) || 200
  const fit = () => {
    el.style.height = 'auto'                                  // shrink first, or it can only grow
    el.style.height = Math.min(el.scrollHeight, max) + 'px'
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
  }
  el.addEventListener('input', fit)
  fit()
  return fit
}

// #21935 §2 — scroll the jumped-to reply into view and let the flash fade, then strip `hl` so a
// later re-render does not flash it again.
export function bindHighlight(root) {
  const el = root.querySelector('.message--highlight')
  if (!el) return
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  setTimeout(() => {
    el.classList.remove('message--highlight')
    try { const u = new URL(location.href); u.searchParams.delete('hl'); history.replaceState(null, '', u) } catch {}
  }, 2200)
}

// #21935 — the "also send to the parent" toggle. State lives in the `copy` URL param (which the
// renderer reads) so posting a reply — which re-renders — cannot silently flip it back.
export function isCopyOn(root) { return !!root.querySelector('[data-copy-toggle]')?.classList.contains('checked') }
export function bindCopyToggle(root) {
  const btn = root.querySelector('[data-copy-toggle]')
  btn?.addEventListener('click', () => {
    const on = !btn.classList.contains('checked')
    btn.classList.toggle('checked', on)
    btn.setAttribute('aria-pressed', String(on))
    try { const u = new URL(location.href); on ? u.searchParams.set('copy', '1') : u.searchParams.delete('copy'); history.replaceState(null, '', u) } catch {}
  })
}

// wire Send button + Enter-to-send on a composer
export function bindComposerSend(root, send) {
  const btn = root.querySelector('[data-thread-send]')
  const input = root.querySelector('[data-thread-input]')
  autosize(input)
  btn?.addEventListener('click', send)
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } })
}

// #22275 — inline rename of the thread title, in place in the header (no modal). Creator-only:
// the pencil is rendered only when store.isCreator(t), so binding is a no-op elsewhere.
// The current value is read from the rendered `textContent`, which decodes the stored (escaped)
// title back to plain text — writing it straight into the input would show raw entities.
// Opens the inline title editor. Reached ONLY from "Edit name" in the thread context menu — Volo
// asked for the hover pencil to go (#22275 §1, #21933 §2), so the menu is the single route on both
// desktop and mobile.
export function startTitleEdit(root, threadId) {
  const titleEl = root.querySelector('[data-thread-title]')
  if (!titleEl || root.querySelector('.thread-view__title-input')) return
  const current = titleEl.textContent.trim()
  const input = document.createElement('input')
  input.className = 'thread-view__title-input'
  input.type = 'text'
  input.value = current
  input.maxLength = store.TITLE_MAX
  input.setAttribute('aria-label', 'Thread name')
  titleEl.style.display = 'none'
  titleEl.after(input)
  input.focus(); input.setSelectionRange(current.length, current.length)
  let done = false
  const restore = () => { done = true; input.remove(); titleEl.style.display = '' }
  const commit = () => {
    if (done) return
    const next = input.value.trim()
    restore()
    // renameThread ignores an empty or unchanged title, so cancelling by clearing is safe
    store.renameThread(threadId, next)
  }
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    else if (e.key === 'Escape') { e.preventDefault(); restore() }
  })
  input.addEventListener('blur', commit)
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

// "Share link" modal — thread title + copyable link
function openShareModal(t) {
  document.querySelector('.share-modal-overlay')?.remove()
  const link = `https://status.app/t/${t.id}`
  const overlay = document.createElement('div')
  overlay.className = 'share-modal-overlay'
  overlay.innerHTML = `
    <div class="share-modal" role="dialog" aria-label="Share thread">
      <div class="share-modal__head">
        <span class="share-modal__title">Share thread</span>
        <button class="share-modal__close" data-share-close title="Close" aria-label="Close">${CLOSE_X}</button>
      </div>
      <div class="share-modal__thread"><span class="share-modal__glyph">${THREAD_ICONS.thread}</span><span class="share-modal__name">${t.title}</span></div>
      <div class="share-modal__linkrow">
        <input class="share-modal__link" type="text" readonly value="${link}" aria-label="Thread link" />
        <button class="share-modal__copy" data-share-copy>Copy</button>
      </div>
    </div>`
  document.body.appendChild(overlay)
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onEsc) }
  const onEsc = (e) => { if (e.key === 'Escape') close() }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })
  overlay.querySelector('[data-share-close]').addEventListener('click', close)
  const copyBtn = overlay.querySelector('[data-share-copy]')
  const input = overlay.querySelector('.share-modal__link')
  copyBtn.addEventListener('click', () => {
    input.select()
    navigator.clipboard?.writeText(link).catch(() => {})
    copyBtn.textContent = 'Copied'; copyBtn.classList.add('done')
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('done') }, 1500)
  })
  document.addEventListener('keydown', onEsc)
}

// Destructive-action confirmation, shaped like the source's ConfirmationDialog.qml /
// DeleteMessageConfirmationPopup.qml: a header title, body copy at primaryTextFontSize/directColor1,
// an optional "Do not show this again" checkbox, and right-aligned Cancel (flat) + Danger confirm.
// Status warns that other clients are not guaranteed to delete too — a thread deletion carries the
// same caveat, so the copy says it rather than implying a guaranteed wipe.
const DONT_WARN_KEY = 'threadsSkipDeleteWarning'
const skipDeleteWarning = () => { try { return localStorage.getItem(DONT_WARN_KEY) === '1' } catch { return false } }

export function confirmDeleteThread(t, onConfirm) {
  if (skipDeleteWarning()) { onConfirm(); return }
  document.querySelector('.confirm-modal-overlay')?.remove()
  const overlay = document.createElement('div')
  overlay.className = 'share-modal-overlay confirm-modal-overlay'
  // Layout copied from the app's delete-message popup: title + close X, divider, body, "Do not show
  // this again", divider, a SINGLE danger Confirm on the right. There is no Cancel button — the X
  // (and Escape / click-outside) is the way out, so focus lands there rather than on Confirm.
  overlay.innerHTML = `
    <div class="share-modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-body">
      <div class="confirm-modal__head">
        <span class="share-modal__title" id="confirm-title">Confirm deleting this thread</span>
        <button class="share-modal__close" data-confirm-cancel title="Close" aria-label="Close">${CLOSE_X}</button>
      </div>
      <div class="confirm-modal__main">
        <p class="confirm-modal__body" id="confirm-body">Are you sure you want to delete this thread? Be aware that other clients are not guaranteed to delete the thread as well.</p>
        <label class="confirm-modal__check">
          <input type="checkbox" data-confirm-skip />
          <span>Do not show this again</span>
        </label>
      </div>
      <div class="confirm-modal__actions">
        <button class="confirm-modal__btn confirm-modal__btn--danger" data-confirm-ok>Confirm</button>
      </div>
    </div>`
  document.body.appendChild(overlay)
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey) }
  const onKey = (e) => { if (e.key === 'Escape') close() }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })
  overlay.querySelector('[data-confirm-cancel]').addEventListener('click', close)
  overlay.querySelector('[data-confirm-ok]').addEventListener('click', () => {
    if (overlay.querySelector('[data-confirm-skip]').checked) { try { localStorage.setItem(DONT_WARN_KEY, '1') } catch {} }
    close()
    onConfirm()
  })
  overlay.querySelector('[data-confirm-cancel]').focus()
  document.addEventListener('keydown', onKey)
}

// ---- menu placement, viewport-relative ----
// Every thread menu is an overlay, so it is positioned with `position: fixed` against the viewport
// rather than `absolute` against whatever container it was appended to. The containers differ per
// surface (.thread-panel is relative, .shell__center .thread-view is static), and an absolute offset
// computed against one but resolved against another lands the menu in the wrong place.
const VIEWPORT_MARGIN = 8

function placeMenu(menu, { anchor, at, mobile }) {
  menu.style.position = 'fixed'
  menu.style.margin = '0'
  if (mobile) {
    // a sheet spanning the PHONE FRAME, not the browser window — in this prototype the mobile shell
    // is a phone mock inside a much wider page, and `fixed` is relative to the window
    const top = at ? at.y : (anchor?.getBoundingClientRect().bottom ?? 0) + 4
    sheet(menu, top)
    return
  }
  menu.style.right = 'auto'
  const w = menu.getBoundingClientRect().width
  const h = menu.getBoundingClientRect().height
  let top, left
  if (at) { top = at.y; left = at.x }
  else {
    const r = anchor.getBoundingClientRect()
    top = r.bottom + 4
    left = r.right - w          // right-aligned to the trigger
  }
  menu.style.left = clamp(left, w) + 'px'
  menu.style.top = clamp(top, h, true) + 'px'
}

function placeFlyout(fly, menu, row, mobile) {
  fly.style.position = 'fixed'
  fly.style.margin = '0'
  const fr = fly.getBoundingClientRect()
  if (mobile) {
    // no hover on touch: the flyout takes over as a drill-down rather than sitting beside the menu
    const menuTop = menu.getBoundingClientRect().top
    menu.style.visibility = 'hidden'
    sheet(fly, menuTop)
    return
  }
  fly.style.right = 'auto'
  const mr = menu.getBoundingClientRect()
  // sit beside the menu, flipping to its left when the menu already hugs the right edge
  const fitsRight = mr.right + fr.width + VIEWPORT_MARGIN < innerWidth
  fly.style.left = clamp(fitsRight ? mr.right + 4 : mr.left - fr.width - 4, fr.width) + 'px'
  fly.style.top = clamp(row.getBoundingClientRect().top, fr.height, true) + 'px'
}

// lay a menu out as a sheet inside the mobile phone frame (falling back to the window if absent)
function sheet(el, top) {
  const frame = document.querySelector('.shell--mobile')?.getBoundingClientRect()
  const left = (frame ? frame.left : 0) + VIEWPORT_MARGIN
  const width = (frame ? frame.width : innerWidth) - VIEWPORT_MARGIN * 2
  const bottomLimit = (frame ? frame.bottom : innerHeight) - VIEWPORT_MARGIN
  const topLimit = (frame ? frame.top : 0) + VIEWPORT_MARGIN
  el.style.right = 'auto'
  el.style.left = left + 'px'
  el.style.width = width + 'px'
  el.style.top = Math.max(topLimit, Math.min(top, bottomLimit - el.getBoundingClientRect().height)) + 'px'
}

// keep a box of size `size` inside the viewport on the given axis
function clamp(pos, size, vertical = false) {
  const limit = (vertical ? innerHeight : innerWidth) - size - VIEWPORT_MARGIN
  return Math.max(VIEWPORT_MARGIN, Math.min(pos, limit))
}

// thread context menu (#22401) — Edit name · Follow · Mute › · Mark as read · Copy/Share link ·
// Pin to list · Delete. Opened by the "…" button on the thread view, or by right-click /
// long-press on a thread row in the channel or chat list (then `opts.at` positions it at the pointer).
export function openThreadMenu(root, threadId, anchor, opts = {}) {
  root.querySelector('.thread-more-menu')?.remove()
  const t = store.getThread(threadId); if (!t) return
  const mobile = !!document.querySelector('.shell--mobile')
  const manage = store.canManageThread(t)          // creator OR community admin (#22275 / #22280)

  const menu = document.createElement('div')
  menu.className = 'msg-cmenu thread-more-menu'
  menu.setAttribute('role', 'menu')
  const item = (icon, label, act, cls = '', extra = '') =>
    `<button class="msg-cmenu__item${cls}" role="menuitem" data-act="${act}" ${extra}>${icon}<span>${label}</span></button>`

  // Mute is a DURATION submenu while unmuted, a single action once muted (#22282)
  const muteItem = t.muted
    ? item(THREAD_ICONS.bell, 'Unmute thread', 'unmute')
    : item(THREAD_ICONS.bellOff, 'Mute thread', 'mute-menu', ' msg-cmenu__item--submenu', 'aria-haspopup="true"')

  menu.innerHTML =
    (manage ? item(THREAD_ICONS.edit, 'Edit name', 'rename') : '') +
    item(THREAD_ICONS.check, t.followed ? 'Unfollow' : 'Follow', 'follow') +
    muteItem +
    item(THREAD_ICONS.checkCircle, 'Mark as read', 'read') +
    // #22285 — desktop copies the link outright; mobile opens the OS share sheet
    (mobile ? item(THREAD_ICONS.link, 'Share link', 'share') : item(THREAD_ICONS.copy, 'Copy link', 'copy')) +
    // #22284 — the options are "Pin to list" / "Unpin from list"
    item(THREAD_ICONS.pin, t.keptVisible ? 'Unpin from list' : 'Pin to list', 'keep') +
    (manage ? item(THREAD_ICONS.del, 'Delete', 'delete', ' msg-cmenu__item--danger') : '')

  // Placement is VIEWPORT-relative (position: fixed), never root-relative. `root` varies by surface
  // — the side panel is position:relative but the main-pane .thread-view is static, so an absolute
  // offset measured against root silently resolved against <body> and threw the menu hundreds of
  // pixels off. Fixed coordinates remove the offsetParent question entirely.
  root.appendChild(menu)
  placeMenu(menu, { anchor, at: opts.at, mobile })

  const teardown = () => {
    menu.remove(); root.querySelector('.thread-mute-menu')?.remove()
    document.removeEventListener('mousedown', dismiss); document.removeEventListener('keydown', onKey)
  }

  const acts = {
    // the menu is removed before acts run, so the header is back in place for the editor to take
    rename: () => startTitleEdit(root, threadId),
    follow: () => store.setFollowed(threadId, !t.followed),
    unmute: () => store.setMuted(threadId, false),
    read: () => store.markAllRead(threadId),
    copy: () => copyThreadLink(root, t),
    share: () => openShareModal(t),
    keep: () => store.setKeptVisible(threadId, !t.keptVisible),
    delete: () => confirmDeleteThread(t, () => store.deleteThread(threadId)),
  }

  // ---- mute duration flyout (MuteChatMenuItem.qml) ----
  const muteBtn = menu.querySelector('[data-act="mute-menu"]')
  const openMuteFlyout = () => {
    if (root.querySelector('.thread-mute-menu')) return
    const fly = document.createElement('div')
    fly.className = 'msg-cmenu thread-mute-menu'
    fly.setAttribute('role', 'menu')
    fly.innerHTML = store.MUTE_INTERVALS.map(([key, label]) =>
      `<button class="msg-cmenu__item" role="menuitem" data-mute-interval="${key}"><span>${label}</span></button>`).join('')
    root.appendChild(fly)
    placeFlyout(fly, menu, muteBtn, mobile)
    fly.querySelectorAll('[data-mute-interval]').forEach(b => b.addEventListener('click', () => {
      const key = b.dataset.muteInterval
      teardown()
      store.setMuted(threadId, true, key)
    }))
  }
  muteBtn?.addEventListener('mouseenter', openMuteFlyout)
  muteBtn?.addEventListener('click', (e) => { e.stopPropagation(); openMuteFlyout() })
  muteBtn?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); openMuteFlyout() } })
  // hovering any other row closes the flyout
  menu.querySelectorAll('.msg-cmenu__item:not([data-act="mute-menu"])').forEach(b =>
    b.addEventListener('mouseenter', () => { root.querySelector('.thread-mute-menu')?.remove(); menu.style.visibility = '' }))

  menu.querySelectorAll('.msg-cmenu__item').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.act === 'mute-menu') return      // opens the flyout, does not act
    teardown()
    acts[btn.dataset.act]?.()
  }))
  // a11y: focus first, Escape + outside-click dismiss
  menu.querySelector('.msg-cmenu__item')?.focus()
  const dismiss = (e) => {
    if (menu.contains(e.target) || e.target === anchor) return
    if (root.querySelector('.thread-mute-menu')?.contains(e.target)) return
    teardown()
  }
  const onKey = (e) => { if (e.key === 'Escape') { teardown(); anchor?.focus?.() } }
  setTimeout(() => { document.addEventListener('mousedown', dismiss); document.addEventListener('keydown', onKey) }, 0)
}

// #22285 §1 — on Desktop "Copy link" copies straight to the clipboard, no modal
function copyThreadLink(root, t) {
  const link = `https://status.app/t/${t.id}`
  navigator.clipboard?.writeText(link).catch(() => {})
  floatToast(root.closest('.shell__right, .shell__center, .thread-screen') || root, 'Thread link copied')
}

// #22401 §1.2 — right-click (desktop) / long-press (mobile) on a thread row opens the same menu
export function bindThreadRowMenu(rowSelector, resolveRoot) {
  document.querySelectorAll(rowSelector).forEach(row => {
    const id = row.dataset.openThread
    if (!id) return
    const open = (x, y) => {
      const host = resolveRoot(row)
      if (!host) return
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative'
      openThreadMenu(host, id, row, { at: { x, y } })
    }
    row.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); open(e.clientX, e.clientY) })
    let timer = null, moved = false
    row.addEventListener('touchstart', (e) => {
      moved = false
      const tch = e.touches[0]
      timer = setTimeout(() => { if (!moved) open(tch.clientX, tch.clientY) }, 500)
    }, { passive: true })
    row.addEventListener('touchmove', () => { moved = true; clearTimeout(timer) }, { passive: true })
    row.addEventListener('touchend', () => clearTimeout(timer))
  })
}

export function floatToast(root, text) {
  if (!root) return
  // .thread-toast is absolutely positioned, so the root has to BE the positioning context — a static
  // root (e.g. .shell__center) silently centres the toast on the window instead of the column.
  if (getComputedStyle(root).position === 'static') root.style.position = 'relative'
  root.querySelector('.thread-toast')?.remove()
  const el = document.createElement('div')
  el.className = 'thread-toast'
  el.setAttribute('role', 'status')
  el.innerHTML = `${THREAD_ICONS.check}${text}`
  root.appendChild(el)
  setTimeout(() => el.classList.add('hide'), 2600)
  setTimeout(() => el.remove(), 3000)
}
