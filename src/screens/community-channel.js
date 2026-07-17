// All SVG icons sourced from /home/alisher/status-desktop/ui/StatusQ/src/assets/img/icons/
// Hardcoded fill/stroke colors replaced with currentColor

const CHANNEL_ICONS = {
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

export function renderCommunityChannel() {
  const nav = renderNav()
  const left = renderLeftPanel()
  const center = renderCenterPanel()
  return { nav, left, center, right: null }
}

function renderNav() {
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
          <span class="badge"></span>
        </button>
      </div>
    </div>
  `
}

function navBtn(title, iconSvg, active) {
  return `<button class="shell__nav-btn${active ? ' active' : ''}" title="${title}">${iconSvg}</button>`
}

function renderLeftPanel() {
  return `
    <div class="community-header">
      <div class="community-header__info">
        <div class="community-header__avatar">S</div>
        <div>
          <div class="community-header__name">Status Community</div>
          <div class="community-header__members">4,832 members</div>
        </div>
        <button class="community-header__invite-btn" title="Invite contacts">${CHANNEL_ICONS.addContact}</button>
      </div>
    </div>
    <div class="channel-list">
      ${category('General', [
        channelItem('general', { active: true, badge: 3 }),
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

function renderCenterPanel() {
  return `
    <div class="chat-header">
      <div class="chat-header__info">
        <div class="chat-header__avatar" style="background:var(--misc-color-5);font-size:18px;color:var(--indirect-color-1)">#</div>
        <div class="chat-header__text">
          <div class="chat-header__title-row">
            <span class="chat-header__channel-icon">${CHANNEL_ICONS.channel}</span>
            <span class="chat-header__title">general</span>
          </div>
          <div class="chat-header__subtitle-row">
            <span class="chat-header__description">General discussion about Status</span>
            <span class="chat-header__separator"></span>
            <span class="chat-header__pin-icon">${CHANNEL_ICONS.pinHeader}</span>
            <span class="chat-header__pin-text">3 pinned messages</span>
          </div>
        </div>
      </div>
      <div class="chat-header__actions">
        <button class="chat-header__action-btn" title="Search">${CHANNEL_ICONS.search}</button>
        <button class="chat-header__action-btn" title="Members">${CHANNEL_ICONS.groupChat}</button>
        <button class="chat-header__action-btn" title="More">${CHANNEL_ICONS.more}</button>
      </div>
    </div>
    <div class="messages">
      <div class="messages__day-separator">Today</div>
      ${msg('Elena', 'E', '#D37EF4', '10:23', 'Just switched the whole design system to CSS tokens. Agents can now restyle screens by editing one file.', { delivery: 'delivered', ensName: 'elena.eth', senderId: '0x04a2b9...c3f8e1' })}
      ${msg('Marcus', 'M', '#26A69A', '10:25', '11 themes built in one session — Nord, Dracula, Solarized, even a hacker green-on-black one. All live-swappable.', { reactions: ['👍 3', '🔥 1'], delivery: 'delivered', senderId: '0x04d7e1...a92b05' })}
      ${msg('You', 'A', '#4360DF', '10:28', 'The best part is the auditor agent catches pixel mismatches before merge. No more "does this match the spec?" debates.', { delivery: 'delivered', reply: true, replyTo: 'Elena', replyInitial: 'E', replyColor: '#D37EF4', replyText: 'Just switched the whole design system to CSS tokens. Agents can now restyle screens by editing one file.' })}
      ${msg('Elena', 'E', '#D37EF4', '10:30', 'Exactly. The design system lives in the browser now, not in Figma. Agent-readable and human-visible at the same time.', { delivery: 'delivered', ensName: 'elena.eth', senderId: '0x04a2b9...c3f8e1' })}
      ${msg('Elena', '', '', '', 'No export pipeline, no handoff docs. Change a token, see it everywhere instantly.', { continued: true })}
      ${msg('Kai', 'K', '#FE8F59', '10:34', 'How long did the full pipeline take? QML source to browser-ready with audited components?', { pinned: true, pinnedBy: 'Marcus', senderId: '0x04f3c8...7d1e02' })}
      ${msg('Marcus', 'M', '#26A69A', '10:36', 'About 3 hours with two agents running — builder writes code, auditor verifies against QML. Cost maybe $25 in API tokens.', { reactions: ['✅ 2*', '🎉 1'], delivery: 'delivered', edited: true, senderId: '0x04d7e1...a92b05' })}
      ${msg('You', 'A', '#4360DF', '10:38', 'Font schemes too — switch between Inter, IBM Plex, Serif, Monospace from a dropdown. Layout holds across all of them.', { delivery: 'sent' })}
    </div>
    <div class="chat-input">
      <div class="chat-input__row">
        <button class="chat-input__cmd-btn" title="Commands">${CHANNEL_ICONS.chatCommands}</button>
        <div class="chat-input__box">
          <div class="chat-input__input-row">
            <textarea class="chat-input__field" placeholder="Type a message..." rows="1" readonly></textarea>
            <div class="chat-input__actions">
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

/* Message builder — supports all included StatusMessage sub-components:
   reply, pinned indicator, full header (name + delivery), text, reactions
   Options: { reactions, pinned, pinnedBy, reply, replyTo, replyText, delivery, edited, continued } */
function msg(name, initial, color, time, text, opts = {}) {
  const { reactions = [], pinned = false, pinnedBy = '', reply = false, replyTo = '', replyText = '', replyColor = '#D37EF4', replyInitial = '', delivery = '', edited = false, continued = false, ensName = '', senderId = '' } = opts
  const stateClass = pinned ? ' message--pinned' : ''

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
      <div class="message${stateClass}">
        ${pinnedHtml}${replyHtml}
        <div class="message__body message__body--continued">
          <div class="message__text">${text}${editedHtml}</div>
          ${reactionsHtml}
        </div>
      </div>
    `
  }

  return `
    <div class="message${stateClass}">
      ${pinnedHtml}${replyHtml}
      <div class="message__row">
        <div class="message__avatar" style="background:${color}">${initial}</div>
        <div class="message__body">
          <div class="message__header">
            <span class="message__sender">${name}</span>${headerDotsHtml}
            <span class="message__header-dot">•</span>
            <span class="message__time">${time}</span>
            ${deliveryHtml}
          </div>
          <div class="message__text">${text}${editedHtml}</div>
          ${reactionsHtml}
        </div>
      </div>
    </div>
  `
}

// Message-specific icons from StatusQ/src/assets/img/icons/
const MSG_ICONS = {
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
