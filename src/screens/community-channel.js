// All SVG icons sourced from /home/alisher/status-desktop/ui/StatusQ/src/assets/img/icons/
// Hardcoded fill/stroke colors replaced with currentColor

import * as store from '../thread-store.js'
import { SURFACES } from '../thread-store.js'
// desktop thread side-panel reuses the thread renderers + binders (epic §1)
import { renderThread, renderCreate, resolveParent, bindComposerSend, openThreadMenu, bindInlineEdit, floatToast } from './threads.js'

export const CHANNEL_ICONS = {
  // tiny/channel.svg (viewBox="0 0 16 17") — community channel type icon
  channel: `<svg viewBox="0 0 16 17" fill="none"><path clip-rule="evenodd" d="m6.61568 2.47557c-.40782-.0725-.79719.19933-.86969.60715l-.32807 1.84548c-.05515.31023-.32487.53623-.63997.53623h-1.69725c-.41421 0-.75.33579-.75.75s.33579.75.75.75h1.1995c.4045 0 .71076.36551.63996.76376l-.29635 1.66706c-.05515.31024-.32487.53624-.63997.53624h-1.63474c-.41422 0-.75.33581-.75.75001s.33578.75.75.75h1.13698c.40451 0 .71077.3655.63997.7638l-.25617 1.441c-.0725.4078.19933.7972.60715.8697s.7972-.1994.8697-.6072l.34329-1.9311c.05515-.3102.32487-.5362.63996-.5362h1.975c.4045 0 .71077.3655.63997.7638l-.25617 1.441c-.0725.4078.19933.7972.60715.8697s.79717-.1994.86967-.6072l.3433-1.9311c.0552-.3102.3249-.5362.64-.5362h1.7677c.4142 0 .75-.3358.75-.75s-.3358-.75001-.75-.75001h-1.27c-.4045 0-.7107-.36551-.6399-.76377l.2963-1.66706c.0552-.31023.3249-.53623.64-.53623h1.7079c.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75h-1.2101c-.4046 0-.7108-.36551-.64-.76377l.2409-1.3554c.0725-.40782-.1993-.79719-.6071-.86969s-.7972.19933-.8697.60715l-.3281 1.84548c-.0551.31023-.32485.53623-.63995.53623h-1.975c-.4045 0-.71076-.36551-.63996-.76377l.24095-1.3554c.07249-.40782-.19934-.79719-.60716-.86969zm2.18706 7.45592c.3151 0 .58482-.226.63997-.53624l.29635-1.66705c.0708-.39826-.23546-.76377-.63997-.76377h-1.975c-.31509 0-.58481.226-.63996.53623l-.29636 1.66706c-.0708.39826.23547.76377.63997.76377z" fill="currentColor" fill-rule="evenodd"/></svg>`,

  // search.svg (viewBox="0 0 24 24")
  search: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m14.8504 15.9111c-.1795-.1796-.4641-.1942-.6734-.0504-1.0457.7187-2.3122 1.1393-3.677 1.1393-3.58985 0-6.5-2.9101-6.5-6.5 0-3.58985 2.91015-6.5 6.5-6.5 3.5899 0 6.5 2.91015 6.5 6.5 0 1.3648-.4206 2.6313-1.1393 3.677-.1438.2093-.1292.4939.0504.6734l4.6192 4.6194c.2929.2929.2929.7678 0 1.0607-.2929.2928-.7677.2928-1.0606-.0001zm.6496-5.4111c0 2.7614-2.2386 5-5 5-2.76142 0-5-2.2386-5-5 0-2.76142 2.23858-5 5-5 2.7614 0 5 2.23858 5 5z" fill="currentColor" fill-rule="evenodd"/></svg>`,

  // group-chat.svg (viewBox="0 0 24 24") — members button
  groupChat: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path clip-rule="evenodd" d="m14.2516 12.4656c.2421-.1223.5419-.0586.7191.1467.7335.8498 1.8186 1.3877 3.0293 1.3877 2.2091 0 4-1.7909 4-4 0-2.20914-1.7909-4-4-4-.2938 0-.5801.03167-.8559.09177-.2649.05774-.543-.07088-.6637-.31369-.8181-1.64652-2.5171-2.77808-4.4804-2.77808s-3.66231 1.13156-4.48042 2.77808c-.12064.24281-.3988.37144-.66371.31369-.27574-.0601-.56211-.09177-.85587-.09177-2.20914 0-4 1.79086-4 4 0 2.2091 1.79086 4 4 4 1.21068 0 2.29574-.5379 3.02925-1.3877.17722-.2053.47708-.269.71917-.1467.67668.3418 1.44168.5344 2.25158.5344s1.5749-.1926 2.2516-.5344zm1.2484-4.4656c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5zm.5355 2.9526c-.1235.1686-.1507.3969-.0239.563.4568.5984 1.1775.9844 1.9884.9844 1.3807 0 2.5-1.1193 2.5-2.5 0-1.38071-1.1193-2.5-2.5-2.5-.2569 0-.5047.03875-.738.11071-.1659.05117-.262.21573-.262.38929 0 1.10444-.3581 2.1252-.9645 2.9526zm-9.29748-3.34188c-.23327-.07197-.48112-.11072-.73802-.11072-1.38071 0-2.5 1.11929-2.5 2.5 0 1.3807 1.11929 2.5 2.5 2.5.81088 0 1.53159-.3861 1.98837-.9844.12678-.1661.09962-.3944-.02389-.563-.6064-.8274-.96448-1.84817-.96448-2.9526 0-.17356-.09613-.33811-.26198-.38928z" fill-rule="evenodd"/><path d="m5.14735 21.0368c.38363.0959.77209-.1227.93627-.4825 1.02428-2.2444 3.28819-3.8043 5.91638-3.8043 2.6684 0 4.9613 1.6079 5.9625 3.9077.1664.3821.5853.6086.9831.4843.393-.1228.6166-.5414.4605-.9224-1.1942-2.9157-4.0603-4.9696-7.4061-4.9696-3.29596 0-6.1264 1.9932-7.35166 4.8401-.17205.3997.07681.8412.49901.9467z"/></g></svg>`,

  // more.svg (viewBox="0 0 24 24") — three dots menu
  more: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m7 12c0 1.1046-.89543 2-2 2s-2-.8954-2-2 .89543-2 2-2 2 .8954 2 2z"/><path d="m14 12c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2z"/><path d="m19 14c1.1046 0 2-.8954 2-2s-.8954-2-2-2-2 .8954-2 2 .8954 2 2 2z"/></g></svg>`,

  // chat-commands.svg (viewBox="0 0 24 24")
  chatCommands: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m12 7.25c.4142 0 .75.33579.75.75v2.75c0 .2761.2239.5.5.5h2.75c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-2.75c-.2761 0-.5.2239-.5.5v2.75c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75v-2.75c0-.2761-.2239-.5-.5-.5h-2.75c-.41421 0-.75-.3358-.75-.75s.33579-.75.75-.75h2.75c.2761 0 .5-.2239.5-.5v-2.75c0-.41421.3358-.75.75-.75z"/><path clip-rule="evenodd" d="m2 12c0-5.52285 4.47715-10 10-10 5.5228 0 10 4.47715 10 10v6.6667c0 1.8409-1.4924 3.3333-3.3333 3.3333h-6.6667c-5.52285 0-10-4.4772-10-10zm18.5 0v6.6667c0 1.0125-.8208 1.8333-1.8333 1.8333h-6.6667c-4.69442 0-8.5-3.8056-8.5-8.5 0-4.69442 3.80558-8.5 8.5-8.5 4.6944 0 8.5 3.80558 8.5 8.5z" fill-rule="evenodd"/></g></svg>`,

  // emojis.svg (viewBox="0 0 24 24")
  emojis: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path clip-rule="evenodd" d="m12 20.5c4.6944 0 8.5-3.8056 8.5-8.5 0-4.69442-3.8056-8.5-8.5-8.5-4.69442 0-8.5 3.80558-8.5 8.5 0 4.6944 3.80558 8.5 8.5 8.5zm0 1.5c5.5228 0 10-4.4772 10-10 0-5.52285-4.4772-10-10-10-5.52285 0-10 4.47715-10 10 0 5.5228 4.47715 10 10 10z" fill-rule="evenodd"/><path d="m9.56858 15.1746c-.33955-.2373-.81146-.2438-1.10436.0491-.29289.2929-.29546.7723.03286 1.0248.96987.7461 2.18452 1.1896 3.50272 1.1896s2.5328-.4435 3.5026-1.1896c.3284-.2525.3258-.7319.0329-1.0248s-.7648-.2864-1.1044-.0491c-.6889.4812-1.527.7635-2.4311.7635-.9042 0-1.7423-.2823-2.43122-.7635z"/><path d="m17 10.5c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5c0-.82843.6716-1.5 1.5-1.5s1.5.67157 1.5 1.5z"/><path d="m10 10.5c0 .8284-.67157 1.5-1.5 1.5s-1.5-.6716-1.5-1.5c0-.82843.67157-1.5 1.5-1.5s1.5.67157 1.5 1.5z"/></g></svg>`,

  // gif.svg (viewBox="0 0 20 20")
  gif: `<svg viewBox="0 0 20 20" fill="none"><g fill="currentColor"><path clip-rule="evenodd" d="m16 1.5h-12c-1.38071 0-2.5 1.11929-2.5 2.5v12c0 1.3807 1.11929 2.5 2.5 2.5h12c1.3807 0 2.5-1.1193 2.5-2.5v-12c0-1.38071-1.1193-2.5-2.5-2.5zm-12-1.5c-2.20914 0-4 1.79086-4 4v12c0 2.2091 1.79086 4 4 4h12c2.2091 0 4-1.7909 4-4v-12c0-2.20914-1.7909-4-4-4z" fill-rule="evenodd"/><path d="m8.72261 11.4868v-1.0735c0-.41802-.342-.76002-.76-.76002h-1.7385c-.323 0-.5795.2565-.5795.57952 0 .342.2565.5985.5795.5985h1.1495v.76c-.2565.2375-.7885.4845-1.349.4845-1.1495 0-1.9855-.8835-1.9855-2.08052 0-1.197.836-2.0805 1.9855-2.0805.4845 0 .9595.209 1.3205.5605.1235.1235.2945.19.456.19.3325 0 .6365-.2755.6365-.608 0-.1425-.057-.2945-.1615-.4085-.494-.532-1.2255-.931-2.2515-.931-1.8525 0-3.3725 1.273-3.3725 3.2775 0 1.99502 1.52 3.28702 3.3725 3.28702 1.2825 0 2.698-.646 2.698-1.7955z"/><path d="m11.4392 12.5603v-5.12052c0-.361-.304-.665-.665-.665-.38 0-.684.304-.684.665v5.12052c0 .361.304.665.665.665.38 0 .684-.304.684-.665z"/><path d="m17.3479 7.43029c0-.33251-.266-.5985-.5795-.5985h-3.2015c-.418 0-.76.342-.76.76v4.96851c0 .361.304.665.665.665.38 0 .684-.304.684-.665v-1.514c0-.2762.2238-.5.5-.5h1.5866c.3135 0 .5795-.266.5795-.58902 0-.3325-.266-.59849-.5795-.59849h-1.5866c-.2762 0-.5-.22386-.5-.5v-.3395c0-.27615.2238-.5.5-.5h2.1125c.3135 0 .5795-.266.5795-.589z"/></g></svg>`,

  // stickers.svg (viewBox="0 0 24 24")
  stickers: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m9.56858 15.4864c-.33955-.2372-.81146-.2437-1.10436.0492-.29289.2929-.29546.7723.03286 1.0248.96987.7461 2.18452 1.1896 3.50272 1.1896s2.5328-.4435 3.5026-1.1896c.3284-.2525.3258-.7319.0329-1.0248s-.7648-.2864-1.1044-.0492c-.6889.4813-1.527.7636-2.4311.7636-.9042 0-1.7423-.2823-2.43122-.7636z"/><path clip-rule="evenodd" d="m21.8645 13.65c.0756-.4553.0314-.9064-.1043-1.3325-.1764-.5533-.5072-1.0645-.931-1.4883l-7.6584-7.65839c-.4238-.42379-.935-.75464-1.4883-.93097-.0533-.01698-.1069-.03252-.1609-.04657-.3781-.09839-.7732-.12393-1.1716-.05779-.061.01013-.1218.02081-.1825.03204-4.64766.86073-8.1675 4.93555-8.1675 9.83248 0 5.5228 4.47715 10 10 10 4.8969 0 8.9717-3.5198 9.8325-8.1675.0112-.0607.0219-.1215.032-.1825zm-18.3645-1.65c0-3.91363 2.64622-7.21172 6.24701-8.19858.12873-.03528.25299.06511.25299.19858 0 5.52285 4.4772 10 10 10 .1335 0 .2339.1243.1986.253-.9869 3.6008-4.285 6.247-8.1986 6.247-4.69442 0-8.5-3.8056-8.5-8.5zm16.5.5c.1011 0 .1641-.1064.1094-.1914-.0909-.1412-.204-.2819-.3409-.4188l-7.6584-7.65833c-.1368-.13687-.2775-.25-.4187-.34083-.085-.0547-.1914.00828-.1914.10936 0 4.69442 3.8056 8.5 8.5 8.5z" fill-rule="evenodd"/></g></svg>`,

  // send.svg (viewBox="0 0 24 24")
  send: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m11.6192 17.1568-6.61756 2.7249c-.54765.2255-1.09216-.3287-.85708-.8723l7.15694-16.55047c.1205-.27858.395-.45893.6985-.45893s.578.18035.6984.45893l7.157 16.55047c.2351.5436-.3094 1.0978-.8571.8723l-6.6176-2.7249c-.2439-.1005-.5176-.1004-.7615 0zm-.3692-1.675c0 .1278-.0837.2393-.2019.288l-3.56877 1.4695c-.41489.1708-.82739-.249-.64931-.6608l3.94048-9.11243c.1077-.24912.4795-.17219.4795.09923z" fill="currentColor" fill-rule="evenodd"/></svg>`,

  // chevron-down.svg — for category toggle (18px)
  chevronDown: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  // add-contact.svg (viewBox="0 0 24 24") — invite contacts button (ColumnHeaderPanel.qml:44)
  addContact: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path clip-rule="evenodd" d="m17 8c0 2.7614-2.2386 5-5 5-2.76142 0-5-2.2386-5-5 0-2.76142 2.23858-5 5-5 2.7614 0 5 2.23858 5 5zm-1.5 0c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5z" fill-rule="evenodd"/><path d="m12.1099 17.5007c.4189.0053.7898-.2992.8246-.7168.034-.4077-.2656-.7701-.6746-.7806-.0864-.0022-.1731-.0033-.2601-.0033-3.04048 0-5.76406 1.357-7.59813 3.4984-.23986.28-.20848.6949.05225.9556.3238.3239.85982.2772 1.16232-.0666 1.55771-1.7703 3.84021-2.8874 6.38356-2.8874.0368 0 .0734.0002.1101.0007z"/><path d="m15.25 16.75c0-.4142.3358-.75.75-.75h1.25c.2761 0 .5-.2239.5-.5v-1.25c0-.4142.3358-.75.75-.75s.75.3358.75.75v1.25c0 .2761.2239.5.5.5h1.25c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-1.25c-.2761 0-.5.2239-.5.5v1.25c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75v-1.25c0-.2761-.2239-.5-.5-.5h-1.25c-.4142 0-.75-.3358-.75-.75z"/></g></svg>`,

  // pin.svg (viewBox="0 0 24 24") — for chat header pin count (StatusChatInfoButton.qml:188)
  pinHeader: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m14.8956 7.28455c0-.82843-.6482-1.67563-1.4478-1.89228-.7996-.21664-1.4478.2793-1.4478 1.10773s.6482 1.67563 1.4478 1.89227c.7996.21665 1.4478-.2793 1.4478-1.10772z"/><path clip-rule="evenodd" d="m12 2c-3.31371 0-6 2.68629-6 6 0 2.9077 2.06835 5.3323 4.814 5.8828.2473.0496.436.2601.436.5123v6.6049c0 .4142.3358.75.75.75s.75-.3358.75-.75v-6.6049c0-.2522.1887-.4627.436-.5123 2.7457-.5505 4.814-2.9751 4.814-5.8828 0-3.31371-2.6863-6-6-6zm-4.5 6c0 2.4853 2.01472 4.5 4.5 4.5 2.4853 0 4.5-2.0147 4.5-4.5 0-2.48528-2.0147-4.5-4.5-4.5-2.48528 0-4.5 2.01472-4.5 4.5z" fill-rule="evenodd"/></g></svg>`,
}

export function renderCommunityChannel(view, ver) {
  const revamp = ver === 'revamp'
  const p = new URLSearchParams(location.search)
  // desktop only (epic §1): reply-in-thread opens the thread as a side panel replacing Members
  const tpanel = revamp && view === 'desktop' ? p.get('tpanel') : null
  const mobile = view === 'mobile'
  const chat = revamp ? chatCtx(p) : 'community'   // community | dm | group (#21931 DM/group demo)
  const ctx = CHATS[chat]
  const nav = renderNav(revamp)
  const left = chat === 'community' ? renderLeftPanel(revamp) : renderMessengerLeft(chat)
  // mobile portrait: back from a channel shows the channel + thread list full-screen (StatusSectionLayoutPortrait)
  if (mobile && p.get('mlist') === '1') {
    return { nav, left, center: `<div class="mobile-list">${left}</div>`, right: null }
  }
  const center = renderCenterPanel(revamp, !!tpanel, mobile, chat)
  const right = tpanel ? renderThreadPanel(p) : (ctx.members ? renderRightPanel() : null)
  return { nav, left, center, right }
}

// desktop thread side-panel — reuses the full thread view/create renderers inside shell__right
function renderThreadPanel(p) {
  const surface = p.get('surface') || 'channel'
  const tpanel = p.get('tpanel')
  let inner
  if (tpanel === 'create') inner = renderCreate(surface, p.get('tparent'), { panel: true })
  else {
    const t = store.getThread(tpanel)
    inner = t ? renderThread(t, { copy: p.get('copy') === '1', panel: true }) : '<div class="thread-empty">Thread not found.</div>'
  }
  return `<div class="thread-panel">${inner}</div>`
}

// Members sidebar — UserListPanel.qml (title + onlineStatus sections + StatusMemberListItem rows).
// Member row: 32px avatar (colorId bg + online-status dot), name Font.Medium primaryTextFontSize / directColor4,
// owner → crown; section header secondaryTextFontSize / baseColor1.
function member({ name, initial, color, online, owner }) {
  return `
    <div class="member-item">
      <div class="member-item__avatar" style="background:${color}">${initial}<span class="member-item__status member-item__status--${online ? 'online' : 'offline'}"></span></div>
      <span class="member-item__name">${name}</span>
      ${owner ? `<span class="member-item__crown" title="Owner">${MEMBER_ICONS.crown}</span>` : ''}
    </div>`
}
function renderRightPanel() {
  const online = [
    { name: 'You', initial: 'A', color: '#4360DF', online: true, owner: true },
    { name: 'Elena', initial: 'E', color: '#D37EF4', online: true },
    { name: 'Marcus', initial: 'M', color: '#26A69A', online: true },
    { name: 'carmen.eth', initial: 'C', color: '#887AF9', online: true },
  ]
  const offline = [
    { name: 'Kai', initial: 'K', color: '#FE8F59', online: false },
    { name: 'Dana', initial: 'D', color: '#2A799B', online: false },
    { name: 'Sam', initial: 'S', color: '#C4A052', online: false },
  ]
  return `
    <div class="member-list">
      <div class="member-list__header">
        <span class="member-list__title">Members</span>
        <button class="member-list__search" title="Search members">${CHANNEL_ICONS.search}</button>
      </div>
      <div class="member-list__section">Online — ${online.length}</div>
      ${online.map(member).join('')}
      <div class="member-list__section">Offline — ${offline.length}</div>
      ${offline.map(member).join('')}
    </div>`
}
const MEMBER_ICONS = {
  // crown.svg — owner badge (lifted verbatim from StatusQ assets, recoloured → currentColor)
  crown: `<svg viewBox="0 0 20 20" fill="none"><g stroke="currentColor"><path d="m15 13 1-6.5-1.1272.75147c-1.6774 1.11826-3.9583.29684-4.5376-1.6341l-.3352-1.11737-.33521 1.11737c-.57928 1.93094-2.8602 2.75236-4.53758 1.6341l-1.12721-.75147 1 6.5m10 0h-10m10 0v3h-10v-3" stroke-linejoin="round"/><g fill="currentColor"><circle cx="10" cy="4.5" r="1.5"/><circle cx="16" cy="6.5" r="1.5"/><circle cx="4" cy="6.5" r="1.5"/></g></g></svg>`,
}

// ?actions=1 → force-show the hover quick-actions toolbar on a couple of messages (screenshot/deep-link demo).
// Shows both variants: a non-own message (react/reply/pin/more) and an own "You" message (+edit).
export function bindCommunityChannel(view, ver) {
  const p = new URLSearchParams(location.search)
  if (p.get('actions') === '1') {
    const msgs = document.querySelectorAll('.shell__center .message, .shell__mobile-content .message')
    ;[1, 2].forEach(i => msgs[i] && msgs[i].classList.add('message--peek'))
  }
  // composer: the style button toggles the formatting group (StatusChatInputToolBar state machine)
  const ci = document.querySelector('.chat-input')
  const styleBtn = document.querySelector('[data-style-toggle]')
  if (styleBtn && ci) styleBtn.addEventListener('click', () => {
    const on = ci.classList.toggle('chat-input--formatting')
    styleBtn.classList.toggle('checked', on)
  })
  // deep-links: ?fmt=1 opens the formatting group, ?reply=1 shows the reply preview
  if (ci && p.get('fmt') === '1') { ci.classList.add('chat-input--formatting'); styleBtn && styleBtn.classList.add('checked') }
  if (ci && p.get('reply') === '1') ci.classList.add('chat-input--replying')

  // ---- Threads (epic #21090) in-chat affordances — revamp only; version=current untouched ----
  if (ver === 'revamp') bindThreadAffordances(p, view)

  // ---- mobile portrait nav: channel ⇄ channel/thread list (StatusSectionLayoutPortrait) ----
  if (view === 'mobile') {
    if (p.get('mlist') === '1') {
      // in the list: tapping a channel opens its chat (thread rows are wired in bindThreadAffordances)
      document.querySelectorAll('.shell__mobile-content .channel-item').forEach(el => el.addEventListener('click', () => {
        const q = new URLSearchParams(location.search); q.delete('mlist'); location.search = q.toString()
      }))
    } else {
      // in a channel: the header back arrow → the channel + thread list
      document.querySelector('.chat-header__back')?.addEventListener('click', () => {
        const q = new URLSearchParams(location.search); q.set('mlist', '1'); q.delete('tpanel'); location.search = q.toString()
      })
    }
  }
}

// Thread glyph — reply-in-thread bubble (net-new; Status line style)
const THREAD_GLYPH = `<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a8.38 8.38 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13.5 9.5 11 12l2.5 2.5M11 12h3.2a2.3 2.3 0 0 1 0 4.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
// lock.svg (Status asset) — closed-thread glyph, so a closed card/row reads differently from an open one
const LOCK_GLYPH = `<svg viewBox="0 0 10 12" fill="none"><path clip-rule="evenodd" d="m2 5.5v-1.74359c0-1.78315 1.32593-3.25641 3-3.25641s3 1.47326 3 3.25641v1.74359h.5c.82843 0 1.5.67157 1.5 1.5v3c0 .8284-.67157 1.5-1.5 1.5h-7c-.828427 0-1.5-.6716-1.5-1.5v-3c0-.82843.671573-1.5 1.5-1.5zm1.38462 0h3.23076v-1.74359c0-1.04908-.74044-1.87179-1.61538-1.87179s-1.61538.82271-1.61538 1.87179z" fill="currentColor" fill-rule="evenodd"/></svg>`
// trash / bin — for the "X deleted this thread" tombstone (Status delete_message pattern)
const TRASH_GLYPH = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M10 4h4M6 7l1 12.5A2 2 0 0 0 9 21.4h6a2 2 0 0 0 2-1.9L18 7M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
// "#←" — a channel-hash with a back arrow, for the thread reply "Also sent to the channel" tag
const ALSO_SENT_GLYPH = `<svg viewBox="0 0 20 12" fill="none"><path d="M4 1.5 3 10.5M8 1.5 7 10.5M1.8 4.3h7M1.2 7.7h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M19 6h-5m0 0 2.2-2.2M14 6l2.2 2.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
// extra menu icons — real Status assets (hide.svg / copy.svg / delete.svg), recoloured → currentColor
const MENU_EXTRA = {
  // hide.svg — used for "Mark as unread" (eye-off)
  unread: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path clip-rule="evenodd" d="m4.96615 7.47938c.24656.19177.25853.56004.03317.77634-1.31988 1.26686-2.25114 2.57658-2.6983 3.26098-.19368.2964-.19368.6701 0 .9665 1.03483 1.5838 4.66222 6.5168 9.69898 6.5168 1.9068 0 3.6116-.707 5.0502-1.6716.1836-.1231.426-.119.6005.0168l2.8889 2.2468c.3269.2544.7981.1954 1.0524-.1315.2544-.327.1955-.7982-.1315-1.0525l-18.00001-13.99998c-.32696-.2543-.79817-.1954-1.05247.13156s-.1954.79817.13156 1.05247zm10.59515 8.24062c.2708.2107.2536.6254-.0458.7928-1.0808.6044-2.2619.9872-3.5155.9872-2.01721 0-3.84676-.9912-5.37269-2.3022-.80303-.69-1.48262-1.4354-2.0153-2.0927-.5236-.6461-.5236-1.5642 0-2.2103.53268-.6573 1.21227-1.40271 2.0153-2.09264.01094-.0094.02699-.00978.03837-.00092l1.44501 1.1239c.18957.14746.24422.40776.15755.63166-.17323.4477-.26824.9344-.26824 1.4432 0 2.2091 1.79086 4 4 4 .8635 0 1.6631-.2736 2.3168-.7389.1956-.1392.4613-.1502.6508-.0028zm-6.05263-3.9298c.02795-.3365.41902-.4518.68553-.2445l2.6906 2.0927c.2665.2072.2512.6148-.0678.725-.256.0885-.5309.1366-.817.1366-1.3807 0-2.5-1.1193-2.5-2.5 0-.0707.00293-.1406.00867-.2098z" fill-rule="evenodd"/><path d="m8.85704 6.41675c-.29108-.2264-.24414-.67767.09853-.81391.94161-.37438 1.96033-.60284 3.04423-.60284 5.0368 0 8.6642 4.93293 9.699 6.5167.1937.2965.1937.6701 0 .9666-.3096.4738-.8512 1.2474-1.5932 2.0989-.1712.1965-.4659.221-.6717.061l-.3932-.3058c-.2315-.1801-.2585-.5195-.0658-.7407.146-.1677.2838-.3322.4129-.4915.5236-.6462.5236-1.5642 0-2.2104-.5326-.6573-1.2122-1.40268-2.0153-2.09261-1.5259-1.31103-3.3554-2.30219-5.3727-2.30219-.7486 0-1.4713.13648-2.16224.37515-.16605.05736-.35074.03143-.48942-.07643z"/><path d="m15.8613 10.9529c.1091.4032-.346.6425-.6756.3861l-1.4018-1.0903c-.1565-.1593-.3341-.29781-.5283-.41087l-1.4504-1.12808c-.3093-.24052-.1972-.70975.1946-.70975 1.8468 0 3.4013 1.25163 3.8615 2.9529z"/></g></svg>`,
  // copy.svg
  copy: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m6.25 10.5c.41421 0 .75-.3358.75-.75 0-.41421-.33579-.75-.75-.75h-.25c-2.20914 0-4 1.7909-4 4v5c0 2.2091 1.79086 4 4 4h5c2.2091 0 4-1.7909 4-4v-.25c0-.4142-.3358-.75-.75-.75s-.75.3358-.75.75v.25c0 1.3807-1.1193 2.5-2.5 2.5h-5c-1.38071 0-2.5-1.1193-2.5-2.5v-5c0-1.3807 1.11929-2.5 2.5-2.5z"/><path clip-rule="evenodd" d="m9 6c0-2.20914 1.7909-4 4-4h5c2.2091 0 4 1.79086 4 4v5c0 2.2091-1.7909 4-4 4h-5c-2.2091 0-4-1.7909-4-4zm4-2.5h5c1.3807 0 2.5 1.11929 2.5 2.5v5c0 1.3807-1.1193 2.5-2.5 2.5h-5c-1.3807 0-2.5-1.1193-2.5-2.5v-5c0-1.38071 1.1193-2.5 2.5-2.5z" fill-rule="evenodd"/></g></svg>`,
  // delete.svg
  del: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m9.39286 2.25c-1.18347 0-2.14286.95939-2.14286 2.14286 0 .61145-.49568 1.10714-1.10714 1.10714h-3.14286c-.41421 0-.75.33579-.75.75s.33579.75.75.75h.73876c.25288 0 .46594.1888.49637.43983l1.33836 11.04147c.24343 2.0083 1.94796 3.5187 3.97094 3.5187h4.91117c2.023 0 3.7275-1.5104 3.9709-3.5187l1.3384-11.04147c.0304-.25103.2435-.43983.4963-.43983h.7388c.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75h-3.1429c-.6114 0-1.1071-.49568-1.1071-1.10714 0-1.18347-.9594-2.14286-2.1429-2.14286zm5.31594 3.25c.3663 0 .6146-.38913.5652-.75214-.0158-.11608-.024-.23459-.024-.355 0-.35504-.2878-.64286-.6429-.64286h-5.21424c-.35504 0-.64286.28782-.64286.64286 0 .12041-.00816.23892-.02397.355-.04942.36301.19882.75214.56518.75214zm3.1483 1.5c.2393 0 .4247.20925.3959.44679l-1.3156 10.85401c-.1521 1.2552-1.2175 2.1992-2.4818 2.1992h-4.91117c-1.26436 0-2.32969-.944-2.48184-2.1992l-1.31564-10.85401c-.02879-.23754.15663-.44679.39591-.44679z" fill="currentColor" fill-rule="evenodd"/></svg>`,
}

// quick-emoji-reactions bar atop the context menu (Figma frame 1)
function reactionsBar() {
  const emojis = ['👋', '🔨', '🚀', '🎃', '🎯', '🚗', '😀']
  return `<div class="msg-cmenu__reactions" role="group" aria-label="Quick reactions">${emojis.map(e => `<button class="msg-cmenu__react" aria-label="React ${e}">${e}</button>`).join('')}<button class="msg-cmenu__react msg-cmenu__react--more" aria-label="More reactions">+</button></div>`
}

// message context menu (Figma frame 1) — reactions bar + item list. Gated to source
// conventions (MessageContextMenuView.qml): Edit/Delete only on own messages; source order
// Reply → Edit → Copy → Pin → Mark-unread → Delete, with "Reply in thread" as the epic entry point.
function msgContextMenu(isSelf) {
  const item = (icon, label, cls = '', extra = '') => `<button class="msg-cmenu__item${cls}" role="menuitem" ${extra}>${icon}<span>${label}</span></button>`
  return `
    <div class="msg-cmenu" role="menu" aria-label="Message actions">
      ${reactionsBar()}
      <div class="msg-cmenu__items">
        ${item(QUICK_ICONS.reply, 'Reply')}
        ${item(THREAD_GLYPH, 'Reply in thread', ' msg-cmenu__item--accent', 'data-reply-in-thread')}
        ${isSelf ? item(QUICK_ICONS.edit, 'Edit') : ''}
        ${item(MENU_EXTRA.copy, 'Copy message')}
        ${item(QUICK_ICONS.pin, 'Pin')}
        ${item(MENU_EXTRA.unread, 'Mark as unread')}
        ${isSelf ? item(MENU_EXTRA.del, 'Delete', ' msg-cmenu__item--danger') : ''}
      </div>
    </div>`
}

// relative "17h ago" stamp for the in-chat last-message line (#21932 §2)
function relAgo(ts) {
  const d = Date.now() - ts, m = 60000, h = 60 * m, day = 24 * h
  if (d < m) return 'just now'
  if (d < h) return `${Math.floor(d / m)}m ago`
  if (d < day) return `${Math.floor(d / h)}h ago`
  if (d < 7 * day) return `${Math.floor(d / day)}d ago`
  return `${Math.floor(d / (7 * day))}w ago`
}

// in-chat thread card under a root message (epic §4 / #21932) — data-driven from the store:
// title · N replies · participant avatars · new/unread dot · last-message line · closed & deleted variants.
function threadCard(t) {
  // deleted thread → tombstone showing WHO deleted it (Status delete-message pattern) — #21932 §4
  if (t.deleted) {
    const db = t.deletedBy || { name: 'Someone', initial: '?', color: '#7A7A7A' }
    return `
    <div class="thread-card thread-card--deleted">
      <span class="thread-card__trash">${TRASH_GLYPH}</span>
      <span class="thread-card__del-ava" style="background:${db.color}">${db.initial}</span>
      <span class="thread-card__del-text"><strong>${db.name}</strong> deleted this thread</span>
      ${t.deletedAtLabel ? `<span class="thread-card__del-time">${t.deletedAtLabel}</span>` : ''}
    </div>`
  }
  const people = store.participants(t)
  const stack = `<span class="thread-ava-stack">${people.slice(0, 4).map((p, i) => `<span class="thread-ava" style="background:${p.c};z-index:${people.length - i}">${p.i}</span>`).join('')}${people.length > 4 ? `<span class="thread-ava thread-ava--more">+${people.length - 4}</span>` : ''}</span>`
  const closed = t.closed
  // last-message preview: sender avatar + name + text + "17h ago" (#21932 §2e)
  const lm = t.messages[t.messages.length - 1]
  const last = lm ? `
        <span class="thread-card__last">
          <span class="thread-card__last-ava" style="background:${lm.color || '#4360DF'}">${lm.initial || '?'}</span>
          <span class="thread-card__last-name">${lm.name}</span>
          <span class="thread-card__last-text">${lm.text}</span>
          <span class="thread-card__last-time">${relAgo(lm.ts)}</span>
        </span>` : ''
  // top-right badge: closed → reply count + lock icon; open+unread → new-message counter
  const badge = closed
    ? `<span class="thread-card__tr"><span class="thread-card__count thread-card__count--muted">${t.messages.length}</span><span class="thread-card__lock" title="Closed">${LOCK_GLYPH}</span></span>`
    : (t.followed && t.unread ? `<span class="thread-card__count" title="New messages">${t.newCount || 1}</span>` : '')
  return `
    <button class="thread-card${closed ? ' thread-card--closed' : ''}" data-open-thread="${t.id}" data-surface="${t.surface}">
      <span class="thread-card__icon">${THREAD_GLYPH}</span>
      <span class="thread-card__main">
        <span class="thread-card__title">${t.title}</span>
        <span class="thread-card__meta">${stack}<span class="thread-card__replies">${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}</span></span>
        ${last}
      </span>
      ${badge}
    </button>`
}

function goToThread(id, surface, from = 'chat') {
  const q = new URLSearchParams(location.search)
  q.set('screen', 'threads'); q.set('tview', 'thread'); q.set('t', id); q.set('surface', surface || 'channel'); q.set('from', from)
  q.delete('thread'); q.delete('menu'); q.delete('qa'); q.delete('mlist')
  location.search = q.toString()
}
function goToCreate(parentMsgId, parentMsg, surface) {
  if (parentMsgId && parentMsg) store.setPendingParent(parentMsgId, parentMsg)
  const q = new URLSearchParams(location.search)
  q.set('screen', 'threads'); q.set('tview', 'create'); q.set('surface', surface || 'channel'); q.set('from', 'chat')
  if (parentMsgId) q.set('parent', parentMsgId)
  q.delete('menu'); q.delete('qa'); q.delete('thread')
  location.search = q.toString()
}

// ---- desktop thread side-panel (epic §1) — open in place, no full-page navigation ----
const isDesktop = () => !document.querySelector('.shell--mobile')
const rerender = () => window.dispatchEvent(new Event('app:rerender'))

// open a thread (or the create flow) in the right-hand panel, replacing Members. View-only URL state.
function openThreadPanel(spec) {
  const u = new URL(location.href)
  u.searchParams.delete('copy')
  if (spec.create) {
    if (spec.parentMsgId && spec.parentMsg) store.setPendingParent(spec.parentMsgId, spec.parentMsg)
    u.searchParams.set('tpanel', 'create')
    spec.parentMsgId ? u.searchParams.set('tparent', spec.parentMsgId) : u.searchParams.delete('tparent')
  } else {
    u.searchParams.set('tpanel', spec.threadId)
    u.searchParams.delete('tparent')
  }
  u.searchParams.set('surface', spec.surface || 'channel')
  history.replaceState(null, '', u)
  rerender()
}
function closeThreadPanel() {
  const u = new URL(location.href)
  ;['tpanel', 'tparent', 'copy'].forEach(k => u.searchParams.delete(k))
  history.replaceState(null, '', u)
  rerender()
}

// wire the open panel: close affordances, composer send (create/reply), mute/more/edit, focus the input
function bindThreadPanel(p) {
  const panel = document.querySelector('.shell__right .thread-panel')
  if (!panel) return
  const surface = p.get('surface') || 'channel'
  const isCreate = p.get('tpanel') === 'create'
  const threadId = isCreate ? null : p.get('tpanel')

  // header back arrow closes the panel (Escape too); Members button is wired in bindThreadAffordances
  panel.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', closeThreadPanel))

  // drain any queued toast (unfollow/mute/close/delete confirmations) into the panel
  const queued = store.takeToast()
  if (queued) floatToast(panel, queued)

  // "Send copy" checkbox — persist to the URL the renderer reads, so a re-render keeps the state
  panel.querySelector('[data-copy]')?.addEventListener('change', function () {
    const on = this.checked
    try { const u = new URL(location.href); on ? u.searchParams.set('copy', '1') : u.searchParams.delete('copy'); history.replaceState(null, '', u) } catch {}
  })
  // the row is revealed via :focus-within; pressing the (non-focusable) label text would blur the
  // textarea on mousedown → row hides mid-click → toggle lost. Keep the textarea focused and drive
  // the toggle ourselves so a click anywhere on the row reliably flips the box.
  const copyRow = panel.querySelector('.thread-copy--inline')
  if (copyRow) {
    copyRow.addEventListener('mousedown', (e) => e.preventDefault())
    copyRow.addEventListener('click', function (e) {
      const chk = this.querySelector('[data-copy]'); if (!chk || e.target === chk) return  // keyboard Space on the box is native-handled
      e.preventDefault()
      chk.checked = !chk.checked
      chk.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  if (isCreate) {
    bindComposerSend(panel, () => {
      const nameEl = panel.querySelector('[data-thread-name]')
      const inputEl = panel.querySelector('[data-thread-input]')
      const text = (inputEl?.value || '').trim(); if (!text) { inputEl?.focus(); return }
      const parentMsgId = p.get('tparent')
      const t = store.createThread({ surface, parentMsgId, parentMsg: resolveParent(surface, parentMsgId), title: nameEl?.value || '', firstMessage: text })
      const u = new URL(location.href); u.searchParams.set('tpanel', t.id); u.searchParams.delete('tparent'); history.replaceState(null, '', u)
      rerender() // swap the create panel for the freshly-created thread
    })
  } else if (threadId) {
    const t0 = store.getThread(threadId)
    if (t0 && t0.unread && !t0.muted) store.markRead(threadId, { silent: true })
    bindComposerSend(panel, () => {
      const inputEl = panel.querySelector('[data-thread-input]')
      const text = (inputEl?.value || '').trim(); if (!text) return
      const copyOn = !!panel.querySelector('[data-copy]')?.checked
      store.postReply(threadId, text, { copyToParent: copyOn }) // emit → re-render updates the panel
      requestAnimationFrame(() => {
        document.querySelector('.shell__right [data-thread-input]')?.focus()
        if (copyOn) floatToast(document.querySelector('.shell__right .thread-panel'), 'Reply also posted to ' + (SURFACES[surface]?.label || 'channel'))
      })
    })
    panel.querySelector('[data-mute]')?.addEventListener('click', () => { const t = store.getThread(threadId); store.setMuted(threadId, !t.muted) })
    panel.querySelector('[data-thread-more]')?.addEventListener('click', (e) => { e.stopPropagation(); openThreadMenu(panel, threadId, e.currentTarget) })
    bindInlineEdit(panel, threadId)
  }

  // spec: move focus to the thread input. Focus synchronously (the panel DOM is already in place at
  // bind time) with a rAF fallback — synchronous is reliable even when the tab is backgrounded.
  const focusTarget = () => panel.querySelector('[data-thread-input]') || panel.querySelector('[data-thread-name]')
  focusTarget()?.focus()
  requestAnimationFrame(() => { if (document.activeElement !== focusTarget()) focusTarget()?.focus() })
}

// open the message context menu on a specific message (real trigger — from the hover "More"
// quick-action or the deep-link). Gates Edit/Delete on message ownership.
function openContextMenu(msgEl) {
  document.querySelectorAll('.message--menu-open').forEach(m => { m.classList.remove('message--menu-open'); m.querySelector('.msg-cmenu')?.remove() })
  const isSelf = msgEl.querySelector('.message__sender')?.textContent === 'You'
  msgEl.classList.add('message--menu-open')
  msgEl.insertAdjacentHTML('beforeend', msgContextMenu(isSelf))
  const menu = msgEl.querySelector('.msg-cmenu')
  const surface = 'channel'
  const parentMsgId = msgEl.dataset.msgId
  const parentMsg = readMsg(msgEl)
  menu.querySelector('[data-reply-in-thread]')?.addEventListener('click', () => {
    const existing = parentMsgId ? store.threadForParent(parentMsgId, surface) : null
    if (isDesktop()) {
      close()  // dismiss the context menu + its listeners before the panel re-render
      if (existing) openThreadPanel({ threadId: existing.id, surface })
      else openThreadPanel({ create: true, parentMsgId, parentMsg, surface })
    } else {
      if (existing) goToThread(existing.id, surface)
      else goToCreate(parentMsgId, parentMsg, surface)
    }
  })
  menu.querySelector('.msg-cmenu__item')?.focus()
  const trigger = msgEl.querySelector('.message__qa-btn[aria-label="More"]')
  const close = () => { menu.remove(); msgEl.classList.remove('message--menu-open'); document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  const onDown = (e) => { if (!menu.contains(e.target)) close() }
  // Escape returns focus to the invoking More button (WAI-ARIA menu-button) — no keyboard trap
  const onKey = (e) => { if (e.key === 'Escape') { close(); trigger?.focus() } }
  setTimeout(() => { document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey) }, 0)
}

// reconstruct a msg() arg tuple from a rendered message row (for the create flow's pinned parent)
function readMsg(msgEl) {
  const name = msgEl.querySelector('.message__sender')?.textContent || 'Someone'
  const initial = msgEl.querySelector('.message__avatar')?.textContent || name.charAt(0)
  const color = msgEl.querySelector('.message__avatar')?.style.background || '#4360DF'
  const time = msgEl.querySelector('.message__time')?.textContent || ''
  const text = msgEl.querySelector('.message__text')?.textContent || ''
  return [name, initial, color, time, text, {}]
}

// community "…" options menu (left header) — Invite member + Hide/Show threads (#21931 §6.2)
function openCommunityMenu(anchor) {
  const root = anchor.closest('.shell__left') || document.querySelector('.shell__left') || anchor.parentElement
  root.querySelector('.community-more-menu')?.remove()
  const hidden = areThreadsHidden()
  const menu = document.createElement('div')
  menu.className = 'msg-cmenu community-more-menu'
  menu.setAttribute('role', 'menu')
  const item = (icon, label, act) => `<button class="msg-cmenu__item" role="menuitem" data-act="${act}">${icon}<span>${label}</span></button>`
  menu.innerHTML =
    item(CHANNEL_ICONS.addContact, 'Invite member', 'invite') +
    item(THREAD_GLYPH, hidden ? 'Show threads' : 'Hide threads', 'toggle-threads')
  const rect = anchor.getBoundingClientRect(), rootRect = root.getBoundingClientRect()
  menu.style.position = 'absolute'; menu.style.top = (rect.bottom - rootRect.top + 4) + 'px'
  menu.style.right = (rootRect.right - rect.right) + 'px'; menu.style.left = 'auto'
  root.style.position = 'relative'
  root.appendChild(menu)
  const close = () => { menu.remove(); document.removeEventListener('mousedown', dismiss); document.removeEventListener('keydown', onKey) }
  const acts = { invite: () => {}, 'toggle-threads': () => { setThreadsHidden(!hidden); rerender() } }
  menu.querySelectorAll('.msg-cmenu__item').forEach(btn => btn.addEventListener('click', () => { acts[btn.dataset.act]?.(); close() }))
  menu.querySelector('.msg-cmenu__item')?.focus()
  const dismiss = (e) => { if (!menu.contains(e.target) && e.target !== anchor) close() }
  const onKey = (e) => { if (e.key === 'Escape') { close(); anchor.focus() } }
  setTimeout(() => { document.addEventListener('mousedown', dismiss); document.addEventListener('keydown', onKey) }, 0)
}

function bindThreadAffordances(p, view) {
  const scope = document.querySelector('.shell__center, .shell__mobile-content')
  if (!scope) return
  // community "…" menu: Invite member / Hide-Show threads
  document.querySelector('[data-community-more]')?.addEventListener('click', (e) => { e.stopPropagation(); openCommunityMenu(e.currentTarget) })
  // switch chats in the DM/group demo (left messenger list + "back to community")
  document.querySelectorAll('[data-open-chat]').forEach(el => el.addEventListener('click', () => {
    const u = new URL(location.href); const c = el.dataset.openChat
    c === 'community' ? u.searchParams.delete('chat') : u.searchParams.set('chat', c)
    u.searchParams.delete('tpanel'); u.searchParams.delete('copy'); location.search = u.searchParams.toString()
  }))
  const surface = CHATS[chatCtx(p)].surface   // channel | dm | group
  const desktop = view === 'desktop'
  const msgs = scope.querySelectorAll('.messages .message[data-msg-id]')
  // on desktop, opening an existing thread shows it in the side panel; mobile keeps the full-screen nav
  const openThread = (id, s) => desktop ? openThreadPanel({ threadId: id, surface: s || surface }) : goToThread(id, s || surface)

  // in-chat thread cards — data-driven: a card under every message that has a thread (epic §4/§20)
  msgs.forEach(mEl => {
    const t = store.threadForParentAny(mEl.dataset.msgId, surface)
    if (t) mEl.insertAdjacentHTML('afterend', threadCard(t))
  })

  // connector spine: line from the parent message's avatar down to the centre of its thread card (#21932)
  const drawSpines = () => scope.querySelectorAll('.thread-card').forEach(card => {
    const av = card.previousElementSibling?.querySelector('.message__avatar')
    if (!av) return
    card.querySelector('.thread-card__spine')?.remove()
    const cr = card.getBoundingClientRect(), ar = av.getBoundingClientRect()
    const x0 = ar.left + ar.width / 2 - cr.left   // avatar centre, relative to card
    const y0 = ar.bottom - cr.top                 // avatar bottom, relative to card
    const w = -x0, h = cr.height / 2 - y0, R = Math.min(10, w, h)   // elbow into card left-middle
    if (w <= 0 || h <= 0) return
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'thread-card__spine')
    svg.setAttribute('width', w); svg.setAttribute('height', h)
    svg.style.cssText = `position:absolute;left:${x0}px;top:${y0}px;overflow:visible;pointer-events:none`
    svg.innerHTML = `<path d="M0 0 V${h - R} Q0 ${h} ${R} ${h} H${w}" fill="none" stroke-width="2" stroke-linecap="round"/>`
    card.style.position = 'relative'
    card.appendChild(svg)
  })
  drawSpines()
  window.addEventListener('resize', drawSpines)

  // real trigger: the hover quick-actions "More" opens the context menu for THAT message (epic §1.1)
  scope.querySelectorAll('.messages .message').forEach(mEl => {
    const moreBtn = mEl.querySelector('.message__qa-btn[aria-label="More"]')
    moreBtn?.addEventListener('click', (e) => { e.stopPropagation(); openContextMenu(mEl) })
  })

  // deep-link: ?menu=thread auto-opens the context menu on the first message (saved-state)
  if (p.get('menu') === 'thread' && msgs[0]) { msgs[0].classList.add('message--peek'); openContextMenu(msgs[0]) }
  // deep-link: ?thread=card[-closed] highlights the seeded card (already rendered from the store)

  // composer thread icon (epic §1.2) — starts a NEW thread (→ create flow). Highlight on ?qa=thread
  const actions = scope.querySelector('.chat-input .chat-input__actions')
  if (actions) {
    const btn = document.createElement('button')
    btn.className = 'chat-input__btn chat-input__thread-btn' + (p.get('qa') === 'thread' ? ' checked' : '')
    btn.title = 'New thread'; btn.setAttribute('aria-label', 'Start a new thread'); btn.innerHTML = THREAD_GLYPH
    actions.insertBefore(btn, actions.firstChild)
    // desktop: open the create flow in the side panel; mobile: full-screen create
    btn.addEventListener('click', () => desktop ? openThreadPanel({ create: true, surface }) : goToCreate(null, null, surface))
  }

  // open a thread from its in-chat card (in the chat → back returns to the chat)
  scope.querySelectorAll('.thread-card[data-open-thread]').forEach(el => el.addEventListener('click', () => openThread(el.dataset.openThread, el.dataset.surface)))
  // "from thread <name>" tag on a copied-to-parent post → open that thread
  scope.querySelectorAll('.message__thread-ref-link[data-open-thread]').forEach(el => el.addEventListener('click', (e) => { e.stopPropagation(); openThread(el.dataset.openThread, el.dataset.surface) }))

  // channel-list thread rows (epic §22): desktop → side panel; mobile → full-screen thread that
  // returns to the mobile channel+thread list (from=mlist)
  document.querySelectorAll('.channel-thread[data-open-thread]').forEach(el => el.addEventListener('click', (e) => {
    e.stopPropagation()
    if (desktop) openThreadPanel({ threadId: el.dataset.openThread, surface: el.dataset.surface || surface })
    else goToThread(el.dataset.openThread, el.dataset.surface || surface, 'mlist')
  }))

  // ---- desktop thread side-panel: Members button closes it; bind + focus the open panel ----
  if (desktop) {
    const membersBtn = scope.querySelector('[data-members-btn]')
    if (membersBtn) membersBtn.addEventListener('click', () => { if (p.get('tpanel')) closeThreadPanel(); })
    if (p.get('tpanel')) bindThreadPanel(p)
  }
}

function renderNav(revamp) {
  // Activity Center badge — thread notifications (epic §5): count of followed, non-muted, unread threads
  const unread = revamp ? store.unreadCount() : 0
  const acBadge = revamp
    ? (unread > 0 ? `<span class="badge badge--count" title="${unread} thread notifications">${unread}</span>` : '')
    : '<span class="badge"></span>'
  // Uses ICONS from main nav — same as community-channel nav from earlier fix
  return `
    <div class="shell__nav">
      <div class="shell__nav-main">
        <div class="shell__nav-section">
          ${navBtn('Home', ICONS.home, false)}
          ${navBtn('Wallet', ICONS.wallet, false)}
          ${navBtn('Swap', ICONS.swap, false)}
          ${navBtn('Messages', ICONS.chat, false)}
          ${navBtn('Browser', ICONS.browser, false)}
          ${navBtn('Communities Portal', ICONS.communities, false)}
        </div>
        <div class="shell__nav-separator"></div>
        <div class="shell__nav-section shell__nav-section--grow">
          <button class="shell__nav-btn shell__nav-btn--community active" title="Status Community">
            <span style="font-size:14px;font-weight:700">S</span>
          </button>
        </div>
        <div class="shell__nav-separator"></div>
        <div class="shell__nav-section">
          ${navBtn('QR Scanner', ICONS.qr, false)}
          ${navBtn('Settings', ICONS.settings, false)}
        </div>
        <div class="shell__nav-avatar" title="Profile">
          A
          <span class="status-dot"></span>
        </div>
      </div>
      <div class="shell__nav-ac">
        <button class="shell__nav-btn" title="Activity Center">
          ${ICONS.notification}
          ${acBadge}
        </button>
      </div>
    </div>
  `
}

function navBtn(title, iconSvg, active) {
  return `<button class="shell__nav-btn${active ? ' active' : ''}" title="${title}">${iconSvg}</button>`
}

// "Hide threads" toggle (community "…" menu) — hides all thread rows from the channel list (#21931 §6.2)
const THREADS_HIDDEN_KEY = 'threadsHidden'
const areThreadsHidden = () => { try { return sessionStorage.getItem(THREADS_HIDDEN_KEY) === '1' } catch { return false } }
const setThreadsHidden = (v) => { try { v ? sessionStorage.setItem(THREADS_HIDDEN_KEY, '1') : sessionStorage.removeItem(THREADS_HIDDEN_KEY) } catch {} }

function renderLeftPanel(revamp) {
  // epic §6: active/followed channel threads surface under their parent channel in the left list,
  // with an unread indicator, honouring §6.1 disappear rules (closed / 1-week-inactive / keep-visible).
  // channelListThreads already applies §6.1 (surface/closed/1-week/keep-visible) + the #22 followed
  // rule — trust it; a secondary parentMsgId filter here wrongly dropped kept-visible/active threads.
  const genThreads = (revamp && !areThreadsHidden()) ? store.channelListThreads('channel') : []
  const threadRows = genThreads.map(t => `
    <button class="channel-thread${t.followed && t.unread ? ' unread' : ''}${t.closed ? ' closed' : ''}" data-open-thread="${t.id}" data-surface="channel" title="Open thread">
      <span class="channel-thread__glyph">${t.closed ? LOCK_GLYPH : THREAD_GLYPH}</span>
      <span class="channel-thread__name">${t.title}</span>
      ${t.keptVisible ? `<span class="channel-thread__pin" title="Kept visible">${CHANNEL_ICONS.pinHeader}</span>` : ''}
      ${t.followed && t.unread ? `<span class="channel-thread__count channel-thread__count--unread" title="New messages">${t.newCount || 1}</span>` : `<span class="channel-thread__count">${t.messages.length}</span>`}
    </button>`).join('')
  return `
    <div class="community-header">
      <div class="community-header__info">
        <div class="community-header__avatar">S</div>
        <div>
          <div class="community-header__name">Status Community</div>
          <div class="community-header__members">4,832 members</div>
        </div>
        <button class="community-header__invite-btn" title="Invite contacts">${CHANNEL_ICONS.addContact}</button>
        <button class="community-header__invite-btn" data-community-more title="Community options" aria-label="Community options" aria-haspopup="true">${CHANNEL_ICONS.more}</button>
      </div>
    </div>
    <div class="channel-list">
      ${category('General', [
        channelItem('general', { active: true, badge: 3 }),
        threadRows ? `<div class="channel-threads">${threadRows}</div>` : '',
        channelItem('introductions', {}),
        channelItem('announcements', {}),
      ])}
      ${category('Development', [
        channelItem('status-go', {}),
        channelItem('status-desktop', { badge: 12 }),
        channelItem('design', {}),
        channelItem('qa', {}),
      ])}
      ${category('Community', [
        channelItem('town-hall', {}),
        channelItem('random', { unread: true }),
        channelItem('governance', {}),
      ])}
    </div>
  `
}

function category(name, items) {
  return `
    <div class="channel-category">
      <div class="channel-category__title">
        <span class="channel-category__title-text">${name}</span>
        <span class="channel-category__chevron">${CHANNEL_ICONS.chevronDown}</span>
      </div>
      ${items.join('')}
    </div>
  `
}

function channelItem(name, { active = false, badge = 0, unread = false }) {
  const classes = ['channel-item']
  if (active) classes.push('active')
  if (unread || badge > 0) classes.push('unread')

  let badgeHtml = ''
  if (badge > 0) {
    badgeHtml = `<div class="channel-item__badge"><span class="channel-item__badge-dot">${badge}</span></div>`
  } else if (unread) {
    badgeHtml = `<div class="channel-item__badge"><span class="channel-item__badge-dot channel-item__badge-dot--unread"></span></div>`
  }

  // Layout: [identicon 24x24] [icon 16px "tiny/channel"] [name] [badge]
  return `
    <div class="${classes.join(' ')}">
      <div class="channel-item__identicon">${name.charAt(0).toUpperCase()}</div>
      <span class="channel-item__icon">${CHANNEL_ICONS.channel}</span>
      <span class="channel-item__name">${name}</span>
      ${badgeHtml}
    </div>
  `
}

// arrow-left.svg (lifted verbatim, #000 → currentColor) — the toolbar back button (StatusToolBar.qml:28)
const ARROW_LEFT = `<svg viewBox="0 0 24 24" fill="none"><path d="m10.5303 6.53033c.2929-.29289.2929-.76777 0-1.06066s-.76774-.29289-1.06063 0l-6 6.00003c-.29289.2929-.29289.7677 0 1.0606l6 6c.29289.2929.76773.2929 1.06063 0s.2929-.7677 0-1.0606l-3.86609-3.8661c-.31498-.315-.09189-.8536.35356-.8536h12.98223c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75h-12.98223c-.44546 0-.66854-.5386-.35356-.8536z" fill="currentColor"/></svg>`

// Mobile chat header — faithful recreation of the Status portrait toolbar (source-traced):
//   StatusToolBar (padding 8, background:null, no border) → [arrow-left back, leftMargin 20]
//   + ChatHeaderContentView RowLayout → StatusChatInfoButton (avatar 36 · title Medium+type-icon · subtitle)
//   + action buttons search·group-chat·more (StatusFlatRoundButton 44×44, icon 24, spacing 8).
// Sources: StatusToolBar.qml:20-40, ChatHeaderContentView.qml:17-129, StatusChatInfoButton.qml:24-208,
//   StatusFlatRoundButton.qml:15,114, theme.cpp:53-90 (halfPadding 8, smallPadding 10).
function chatHeaderAvatar(ctx) {
  return ctx.kind === 'community'
    ? `<div class="chat-header__avatar" style="background:var(--misc-color-5);font-size:18px;color:var(--indirect-color-1)">#</div>`
    : `<div class="chat-header__avatar" style="background:${ctx.avatarColor};font-size:16px;color:#fff">${ctx.avatar}</div>`
}
function chatHeaderTitleRow(ctx) {
  return ctx.channelIcon
    ? `<span class="chat-header__channel-icon">${CHANNEL_ICONS.channel}</span><span class="chat-header__title">${ctx.title}</span>`
    : `<span class="chat-header__title">${ctx.title}</span>`
}
function chatHeaderSubtitle(ctx, pinnedSuffix) {
  return ctx.kind === 'community'
    ? `<span class="chat-header__description">${ctx.subtitle}</span><span class="chat-header__separator"></span><span class="chat-header__pin-icon">${CHANNEL_ICONS.pinHeader}</span><span class="chat-header__pin-text">${ctx.pinned} pinned${pinnedSuffix}</span>`
    : `<span class="chat-header__description">${ctx.subtitle}</span>`
}
function chatHeaderMobile(ctx) {
  return `
    <div class="chat-header chat-header--mobile">
      <button class="chat-header__back" title="Back" aria-label="Back">${ARROW_LEFT}</button>
      <button class="chat-header__info chat-header__info--mobile">
        ${chatHeaderAvatar(ctx)}
        <div class="chat-header__text">
          <div class="chat-header__title-row">${chatHeaderTitleRow(ctx)}</div>
          <div class="chat-header__subtitle-row">${chatHeaderSubtitle(ctx, '')}</div>
        </div>
      </button>
      <div class="chat-header__actions chat-header__actions--mobile">
        <button class="chat-header__round-btn" title="Search" aria-label="Search">${CHANNEL_ICONS.search}</button>
        ${ctx.members ? `<button class="chat-header__round-btn" title="Members" aria-label="Members">${CHANNEL_ICONS.groupChat}</button>` : ''}
        <button class="chat-header__round-btn" title="More" aria-label="More">${CHANNEL_ICONS.more}</button>
      </div>
    </div>`
}

// ---- Chat surfaces for the threads demo: the community channel + a DM + a group (#21931/epic) ----
// Each supplies a header + a message set; the threaded message carries the store's parentMsgId
// (dm1 / g1) so bindThreadAffordances renders the in-chat thread card under it.
function communityMessages(copiedHtml) {
  return `
      <div class="messages__day-separator">Today</div>
      ${msg('Elena', 'E', '#D37EF4', '10:23', 'Just switched the whole design system to CSS tokens. Agents can now restyle screens by editing one file.', { id: 'cc-0', delivery: 'delivered', ensName: 'elena.eth', senderId: '0x04a2b9...c3f8e1' })}
      ${msg('Marcus', 'M', '#26A69A', '10:25', '11 themes built in one session — Nord, Dracula, Solarized, even a hacker green-on-black one. All live-swappable.', { id: 'cc-1', reactions: ['👍 3', '🔥 1'], delivery: 'delivered', senderId: '0x04d7e1...a92b05' })}
      ${msg('You', 'A', '#4360DF', '10:28', 'The best part is the auditor agent catches pixel mismatches before merge. No more "does this match the spec?" debates.', { id: 'cc-2', delivery: 'delivered' })}
      ${msg('Elena', 'E', '#D37EF4', '10:30', 'Exactly. The design system lives in the browser now, not in Figma. Agent-readable and human-visible at the same time.', { id: 'cc-3', delivery: 'delivered', ensName: 'elena.eth', senderId: '0x04a2b9...c3f8e1' })}
      ${msg('Elena', '', '', '', 'No export pipeline, no handoff docs. Change a token, see it everywhere instantly.', { id: 'cc-4', continued: true })}
      ${msg('Kai', 'K', '#FE8F59', '10:34', 'How long did the full pipeline take? QML source to browser-ready with audited components?', { id: 'cc-5', pinned: true, pinnedBy: 'Marcus', senderId: '0x04f3c8...7d1e02' })}
      ${msg('Marcus', 'M', '#26A69A', '10:36', 'About 3 hours with two agents running — builder writes code, auditor verifies against QML. Cost maybe $25 in API tokens.', { id: 'cc-6', reactions: ['✅ 2*', '🎉 1'], delivery: 'delivered', edited: true, senderId: '0x04d7e1...a92b05' })}
      ${msg('You', 'A', '#4360DF', '10:38', 'Font schemes too — switch between Inter, IBM Plex, Serif, Monospace from a dropdown. Layout holds across all of them.', { id: 'cc-7', delivery: 'sent' })}
      ${copiedHtml}`
}
function dmMessages() {
  return `
      <div class="messages__day-separator">Today</div>
      ${msg('carmen.eth', 'C', '#887AF9', '14:12', 'Hey! Did you get a chance to look at the new avatar sizes?', { id: 'dm-0', ensName: 'carmen.eth' })}
      ${msg('You', 'A', '#4360DF', '14:15', 'Yeah — 32 in the member list, 24 in the channel list, right?', { id: 'dm-1', delivery: 'delivered' })}
      ${msg('carmen.eth', 'C', '#887AF9', '14:20', 'Two topics at once — let me thread the design one.', { id: 'dm1', ensName: 'carmen.eth' })}
      ${msg('You', 'A', '#4360DF', '14:22', 'Good call — easier to follow that way.', { id: 'dm-3', delivery: 'sent' })}`
}
function groupMessages() {
  return `
      <div class="messages__day-separator">Today</div>
      ${msg('Marcus', 'M', '#26A69A', '10:58', 'Design Team sync in 10 — bring the thread mocks.', { id: 'g-0', senderId: '0x04d7e1...a92b05' })}
      ${msg('Elena', 'E', '#D37EF4', '11:02', 'Should the send-copy toggle default on or off?', { id: 'g1', ensName: 'elena.eth' })}
      ${msg('Kai', 'K', '#FE8F59', '11:06', 'Off by default — least surprise for new users.', { id: 'g-2', senderId: '0x04f3c8...7d1e02' })}`
}

const CHATS = {
  community: { surface: 'channel', kind: 'community', title: 'general', channelIcon: true, subtitle: 'General discussion about Status', pinned: 3, members: true, messages: communityMessages },
  dm:        { surface: 'dm',      kind: 'dm',        title: 'carmen.eth',  avatar: 'C', avatarColor: '#887AF9', subtitle: 'Online', members: false, messages: dmMessages },
  group:     { surface: 'group',   kind: 'group',     title: 'Design Team', avatar: 'D', avatarColor: '#4E77F5', subtitle: '6 members', members: true, messages: groupMessages },
}
function chatCtx(p) { const c = p.get('chat'); return CHATS[c] ? c : 'community' }

function chatHeaderDesktop(ctx, panelOpen) {
  return `
    <div class="chat-header">
      <div class="chat-header__info">
        ${chatHeaderAvatar(ctx)}
        <div class="chat-header__text">
          <div class="chat-header__title-row">${chatHeaderTitleRow(ctx)}</div>
          <div class="chat-header__subtitle-row">${chatHeaderSubtitle(ctx, ' messages')}</div>
        </div>
      </div>
      <div class="chat-header__actions">
        <button class="chat-header__action-btn" title="Search">${CHANNEL_ICONS.search}</button>
        ${ctx.members ? `<button class="chat-header__action-btn${panelOpen ? ' active' : ''}" data-members-btn title="Members" aria-pressed="${panelOpen}">${CHANNEL_ICONS.groupChat}</button>` : ''}
        <button class="chat-header__action-btn" title="More">${CHANNEL_ICONS.more}</button>
      </div>
    </div>`
}

// copied-to-parent posts in the channel: group consecutive replies from the same thread under one
// "replied to a thread: #name" header, stacking the texts like Status does for one sender (#21935)
function renderCopiedGroups(copied, surface) {
  if (!copied.length) return ''
  const groups = []
  copied.forEach(pp => {
    const last = groups[groups.length - 1]
    if (last && last.threadId === pp.threadId && last.name === pp.name) last.posts.push(pp)
    else groups.push({ threadId: pp.threadId, threadTitle: pp.threadTitle, name: pp.name, initial: pp.initial, color: pp.color, time: pp.time, posts: [pp] })
  })
  return groups.map(g => {
    const link = `<button type="button" class="message__thread-ref-link" data-open-thread="${g.threadId}" data-surface="${surface}">#${g.threadTitle}</button>`
    const texts = g.posts.map(pp => `<div class="message__text">${pp.text}</div>`).join('')
    // "replied to a thread: #name" sits above the avatar, same style as the "Also sent" tag but with the thread glyph
    return `
      <div class="message message--copied" data-msg-id="${g.posts[0].id}">
        <span class="message__also-sent message__thread-tag">${THREAD_GLYPH}<span>replied to a thread: ${link}</span></span>
        <div class="message__row">
          <div class="message__avatar" style="background:${g.color}">${g.initial}</div>
          <div class="message__body">
            <div class="message__header"><span class="message__sender">${g.name}</span><span class="message__header-dot">•</span><span class="message__time">${g.time}</span></div>
            ${texts}
          </div>
        </div>
      </div>`
  }).join('')
}

function renderCenterPanel(revamp, panelOpen = false, mobile = false, chat = 'community') {
  const ctx = CHATS[chat] || CHATS.community
  // copied-to-parent posts from threads (epic §3.1) — appended live to the channel stream (revamp only)
  const copied = revamp && ctx.surface === 'channel' ? store.parentPosts('channel') : []
  const copiedHtml = renderCopiedGroups(copied, ctx.surface)
  const header = mobile ? chatHeaderMobile(ctx) : chatHeaderDesktop(ctx, panelOpen)
  return `
    ${header}
    <div class="messages">
      ${ctx.messages(copiedHtml)}
    </div>
    <div class="chat-input">
      ${replyPreview()}
      <div class="chat-input__row">
        <button class="chat-input__cmd-btn" title="Commands">${CHANNEL_ICONS.chatCommands}</button>
        <div class="chat-input__box">
          <div class="chat-input__input-row">
            <textarea class="chat-input__field" placeholder="Type a message..." rows="1" readonly></textarea>
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
    </div>
  `
}

// minimal Messenger left panel for the DM/group demo — 2 chats, active highlighted, clickable to switch
function renderMessengerLeft(active) {
  const item = (key, name, avatar, color, sub) => `
    <button class="msgr-chat${active === key ? ' active' : ''}" data-open-chat="${key}" title="Open ${name}">
      <span class="msgr-chat__avatar" style="background:${color}">${avatar}</span>
      <span class="msgr-chat__text">
        <span class="msgr-chat__name">${name}</span>
        <span class="msgr-chat__sub">${sub}</span>
      </span>
    </button>`
  return `
    <div class="community-header">
      <div class="community-header__info">
        <div><div class="community-header__name">Messages</div></div>
        <button class="community-header__invite-btn" data-open-chat="community" title="Back to community">${ARROW_LEFT}</button>
      </div>
    </div>
    <div class="msgr-list">
      ${item('dm', 'carmen.eth', 'C', '#887AF9', 'Two topics at once — let me thread…')}
      ${item('group', 'Design Team', 'D', '#4E77F5', 'Should the send-copy toggle default…')}
    </div>`
}

// Hover quick-actions icons — lifted verbatim from StatusQ/src/assets/img/icons/ (recolored → currentColor)
// react=emoji.svg, reply=reply.svg, edit=edit_pencil.svg, pin=pin.svg, more=more.svg
const QUICK_ICONS = {
  react: `<svg viewBox="0 0 21 21" fill="none"><g fill="currentColor"><path d="m17.3761 0c.3797 0 .6875.307804.6875.6875v1.74167c0 .30375.2462.55.55.55h1.699c.3797 0 .6875.3078.6875.6875 0 .37969-.3078.6875-.6875.6875h-1.699c-.3038 0-.55.24624-.55.55v1.74166c0 .3797-.3078.6875-.6875.6875s-.6875-.3078-.6875-.6875v-1.74166c0-.30376-.2463-.55-.55-.55h-1.7866c-.3797 0-.6875-.30781-.6875-.6875 0-.3797.3078-.6875.6875-.6875h1.7866c.3037 0 .55-.24625.55-.55v-1.74167c0-.379696.3078-.6875.6875-.6875z"/><path d="m12.0914 2.7009c.0949-.29396-.0409-.64273-.3442-.70126-.5656-.10915-1.1497-.16631-1.7472-.16631-5.06257 0-9.166626 4.10406-9.166626 9.16667 0 5.0626 4.104056 9.1667 9.166626 9.1667 5.0627 0 9.1667-4.1041 9.1667-9.1667 0-.5222-.0437-1.03419-.1275-1.53254-.0534-.31706-.4233-.45705-.7263-.34951-.0583.0207-.1176.03932-.1778.05576-.275.07506-.4796.3405-.4359.62214.0609.39245.0925.79465.0925 1.20415 0 4.3032-3.4884 7.7917-7.7917 7.7917-4.30318 0-7.79163-3.4885-7.79163-7.7917 0-4.30322 3.48845-7.79167 7.79163-7.79167.4762 0 .9423.04271 1.3949.1245.294.05315.5761-.16642.6469-.45674.0145-.05925.031-.11767.0496-.17519z"/><g clip-rule="evenodd" fill-rule="evenodd"><path d="m4.40336 12.2118c.25049-.2876.64338-.441 1.0512-.3768.82016.1291 2.36622.3079 4.63854.3079 2.2723 0 3.8183-.1788 4.6385-.3079.4078-.0642.8007.0892 1.0512.3768.2591.2975.3603.7389.1701 1.1609-.581 1.2892-2.2 3.8119-5.8598 3.8119-3.65985 0-5.27886-2.5227-5.85983-3.8119-.19019-.422-.08907-.8634.17009-1.1609zm2.22016 1.153c-.3755-.0359-.63543.3609-.39978.6555.72377.9047 1.92583 1.7893 3.86936 1.7893 1.9435 0 3.1455-.8846 3.8693-1.7893.2357-.2946-.0243-.6914-.3998-.6555-.8878.085-2.0443.1531-3.4695.1531-1.42525 0-2.58179-.0681-3.46958-.1531z"/><path d="m5.5036 6.45233c.25793-.30952.71793-.35133 1.02744-.09341l2.50118 2.08432c.23595.19663.32348.51998.21892.80877s-.3788.48117-.68594.48117c-1.15664 0-2.84143.37452-3.78188.96252-.34162.2136-.79171.1098-1.00531-.2318-.21359-.3416-.10981-.79173.23181-1.00533.64263-.40179 1.4853-.70602 2.33527-.90549.1711-.04016.22708-.26066.09206-.37318l-.84015-.70013c-.30951-.25792-.35133-.71793-.0934-1.02744z"/><path d="m14.4965 6.45233c-.2579-.30952-.7179-.35133-1.0275-.09341l-2.5011 2.08432c-.236.19663-.3235.51998-.219.80877.1046.28879.3788.48117.686.48117 1.1566 0 2.8414.37452 3.7819.96252.3416.2136.7917.1098 1.0053-.2318s.1098-.79173-.2318-1.00533c-.6427-.40179-1.4853-.70602-2.3353-.90549-.1711-.04016-.2271-.26066-.0921-.37318l.8402-.70013c.3095-.25792.3513-.71793.0934-1.02744z"/></g></g></svg>`,
  reply: `<svg viewBox="0 0 24 24" fill="none"><path d="m15.5303 12.4697c-.2929-.2929-.7677-.2929-1.0606 0s-.2929.7677 0 1.0606l1.8661 1.8661c.315.315.0919.8536-.3536.8536h-3.9822c-3.45178 0-6.25-2.7982-6.25-6.25 0-3.45178 2.79822-6.25 6.25-6.25.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75c-4.28021 0-7.75 3.46979-7.75 7.75 0 4.2802 3.46979 7.75 7.75 7.75h3.9822c.4455 0 .6686.5386.3536.8536l-1.8661 1.8661c-.2929.2929-.2929.7677 0 1.0606s.7677.2929 1.0606 0l4-4c.2929-.2929.2929-.7677 0-1.0606z" fill="currentColor"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none"><path clip-rule="evenodd" d="m16.187 3.24584c1.2612-1.26112 3.3058-1.26112 4.567.00001 1.2611 1.26112 1.2611 3.3058 0 4.56692l-11.75175 11.75173c-.42718.4272-.95618.7384-1.53706.9044l-4.20764 1.2022c-.26236.0749-.54473.0018-.73767-.1912-.19294-.1929-.26611-.4753-.19115-.7376l1.20219-4.2077c.16596-.5809.47723-1.1099.90441-1.5371zm3.5044 1.06253c-.6743-.6743-1.7675-.6743-2.4418 0l-11.75175 11.75173c-.24661.2466-.4263.552-.52211.8873-.36205 1.2672.80948 2.4387 2.07664 2.0767.33534-.0958.64073-.2755.88734-.5222l11.75168-11.75166c.6743-.6743.6743-1.76756 0-2.44187z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m14.8956 7.28455c0-.82843-.6482-1.67563-1.4478-1.89228-.7996-.21664-1.4478.2793-1.4478 1.10773s.6482 1.67563 1.4478 1.89227c.7996.21665 1.4478-.2793 1.4478-1.10772z"/><path clip-rule="evenodd" d="m12 2c-3.31371 0-6 2.68629-6 6 0 2.9077 2.06835 5.3323 4.814 5.8828.2473.0496.436.2601.436.5123v6.6049c0 .4142.3358.75.75.75s.75-.3358.75-.75v-6.6049c0-.2522.1887-.4627.436-.5123 2.7457-.5505 4.814-2.9751 4.814-5.8828 0-3.31371-2.6863-6-6-6zm-4.5 6c0 2.4853 2.01472 4.5 4.5 4.5 2.4853 0 4.5-2.0147 4.5-4.5 0-2.48528-2.0147-4.5-4.5-4.5-2.48528 0-4.5 2.01472-4.5 4.5z" fill-rule="evenodd"/></g></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m7 12c0 1.1046-.89543 2-2 2s-2-.8954-2-2 .89543-2 2-2 2 .8954 2 2z"/><path d="m14 12c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2z"/><path d="m19 14c1.1046 0 2-.8954 2-2s-.8954-2-2-2-2 .8954-2 2 .8954 2 2 2z"/></g></svg>`,
}
// Hover quick-actions toolbar (StatusMessageQuickActions.qml — container h36/radius8/menu-bg+shadow;
// buttons = StatusFlatRoundButton chatButtonSize 32, Tertiary; MessageView.qml:1111 button set + gating).
// Order: react · reply · edit(own only) · pin · more. Desktop only (mobile uses the context menu).
export function quickActions(isSelf, pinned) {
  const qa = (icon, title) => `<button class="message__qa-btn" title="${title}" aria-label="${title}">${icon}</button>`
  return `<div class="message__quick-actions">${qa(QUICK_ICONS.react, 'Add reaction')}${qa(QUICK_ICONS.reply, 'Reply')}${isSelf ? qa(QUICK_ICONS.edit, 'Edit') : ''}${qa(QUICK_ICONS.pin, pinned ? 'Unpin' : 'Pin')}${qa(QUICK_ICONS.more, 'More')}</div>`
}

// Composer formatting icons — lifted verbatim from StatusQ assets (chat/style + bold/italic/strikethrough/quote/code), recoloured
const FMT_ICONS = {
  style: `<svg viewBox="0 0 24 24" fill="none"><path d="M12.0005 1.7998C14.127 1.7998 15.8372 1.86151 17.1919 2.09961C18.5525 2.33875 19.6344 2.76866 20.4331 3.56738C21.2318 4.3661 21.6617 5.44799 21.9009 6.80859C22.139 8.16333 22.2007 9.87349 22.2007 12C22.2007 14.1265 22.139 15.8367 21.9009 17.1914C21.6617 18.552 21.2318 19.6339 20.4331 20.4326C19.6344 21.2313 18.5525 21.6613 17.1919 21.9004C15.8372 22.1385 14.127 22.2002 12.0005 22.2002C9.87397 22.2002 8.16382 22.1385 6.80908 21.9004C5.44848 21.6613 4.36659 21.2313 3.56787 20.4326C2.76915 19.6339 2.33923 18.552 2.1001 17.1914C1.862 15.8367 1.80029 14.1265 1.80029 12C1.80029 9.87349 1.862 8.16333 2.1001 6.80859C2.33923 5.44799 2.76915 4.3661 3.56787 3.56738C4.36659 2.76866 5.44848 2.33875 6.80908 2.09961C8.16382 1.86151 9.87397 1.7998 12.0005 1.7998Z" stroke="currentColor" stroke-width="1.4"/><path d="M15.9268 10.1377H14.5264V8.90137H12.7002V14.5996H13.9365V16H10.0645V14.5996H11.2998V8.90137H9.47363V10.1377H8.07324V7.50098H15.9268V10.1377Z" fill="currentColor"/></svg>`,
  italic: `<svg viewBox="0 0 20 20" fill="none"><path clip-rule="evenodd" d="m9.85207 4.10002h-2.35207v-1.2h6v1.2h-2.4444l-.9077 11.79998h2.3521v1.2h-6v-1.2h2.44438z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  strikethrough: `<svg viewBox="0 0 20 20" fill="none"><path clip-rule="evenodd" d="m9.16648 2.97119c.82808-.14275 1.68712-.07 2.47132.21151.7842.28154 1.4678.76294 1.9554 1.39537.4886.63382.7568 1.38969.7568 2.17195h-1.2c0-.50331-.1717-1.00415-.5072-1.43925-.3365-.43649-.8243-.78821-1.4105-.99864-.5862-.21046-1.23518-.26643-1.86196-.15838-.62681.10806-1.19253.37329-1.62903.75159-.4357.3776-.72036.84773-.83446 1.34486-.11379.49581-.05654 1.01093.16995 1.48481.22734.47567.61937.89629 1.14049 1.19807.5215.30199 1.14213.46694 1.78271.46694h5v1.19998h-1.8425c.3537.3302.6428.7174.8484 1.1476.3412.7138.4324 1.5056.2568 2.2707-.1752.7637-.6049 1.4518-1.2181 1.9832-.6124.5308-1.383.8846-2.2111 1.0274-.8281.1427-1.6871.07-2.47129-.2116-.78426-.2815-1.4678-.7629-1.95539-1.3953-.48866-.6338-.75682-1.3897-.75682-2.172h1.2c0 .5033.17171 1.0042.50716 1.4393.33652.4365.82431.7882 1.4105.9986.58626.2105 1.23524.2664 1.86204.1584.6268-.1081 1.1925-.3733 1.629-.7516.4357-.3776.7204-.8477.8344-1.3449.1138-.4958.0566-1.0109-.1699-1.4848-.2273-.4756-.6194-.8963-1.1405-1.198-.5215-.302-1.1421-.467-1.7827-.467h-5v-1.19998h1.84255c-.35373-.33014-.64286-.7174-.84845-1.14754-.34117-.71384-.43243-1.50565-.25684-2.27072.17529-.76374.60493-1.45181 1.21813-1.98325.61239-.53073 1.38304-.88457 2.21109-1.02732z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m5 10.75c0-2.62335 2.12665-4.75 4.75-4.75h1c.4142 0 .75.33579.75.75s-.3358.75-.75.75h-1c-1.79492 0-3.25 1.45507-3.25 3.25v.75c0 .2761.22386.5.5.5h3.5c.2761 0 .5.2239.5.5v4c0 .2761-.2239.5-.5.5h-5c-.27614 0-.5-.2239-.5-.5z"/><path d="m13 10.75c0-2.62335 2.1266-4.75 4.75-4.75h1c.4142 0 .75.33579.75.75s-.3358.75-.75.75h-1c-1.7949 0-3.25 1.45507-3.25 3.25v.75c0 .2761.2239.5.5.5h3.5c.2761 0 .5.2239.5.5v4c0 .2761-.2239.5-.5.5h-5c-.2761 0-.5-.2239-.5-.5z"/></g></svg>`,
  code: `<svg viewBox="0 0 20 20" fill="none"><path clip-rule="evenodd" d="m8.40549 17.4208 2.00001-15.00002 1.1895.15859-2.00004 15.00003zm-1.82951-12.34499-4.5003 4.49992-.42431.42427.4243.4243 4.50024 4.5.84851-.8485-4.07594-4.0758 4.07599-4.07563zm11.34882 4.49992-4.5003-4.49992-.8485.84856 4.076 4.07563-4.076 4.0758.8485.8485 4.5003-4.5.4243-.4243z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  bold: `<svg viewBox="0 0 20 20" fill="none"><path clip-rule="evenodd" d="m8 2.9h.048c-.876 0-1.489.001-1.955.064-.339.046-.677.15-.953.427-.277.276-.381.615-.427.954-.042.313-.042.7-.042 1.139v9.033c0 .439 0 .826.042 1.139.046.339.15.678.427.954.276.277.614.381.953.427.313.042.7.042 1.139.042h2.508c2.326 0 3.67-.558 4.399-1.435.702-.845.701-1.846.701-2.381v-.033c0-.536.001-1.537-.701-2.381-.363-.437-.878-.795-1.59-1.044.271-.191.494-.41.674-.654.618-.837.618-1.821.617-2.353v-.07c0-.532.001-1.516-.617-2.353-.659-.892-1.885-1.462-3.983-1.462zm2.04 1.4h-2.002c-.493 0-.783.002-.989.03-.083.011-.127.023-.148.031-.008.021-.02.065-.032.148-.028.207-.029.497-.029.991v3.7h3.2c1.87 0 2.568-.503 2.857-.894.323-.438.343-.989.343-1.556 0-.567-.02-1.118-.343-1.556-.289-.391-.987-.894-2.857-.894zm-3.649 6.435h3.7v3.7c0 .494.002.784.03.991.011.083.023.127.031.148.021.008.065.02.148.031.206.028.495.03.988.03h2.502c2.149 0 2.982-.52 3.323-.93.357-.43.378-.958.378-1.52s-.021-1.09-.378-1.52c-.341-.41-1.174-.93-3.323-.93z" fill="currentColor" fill-rule="evenodd"/></svg>`,
}
const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`

// StatusChatInputReplyArea.qml — reply preview above the composer (radius 16, baseColor3, "↪ user" Medium 13 + elided quote + 20px close)
export function replyPreview() {
  return `
    <div class="chat-input__reply">
      <span class="chat-input__reply-user">↪ Marcus</span>
      <span class="chat-input__reply-text">11 themes built in one session — Nord, Dracula, Solarized, even a hacker green-on-black one. All live-swappable.</span>
      <button class="chat-input__reply-close" title="Cancel reply" aria-label="Cancel reply">${CLOSE_ICON}</button>
    </div>`
}
// StatusChatInputToolBar.qml — style toggle → formatting group (bold/italic/strikethrough/quote/code)
export function formatGroup() {
  const fb = (icon, title) => `<button class="chat-input__btn chat-input__fmt-btn" title="${title}" aria-label="${title}">${icon}</button>`
  return `<button class="chat-input__btn chat-input__style-btn" data-style-toggle title="Formatting">${FMT_ICONS.style}</button>` +
    `<span class="chat-input__format">${fb(FMT_ICONS.bold, 'Bold')}${fb(FMT_ICONS.italic, 'Italic')}${fb(FMT_ICONS.strikethrough, 'Strikethrough')}${fb(FMT_ICONS.quote, 'Quote')}${fb(FMT_ICONS.code, 'Code')}</span>`
}

/* Message builder — supports all included StatusMessage sub-components:
   reply, pinned indicator, full header (name + delivery), text, reactions
   Options: { reactions, pinned, pinnedBy, reply, replyTo, replyText, delivery, edited, continued } */
export function msg(name, initial, color, time, text, opts = {}) {
  const { reactions = [], pinned = false, pinnedBy = '', reply = false, replyTo = '', replyText = '', replyColor = '#D37EF4', replyInitial = '', delivery = '', edited = false, continued = false, ensName = '', senderId = '', id = '', threadRef = '', threadRefId = '', threadRefSurface = 'channel', alsoSent = false, sending = false, mention = false } = opts
  // thread reply that was also posted to the parent channel — Slack-style tag above the name
  const alsoSentHtml = alsoSent ? `<span class="message__also-sent">${ALSO_SENT_GLYPH}<span>Also sent to the channel</span></span>` : ''
  const stateClass = `${pinned ? ' message--pinned' : ''}${sending ? ' message--sending' : ''}${mention ? ' message--mention' : ''}`
  const idAttr = id ? ` data-msg-id="${id}"` : ''
  // copied-from-thread tag (epic §3.1) — "replied to a thread: #<name>", the name links back to the thread
  const threadName = threadRefId
    ? `<button type="button" class="message__thread-ref-link" data-open-thread="${threadRefId}" data-surface="${threadRefSurface}">#${threadRef}</button>`
    : `#${threadRef}`
  const threadRefHtml = threadRef ? `<span class="message__thread-ref">replied to a thread: ${threadName}</span>` : ''

  // Pinned indicator
  const pinnedHtml = pinned ? `
    <div class="message__pinned-indicator">
      <span class="message__pinned-icon">${MSG_ICONS.pin}</span>
      <span class="message__pinned-text">Pinned by</span>
      <span class="message__pinned-by">${pinnedBy}</span>
    </div>
  ` : ''

  // Reply connector
  const replyHtml = reply ? `
    <div class="message__reply">
      <div class="message__reply-connector"></div>
      <div class="message__reply-content">
        <div class="message__reply-header">
          <div class="message__reply-avatar" style="background:${replyColor}">${replyInitial}</div>
          <span class="message__reply-sender">${replyTo}</span>
        </div>
        <div class="message__reply-text">${replyText}</div>
      </div>
    </div>
  ` : ''

  // Delivery status icon
  let deliveryHtml = ''
  if (delivery === 'delivered') {
    deliveryHtml = `<span class="message__delivery"><span class="message__delivery-icon">${MSG_ICONS.delivered}</span><span class="message__delivery-label">Delivered</span></span>`
  } else if (delivery === 'sent') {
    deliveryHtml = `<span class="message__delivery"><span class="message__delivery-icon">${MSG_ICONS.sent}</span><span class="message__delivery-label">Sent</span></span>`
  }

  // Secondary name (ENS) + dot + tertiary detail (compressed ID)
  // StatusMessageHeader.qml:105-141 — active when !amISender && sender.secondaryName/tertiaryDetail
  const isSelf = name === 'You'
  const secondaryNameHtml = !isSelf && ensName ? `<span class="message__secondary-name">(${ensName})</span>` : ''
  const compressedId = !isSelf && senderId ? `<span class="message__tertiary-detail">${senderId.slice(0, 3)}...${senderId.slice(-6)}</span>` : ''
  // Dot between secondary and tertiary (only when both active, line 120)
  const midDotHtml = secondaryNameHtml && compressedId ? '<span class="message__header-dot">•</span>' : ''
  const headerDotsHtml = `${secondaryNameHtml}${midDotHtml}${compressedId}`

  // Edited indicator
  const editedHtml = edited ? ' <span class="message__edited">(edited)</span>' : ''

  // Reactions with "add" button
  let reactionsHtml = ''
  if (reactions.length) {
    const chips = reactions.map(r => {
      const own = r.includes('*') // convention: "👍 3*" means user reacted
      const clean = r.replace('*', '')
      return `<span class="message__reaction${own ? ' message__reaction--own' : ''}">${clean}</span>`
    }).join('')
    reactionsHtml = `<div class="message__reactions">${chips}<button class="message__reaction message__reaction--add">${MSG_ICONS.reactionAdd}</button></div>`
  }

  // Avatar + header (or continued message without avatar)
  if (continued) {
    return `
      <div class="message${stateClass}"${idAttr}>
        ${pinnedHtml}${replyHtml}
        <div class="message__body message__body--continued">
          ${threadRefHtml}
          <div class="message__text">${text}${editedHtml}</div>
          ${reactionsHtml}
        </div>
        ${quickActions(isSelf, pinned)}
      </div>
    `
  }

  return `
    <div class="message${stateClass}"${idAttr}>
      ${alsoSentHtml}${pinnedHtml}${replyHtml}
      <div class="message__row">
        <div class="message__avatar" style="background:${color}">${initial}</div>
        <div class="message__body">
          <div class="message__header">
            <span class="message__sender">${name}</span>${headerDotsHtml}
            <span class="message__header-dot">•</span>
            <span class="message__time">${time}</span>
            ${deliveryHtml}
          </div>
          ${threadRefHtml}
          <div class="message__text">${text}${editedHtml}</div>
          ${reactionsHtml}
        </div>
      </div>
      ${quickActions(isSelf, pinned)}
    </div>
  `
}

// Message-specific icons from StatusQ/src/assets/img/icons/
export const MSG_ICONS = {
  pin: `<svg viewBox="0 0 16 17" fill="none"><g fill="currentColor"><path clip-rule="evenodd" d="m8.75003 10.9168c0-.4858.3553-.8897.80836-1.06492 1.61621-.6252 2.76241-2.19433 2.76241-4.03116 0-2.38627-1.9345-4.32072-4.32076-4.32072-2.38627 0-4.32072 1.93445-4.32072 4.32072 0 1.83683 1.14619 3.40595 2.76236 4.03115.45306.17523.80835.57913.80835 1.06493v4.1487c0 .4276.33579.7743.75.7743s.75-.3467.75-.7743zm2.07077-5.09608c0 1.55784-1.26292 2.82072-2.82076 2.82072s-2.82072-1.26288-2.82072-2.82072 1.26288-2.82072 2.82072-2.82072 2.82076 1.26288 2.82076 2.82072z" fill-rule="evenodd"/><path d="m9.78599 5.38285c0-.59277-.46381-1.19898-1.03596-1.354s-1.03596.19985-1.03596.79262c0 .59278.46381 1.19899 1.03596 1.35401.57215.15501 1.03596-.19986 1.03596-.79263z"/></g></svg>`,
  delivered: `<svg viewBox="0 0 16 17" fill="none"><g fill="currentColor"><path d="m13.7774 4.08403c.2297.15317.2918.46361.1386.69337l-4.99997 7.5c-.08682.1302-.22964.2123-.38588.2217-.15625.0095-.3079-.0548-.40977-.1737l-3-3.49995c-.17971-.20966-.15543-.52531.05423-.70503.20967-.17971.52532-.15543.70503.05424l2.39864 2.79844c.08625.1006.24475.091.31827-.0192l4.48745-6.7312c.1532-.22976.4636-.29185.6934-.13867z"/><path d="m8.54225 8.33804c-.18379.27568-.58003.29961-.79566.04805-.14578-.17008-.16065-.41637-.03639-.60275l2.3738-3.56064c.1531-.22976.4636-.29185.6933-.13867.2298.15317.2919.46361.1387.69337z"/><path d="m2.87964 8.17461c-.17971-.20966-.49536-.23394-.70503-.05423-.20966.17971-.23394.49536-.05423.70502l3 3.5c.17971.2097.49536.2339.70502.0542.20967-.1797.23395-.4953.05424-.705z"/></g></svg>`,
  sent: `<svg viewBox="0 0 16 17" fill="none"><path clip-rule="evenodd" d="m12.2774 4.08403c.2297.15317.2918.46361.1386.69337l-4.99997 7.5c-.08682.1302-.22964.2123-.38588.2217-.15625.0095-.3079-.0548-.40977-.1737l-3-3.49995c-.17971-.20966-.15543-.52531.05423-.70503.20967-.17971.52532-.15543.70503.05424l2.39864 2.79844c.08626.1006.24475.091.31827-.0192l4.48745-6.7312c.1532-.22976.4636-.29185.6934-.13867z" fill="currentColor" fill-rule="evenodd"/></svg>`,
  reactionAdd: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m14.2815 2.94644c.1035-.32069-.0446-.70116-.3755-.76501-.617-.11907-1.2542-.18143-1.906-.18143-5.52285 0-10 4.47715-10 10 0 5.5228 4.47715 10 10 10 5.5228 0 10-4.4772 10-10 0-.5697-.0476-1.1282-.1391-1.6719-.0583-.34585-.4618-.49856-.7923-.38124-.0636.02258-.1283.04289-.194.06084-.3.0819-.5232.3714-.4755.6787.0664.4281.1009.8668.1009 1.3136 0 4.6944-3.8056 8.5-8.5 8.5-4.69442 0-8.5-3.8056-8.5-8.5 0-4.69442 3.80558-8.5 8.5-8.5.5194 0 1.0279.04659 1.5216.13581.3208.05798.6285-.18155.7058-.49826.0158-.06463.0338-.12836.0541-.19111z"/><g clip-rule="evenodd" fill-rule="evenodd"><path d="m5.89453 13.3219c.27326-.3137.70187-.481 1.14676-.411.89472.1409 2.58134.3359 5.06021.3359 2.4789 0 4.1655-.195 5.0602-.3359.4449-.07.8735.0973 1.1467.411.2828.3246.3931.8062.1856 1.2666-.6338 1.4063-2.4 4.1583-6.3925 4.1583-3.99254 0-5.75874-2.752-6.39253-4.1583-.20748-.4604-.09716-.942.18556-1.2666zm2.42199 1.2579c-.40964-.0392-.69319.3937-.43612.715.78957.987 2.10091 1.952 4.2211 1.952 2.1202 0 3.4315-.965 4.2211-1.952.257-.3213-.0265-.7542-.4361-.715-.9685.0927-2.2302.167-3.785.167s-2.81648-.0743-3.78498-.167z"/><path d="m7.09479 7.0389c.28138-.33765.7832-.38327 1.12085-.10189l2.72856 2.2738c.2574.2145.3529.56724.2388.88229-.114.315-.4132.5249-.7483.5249-1.26177 0-3.09973.4086-4.12567 1.05-.37268.233-.86368.1198-1.0967-.2529-.23301-.3726-.11979-.8636.25289-1.0967.70104-.43828 1.62033-.77017 2.54756-.98777.18666-.0438.24772-.28436.10043-.4071l-.91653-.76378c-.33765-.28137-.38327-.7832-.10189-1.12085z"/><path d="m16.9052 7.0389c-.2814-.33765-.7832-.38327-1.1208-.10189l-2.7286 2.2738c-.2574.2145-.3529.56724-.2388.88229.114.315.4132.5249.7483.5249 1.2618 0 3.0997.4086 4.1257 1.05.3726.233.8637.1198 1.0967-.2529.233-.3726.1198-.8636-.2529-1.0967-.7011-.43828-1.6203-.77017-2.5476-.98777-.1866-.0438-.2477-.28436-.1004-.4071l.9165-.76378c.3377-.28137.3833-.7832.1019-1.12085z"/></g></g></svg>`,
}

// Nav sidebar icons — exact SVGs from StatusQ/src/assets/img/icons/
const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none"><path d="M11.3057 3.67969C11.7208 3.38476 12.2792 3.38476 12.6943 3.67969L12.7812 3.74707L20.2812 10.1758C20.5471 10.4037 20.7001 10.7367 20.7002 11.0869V19.5C20.7002 20.1627 20.1627 20.7002 19.5 20.7002H4.5C3.83726 20.7002 3.2998 20.1627 3.2998 19.5V11.0869C3.29986 10.7367 3.45286 10.4037 3.71875 10.1758L11.2188 3.74707L11.3057 3.67969Z" stroke="currentColor" stroke-width="1.4"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" fill="none"><path d="M12.0005 1.7998C14.1269 1.79981 15.8372 1.86152 17.1919 2.09961C18.5524 2.33875 19.6344 2.76869 20.4331 3.56738C21.2317 4.36609 21.6618 5.44808 21.9009 6.80859C22.1153 8.0288 22.1828 9.53754 22.1948 11.3789C22.1977 11.4185 22.2007 11.4589 22.2007 11.5H22.1958C22.1966 11.664 22.2007 11.8308 22.2007 12C22.2007 12.0992 22.198 12.1976 22.1978 12.2949C22.1981 12.3628 22.2007 12.4313 22.2007 12.5H22.1958C22.1861 14.3965 22.12 15.9446 21.9009 17.1914C21.6617 18.5519 21.2318 19.6339 20.4331 20.4326C19.6344 21.2313 18.5524 21.6613 17.1919 21.9004C15.8372 22.1385 14.1269 22.2002 12.0005 22.2002C9.87405 22.2002 8.1638 22.1385 6.80908 21.9004C5.44857 21.6613 4.36658 21.2312 3.56787 20.4326C2.76919 19.6339 2.33924 18.5519 2.1001 17.1914C1.88096 15.9446 1.81487 14.3965 1.80518 12.5H1.80029C1.80029 12.4313 1.80292 12.3628 1.80322 12.2949C1.80294 12.1976 1.8003 12.0992 1.80029 12C1.80029 11.8308 1.80434 11.664 1.80518 11.5H1.80029C1.80029 11.4589 1.8033 11.4185 1.80615 11.3789C1.81818 9.53752 1.88566 8.02881 2.1001 6.80859C2.33923 5.44801 2.76917 4.3661 3.56787 3.56738C4.36659 2.76866 5.44848 2.33875 6.80908 2.09961C8.16381 1.86153 9.87402 1.7998 12.0005 1.7998ZM15.4663 10.2109C15.3571 10.4289 15.1969 10.6951 14.9644 10.9609C14.4034 11.6019 13.4661 12.2002 12.0005 12.2002C10.5349 12.2002 9.59758 11.6019 9.03662 10.9609C8.80394 10.695 8.64289 10.429 8.53369 10.2109C8.38903 10.2154 8.21566 10.2205 8.021 10.2305C7.42516 10.261 6.63774 10.3213 5.85693 10.4414C5.0647 10.5633 4.3288 10.7396 3.80908 10.9795C3.3918 11.1721 3.25923 11.3328 3.21826 11.4268C3.20972 11.6614 3.20494 11.9099 3.20264 12.1729C3.20608 14.2106 3.26987 15.7593 3.479 16.9492C3.693 18.1666 4.04437 18.9286 4.55811 19.4424C5.07187 19.9561 5.83391 20.3075 7.05127 20.5215C8.27462 20.7365 9.87713 20.7998 12.0005 20.7998C14.1239 20.7998 15.7264 20.7365 16.9497 20.5215C18.1671 20.3075 18.9291 19.9561 19.4429 19.4424C19.9566 18.9286 20.308 18.1666 20.522 16.9492C20.7311 15.7593 20.7949 14.2106 20.7983 12.1729C20.796 11.9099 20.7903 11.6614 20.7817 11.4268C20.7406 11.3328 20.6085 11.1719 20.1919 10.9795C19.6722 10.7396 18.9362 10.5633 18.144 10.4414C17.3633 10.3213 16.5758 10.261 15.98 10.2305C15.7849 10.2205 15.6112 10.2154 15.4663 10.2109ZM12.0005 6.7002C9.88157 6.7002 8.2655 6.7629 7.02686 6.93555C5.78284 7.10895 4.99188 7.38436 4.47021 7.75684C3.91812 8.15119 3.58523 8.71574 3.3999 9.63184C4.06853 9.35418 4.88002 9.17614 5.64404 9.05859C6.48803 8.92875 7.32591 8.86398 7.94873 8.83203C8.26106 8.81602 8.52212 8.80774 8.70557 8.80371C8.7973 8.8017 8.87028 8.8013 8.92041 8.80078C8.94518 8.80053 8.96459 8.79987 8.97803 8.7998H9.54736L9.67822 9.3252V9.32324C9.6784 9.32377 9.67882 9.32486 9.6792 9.32617C9.68082 9.33176 9.68416 9.34428 9.68994 9.36133C9.70172 9.39598 9.72271 9.45136 9.75439 9.52051C9.81867 9.6607 9.9245 9.85061 10.0894 10.0391C10.4035 10.398 10.9665 10.7998 12.0005 10.7998C13.0345 10.7998 13.5976 10.398 13.9116 10.0391C14.0765 9.85057 14.1823 9.66071 14.2466 9.52051C14.2783 9.45131 14.2993 9.39598 14.311 9.36133C14.3168 9.34422 14.3202 9.33173 14.3218 9.32617V9.3252L14.4536 8.7998H15.0229C15.0364 8.79988 15.0558 8.80053 15.0806 8.80078C15.1307 8.80129 15.2037 8.8017 15.2954 8.80371C15.4789 8.80775 15.7399 8.81602 16.0522 8.83203C16.6751 8.86398 17.513 8.92875 18.3569 9.05859C19.1206 9.17609 19.9317 9.35438 20.6001 9.63184C20.4148 8.71594 20.0827 8.15116 19.5308 7.75684C19.0091 7.38437 18.2181 7.10896 16.9741 6.93555C15.7355 6.76289 14.1194 6.7002 12.0005 6.7002ZM12.0005 3.2002C9.87709 3.2002 8.27463 3.26351 7.05127 3.47852C5.83379 3.69251 5.07187 4.04385 4.55811 4.55762C4.09604 5.01969 3.76684 5.68283 3.54932 6.69727C3.58417 6.67057 3.61953 6.64405 3.65576 6.61816C4.4466 6.05328 5.49969 5.73475 6.8335 5.54883C8.17295 5.36213 9.86953 5.2998 12.0005 5.2998C14.1314 5.29981 15.828 5.36212 17.1675 5.54883C18.5012 5.73476 19.5544 6.0533 20.3452 6.61816C20.3812 6.64386 20.4161 6.67077 20.4507 6.69727C20.2332 5.68303 19.9048 5.01966 19.4429 4.55762C18.9291 4.04387 18.1671 3.69251 16.9497 3.47852C15.7264 3.2635 14.1239 3.2002 12.0005 3.2002Z" fill="currentColor"/></svg>`,
  swap: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path d="m6.46967 12.4697c.29289-.2929.76777-.2929 1.06066 0s.29289.7677 0 1.0606l-1.86612 1.8661c-.31498.315-.09189.8536.35356.8536h10.98223c1.7949 0 3.25-1.4551 3.25-3.25v-1c0-.4142.3358-.75.75-.75s.75.3358.75.75v1c0 2.6234-2.1266 4.75-4.75 4.75h-10.98223c-.44546 0-.66854.5386-.35356.8536l1.86612 1.8661c.29289.2929.29289.7677 0 1.0606s-.76777.2929-1.06066 0l-4-4c-.29289-.2929-.29289-.7677 0-1.0606z"/><path d="m16.4697 2.46967c-.2929.29289-.2929.76777 0 1.06066l1.8661 1.86612c.315.31498.0919.85355-.3536.85355h-10.9822c-2.62335 0-4.75 2.12665-4.75 4.75v1c0 .4142.33579.75.75.75s.75-.3358.75-.75v-1c0-1.79493 1.45507-3.25 3.25-3.25h10.9822c.4455 0 .6686.53857.3536.85355l-1.8661 1.86615c-.2929.2929-.2929.7677 0 1.0606s.7677.2929 1.0606 0l4-3.99997c.2929-.29289.2929-.76777 0-1.06066l-4-4c-.2929-.29289-.7677-.29289-1.0606 0z"/></g></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.2998C17.3572 2.2998 21.7002 6.64284 21.7002 12V18C21.7002 20.0435 20.0435 21.7002 18 21.7002H12C6.64284 21.7002 2.2998 17.3572 2.2998 12C2.2998 6.64284 6.64284 2.2998 12 2.2998Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  browser: `<svg viewBox="0 0 24 24" fill="none"><path d="M9.98557 10.5481L8.55179 15.3274C8.52923 15.4026 8.59815 15.4732 8.67388 15.4526L13.9449 14.015C13.979 14.0057 14.0057 13.979 14.015 13.9449L15.4492 8.68627C15.4705 8.60803 15.3948 8.53827 15.3185 8.56598L10.0472 10.4828C10.0175 10.4936 9.99465 10.5178 9.98557 10.5481Z" stroke="currentColor" stroke-width="1.4"/><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.4"/></svg>`,
  communities: `<svg viewBox="0 0 24 24" fill="none"><path d="M10.9996 21.0001C10.9996 18.3479 12.0531 15.8044 13.9285 13.929C15.8039 12.0537 18.3474 11.0001 20.9996 11.0001M6.99981 21.0003C6.99981 17.2873 8.4748 13.7263 11.1003 11.1008C13.7258 8.47532 17.287 6.99996 21.0001 6.99996M15.4732 18.6635C15.7715 17.9581 16.2049 17.3095 16.7569 16.7574C17.309 16.2053 17.9576 15.772 18.663 15.4737C19.9543 14.9277 20.5999 14.6548 20.7998 14.3534C20.9996 14.0519 20.9996 13.568 20.9996 12.6001V5.40005C20.9996 4.24389 20.9996 3.66581 20.5912 3.30735C20.1827 2.94888 19.6568 3.01767 18.605 3.15526C10.5353 4.21081 4.21032 10.5358 3.15477 18.6055C3.01719 19.6573 2.94839 20.1832 3.30686 20.5916C3.66533 21.0001 4.2434 21.0001 5.39956 21.0001H12.5996C13.5675 21.0001 14.0515 21.0001 14.3529 20.8002C14.6543 20.6004 14.9273 19.9548 15.4732 18.6635Z" stroke="currentColor" stroke-width="1.4"/></svg>`,
  qr: `<svg viewBox="0 0 24 24" fill="none"><g fill="currentColor"><path clip-rule="evenodd" d="m4 2c-1.10457 0-2 .89543-2 2v5c0 1.1046.89543 2 2 2h5c1.1046 0 2-.8954 2-2v-5c0-1.10457-.8954-2-2-2zm5 1.5h-5c-.27614 0-.5.22386-.5.5v5c0 .27614.22386.5.5.5h5c.27614 0 .5-.22386.5-.5v-5c0-.27614-.22386-.5-.5-.5z" fill-rule="evenodd"/><path d="m6.5 16c-.82843 0-1.5.6716-1.5 1.5s.67157 1.5 1.5 1.5 1.5-.6716 1.5-1.5-.67157-1.5-1.5-1.5z"/><path clip-rule="evenodd" d="m6.5 13c-2.48528 0-4.5 2.0147-4.5 4.5s2.01472 4.5 4.5 4.5 4.5-2.0147 4.5-4.5-2.01472-4.5-4.5-4.5zm-3 4.5c0 1.6569 1.34315 3 3 3s3-1.3431 3-3-1.34315-3-3-3-3 1.3431-3 3z" fill-rule="evenodd"/><path d="m14 13c-.5523 0-1 .4477-1 1v1.5c0 .5523.4477 1 1 1h1.5c.5523 0 1-.4477 1-1v-1.5c0-.5523-.4477-1-1-1z"/><path d="m18.5 14c0-.5523.4477-1 1-1h1.5c.5523 0 1 .4477 1 1v1.5c0 .5523-.4477 1-1 1h-1.5c-.5523 0-1-.4477-1-1z"/><path d="m19.5 18.5c-.5523 0-1 .4477-1 1v1.5c0 .5523.4477 1 1 1h1.5c.5523 0 1-.4477 1-1v-1.5c0-.5523-.4477-1-1-1z"/><path d="m13 19.5c0-.5523.4477-1 1-1h1.5c.5523 0 1 .4477 1 1v1.5c0 .5523-.4477 1-1 1h-1.5c-.5523 0-1-.4477-1-1z"/><path d="m16 6c0-.55228.4477-1 1-1h1c.5523 0 1 .44772 1 1v1c0 .55228-.4477 1-1 1h-1c-.5523 0-1-.44772-1-1z"/><path clip-rule="evenodd" d="m13 4c0-1.10457.8954-2 2-2h5c1.1046 0 2 .89543 2 2v5c0 1.1046-.8954 2-2 2h-5c-1.1046 0-2-.8954-2-2zm2-.5h5c.2761 0 .5.22386.5.5v5c0 .27614-.2239.5-.5.5h-5c-.2761 0-.5-.22386-.5-.5v-5c0-.27614.2239-.5.5-.5z" fill-rule="evenodd"/></g></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none"><path d="M15.7666 2.48535C16.6387 2.81122 17.4633 3.25141 18.2178 3.79492L18.5361 4.03418L18.8047 4.24316L18.8057 4.58301L18.8174 7.85352C18.8175 7.87445 18.8229 7.89532 18.834 7.91309L18.8359 7.91602C18.8983 8.01666 18.9677 8.13118 19.0352 8.25586L19.0547 8.28125C19.0615 8.28826 19.0697 8.29362 19.0781 8.29883L21.9795 9.95215L22.2715 10.1191L22.3242 10.4502C22.4452 11.2062 22.4776 11.9727 22.4219 12.7344H24.2891L21.9883 14.042L19.0869 15.6924V15.6934C19.0693 15.7034 19.054 15.7177 19.0439 15.7354L19.041 15.7402C18.9844 15.8379 18.9163 15.956 18.8467 16.0684L18.8447 16.0723C18.8341 16.0891 18.8282 16.109 18.8281 16.1289V16.1309L18.8125 19.4062L18.8115 19.7441L18.5449 19.9531C17.709 20.6096 16.7777 21.1345 15.7832 21.5098L15.4795 21.625L15.1953 21.4668L12.2705 19.8369L12.2158 19.8223H11.8057C11.7843 19.8217 11.7629 19.8266 11.7441 19.8369L8.81934 21.4707L8.53613 21.6279L8.23242 21.5146C7.23608 21.1423 6.30258 20.62 5.46387 19.9658L5.19531 19.7568L5.19434 19.416L5.18262 16.1465V16.1455C5.18246 16.1248 5.17692 16.1045 5.16602 16.0869L5.16406 16.084C5.10149 15.9831 5.03147 15.8683 4.96387 15.7432V15.7441C4.95356 15.7258 4.93892 15.7101 4.9209 15.6992L2.02051 14.0469L1.72754 13.8809L1.6748 13.5488C1.51306 12.5257 1.51311 11.4831 1.6748 10.46L1.72754 10.1279L2.01953 9.96094L4.91602 8.30762L4.91699 8.30664C4.93457 8.29665 4.94898 8.28222 4.95898 8.26465L4.96191 8.25977C5.01861 8.16202 5.08753 8.04308 5.15723 7.93066L5.15918 7.92676C5.16965 7.91002 5.17567 7.89085 5.17578 7.87109V7.86914L5.19043 4.59375L5.19238 4.25586L5.45898 4.04688C6.29494 3.39041 7.22624 2.86549 8.2207 2.49023L8.52441 2.375L8.80859 2.5332L11.7295 4.16309C11.747 4.17279 11.7671 4.17822 11.7871 4.17773H12.1943C12.2049 4.17797 12.2154 4.17632 12.2256 4.17383L12.2549 4.16309L15.1807 2.5293L15.4639 2.37109L15.7666 2.48535Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.7" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  notification: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.89941C13.2302 2.89946 14.6959 3.18992 15.8916 4.3877C17.077 5.57542 17.8869 7.54647 18.0635 10.6621C18.1092 11.4696 18.1292 11.7975 18.168 12C18.207 12.204 18.2817 12.4312 18.4746 13.0098L19.8643 17.1787L20.1709 18.0996H16.2412C16.0958 18.9805 15.6795 19.801 15.04 20.4404C14.2336 21.2468 13.1394 21.7002 11.999 21.7002C10.8589 21.7 9.76522 21.2466 8.95898 20.4404C8.31969 19.801 7.90424 18.9804 7.75879 18.0996H3.82812L4.13574 17.1787L5.52539 13.0098C5.71818 12.4314 5.79198 12.2039 5.83105 12C5.86979 11.7975 5.89078 11.4695 5.93652 10.6621C6.11306 7.54653 6.92203 5.57543 8.10742 4.3877C9.3032 3.18971 10.7697 2.89941 12 2.89941ZM9.18848 18.0996C9.31463 18.6063 9.57389 19.0748 9.94922 19.4502C10.4929 19.9938 11.2302 20.2996 11.999 20.2998C12.7681 20.2998 13.506 19.994 14.0498 19.4502C14.4252 19.0748 14.6834 18.6063 14.8096 18.0996H9.18848ZM12 4.2998C10.9825 4.2998 9.93753 4.53654 9.09863 5.37695C8.2494 6.22787 7.50018 7.80812 7.33398 10.7412C7.29148 11.4915 7.26708 11.9436 7.20605 12.2627C7.14528 12.5801 7.0333 12.9128 6.85352 13.4521L5.77148 16.6992H18.2285L17.1465 13.4521C16.9667 12.9127 16.8537 12.5802 16.793 12.2627C16.732 11.9436 16.7085 11.4914 16.666 10.7412C16.4998 7.80834 15.7505 6.22792 14.9014 5.37695C14.0625 4.53655 13.0174 4.29985 12 4.2998Z" fill="currentColor"/></svg>`,
}
