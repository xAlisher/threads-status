// Status Threads — conversation-threads prototype (epic status-im/status-app#21090)
// Base ported from status-redesign ("QML-to-vanilla for Status"): the faithful, audited
// Community Channel chat recreation + the Status shell + the ORIGINAL Status theme.
// version=current = that faithful base; version=Threads = the thread UI layered on top.

// Tokens (original Status theme only)
import './tokens/current-light.css'
import './tokens/current-dark.css'
import './tokens/fonts.css'

// Shell
import './shell/shell.css'

// Screens
import './screens/community-channel.css'
import './screens/threads.css'
import { renderCommunityChannel, bindCommunityChannel } from './screens/community-channel.js'
import { renderThreads, bindThreads } from './screens/threads.js'
import { subscribe } from './thread-store.js'

// --- Theme registry (original Status light/dark only) ---
const themes = {
  'current-dark':  { label: 'Dark',  tokens: 'current', mode: 'dark' },
  'current-light': { label: 'Light', tokens: 'current', mode: 'light' },
}

// --- Version registry: Current (faithful base) → Threads (the revamp we design) ---
const versions = {
  'current': { label: 'Current' },
  'revamp':  { label: 'Threads' },
}

// --- Screen registry ---
const screens = {
  'chat':    { label: 'Community channel', render: renderCommunityChannel, bind: bindCommunityChannel },
  'threads': { label: 'Threads',           render: renderThreads,          bind: bindThreads },
}

// --- State (overridable via URL: ?screen=chat&theme=light&view=mobile&version=revamp) ---
const params = new URLSearchParams(location.search)
let currentScreen = screens[params.get('screen')] ? params.get('screen') : 'chat'
let currentTheme = params.get('theme') === 'light' ? 'current-light' : 'current-dark'
let currentView = params.get('view') === 'mobile' ? 'mobile' : 'desktop'
let currentVersion = versions[params.get('version')] ? params.get('version') : 'current'
const verFor = () => currentVersion

function applyTheme(tokens, mode) {
  document.documentElement.setAttribute('data-tokens', tokens)
  document.documentElement.setAttribute('data-mode', mode)
}

function render() {
  const { tokens, mode } = themes[currentTheme]
  applyTheme(tokens, mode)

  const app = document.querySelector('#app')
  const screenFn = screens[currentScreen].render

  if (currentView === 'mobile') {
    app.innerHTML = `
      <div class="presentation">
        ${renderToolbar()}
        <div class="presentation__main">
          <div class="presentation__screen-area" style="justify-content:center;background:var(--base-color-5)">
            <div class="phone-frame">
              <div class="phone-frame__notch"></div>
              <div class="phone-frame__screen">
                <div class="shell shell--mobile" id="main-shell"></div>
              </div>
              <div class="phone-frame__home"></div>
            </div>
          </div>
        </div>
      </div>
    `
    document.getElementById('main-shell').innerHTML = renderMobileShellInner(screenFn)
  } else {
    app.innerHTML = `
      <div class="presentation">
        ${renderToolbar()}
        <div class="presentation__main">
          <div class="presentation__screen-area">
            <div class="shell" id="main-shell"></div>
          </div>
        </div>
      </div>
    `
    document.getElementById('main-shell').innerHTML = renderShellInner(screenFn)
  }

  bindToolbarEvents()
  renderReviewBanner()
}

function renderShellInner(screenFn) {
  const { nav, left, center, right } = screenFn(currentView, verFor())
  return `
    ${nav || ''}
    ${left ? `<div class="shell__left">${left}</div>` : ''}
    <div class="shell__center">${center}</div>
    ${right ? `<div class="shell__right">${right}</div>` : ''}
  `
}

function renderMobileShellInner(screenFn) {
  const { center } = screenFn(currentView, verFor())
  return `
    <div class="shell__mobile-content">${center}</div>
    ${mobileTabs()}
  `
}

// Mobile bottom tab bar (ported from status-redesign — Messages active)
function mobileTabs() {
  return `
    <div class="shell__mobile-tabs">
      <button class="shell__mobile-tab active" title="Messages"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2.3C17.36 2.3 21.7 6.64 21.7 12V18C21.7 20.04 20.04 21.7 18 21.7H12C6.64 21.7 2.3 17.36 2.3 12C2.3 6.64 6.64 2.3 12 2.3Z" stroke="currentColor" stroke-width="1.4"/></svg></button>
      <button class="shell__mobile-tab" title="Communities"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 21C11 18.35 12.05 15.8 13.93 13.93C15.8 12.05 18.35 11 21 11M7 21C7 17.29 8.47 13.73 11.1 11.1C13.73 8.48 17.29 7 21 7M15.47 18.66C15.77 17.96 16.2 17.31 16.76 16.76C17.31 16.21 17.96 15.77 18.66 15.47C19.95 14.93 20.6 14.65 20.8 14.35C21 14.05 21 13.57 21 12.6V5.4C21 4.24 21 3.67 20.59 3.31C20.18 2.95 19.66 3.02 18.61 3.16C10.54 4.21 4.21 10.54 3.15 18.61C3.02 19.66 2.95 20.18 3.31 20.59C3.67 21 4.24 21 5.4 21H12.6C13.57 21 14.05 21 14.35 20.8C14.65 20.6 14.93 19.95 15.47 18.66Z" stroke="currentColor" stroke-width="1.4"/></svg></button>
      <button class="shell__mobile-tab" title="Wallet"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 1.8C14.13 1.8 15.84 1.86 17.19 2.1C18.55 2.34 19.63 2.77 20.43 3.57C21.23 4.37 21.66 5.45 21.9 6.81C22.12 8.03 22.18 9.54 22.19 11.38C22.2 11.5 22.2 11.66 22.2 12C22.2 12.36 22.19 14.4 21.9 17.19C21.66 18.55 21.23 19.63 20.43 20.43C19.63 21.23 18.55 21.66 17.19 21.9C15.84 22.14 14.13 22.2 12 22.2C9.87 22.2 8.16 22.14 6.81 21.9C5.45 21.66 4.37 21.23 3.57 20.43C2.77 19.63 2.34 18.55 2.1 17.19C1.86 15.84 1.8 14.13 1.8 12C1.8 9.87 1.86 8.16 2.1 6.81C2.34 5.45 2.77 4.37 3.57 3.57C4.37 2.77 5.45 2.34 6.81 2.1C8.16 1.86 9.87 1.8 12 1.8Z" stroke="currentColor" stroke-width="1.4"/></svg></button>
      <button class="shell__mobile-tab" title="Browser"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" stroke-width="1.4"/><path d="M9.99 10.55L8.55 15.33C8.53 15.4 8.6 15.47 8.67 15.45L13.94 14.02C13.98 14.01 14.01 13.98 14.02 13.94L15.45 8.69C15.47 8.61 15.39 8.54 15.32 8.57L10.05 10.48C10.02 10.49 9.99 10.52 9.99 10.55Z" stroke="currentColor" stroke-width="1.4"/></svg></button>
    </div>
  `
}

// --- Reviewer feedback harness (empty until Volo reviews; keyed by comment id) ---
const REVIEW_ISSUE = 'https://github.com/status-im/status-app/issues/21090#issuecomment-'
const REVIEW_CASES = [
  // { n: 1, cid: '<comment-id>', p: 'view=mobile&version=revamp', t: 'description' },
]
function reviewMenu() {
  if (!REVIEW_CASES.length) return ''
  const opts = REVIEW_CASES.map(c => `<option value="${c.cid}">${c.n}. ${c.t}</option>`).join('')
  return `<select class="presentation__toolbar-select" data-set-review title="Reviewer feedback"><option value="">Review…</option>${opts}</select>`
}
function renderReviewBanner() {
  document.querySelector('.volo-banner')?.remove()
  const cid = new URLSearchParams(location.search).get('review'); if (!cid) return
  const c = REVIEW_CASES.find(x => x.cid === cid); if (!c) return
  const el = document.createElement('div')
  el.className = 'volo-banner'
  el.innerHTML = `<span class="volo-banner__n">#${c.n}</span><span class="volo-banner__t">${c.t}</span><a class="volo-banner__lnk" href="${REVIEW_ISSUE}${c.cid}" target="_blank" rel="noopener">comment ↗</a><button class="volo-banner__x" title="Dismiss">✕</button>`
  el.querySelector('.volo-banner__x').addEventListener('click', () => el.remove())
  document.body.appendChild(el)
}

// --- Saved states (the "additional menu") ---
// Every state we walk through + sign off gets a persistent deep-link here, one click to reach + share.
// Grows as we build: base states now, thread states (indicator / thread view / index / …) as they land.
const USE_CASES = [
  { group: 'Base — Community channel (Current)', items: [
    { id: 'cc-dark',    label: 'Community channel · Dark · Desktop',  screen: 'chat', params: 'version=current&theme=dark&view=desktop' },
    { id: 'cc-light',   label: 'Community channel · Light · Desktop', screen: 'chat', params: 'version=current&theme=light&view=desktop' },
    { id: 'cc-mobile',  label: 'Community channel · Dark · Mobile',   screen: 'chat', params: 'version=current&theme=dark&view=mobile' },
    { id: 'cc-mobile-l',label: 'Community channel · Light · Mobile',  screen: 'chat', params: 'version=current&theme=light&view=mobile' },
    { id: 'cc-actions', label: 'Message hover quick-actions',         screen: 'chat', params: 'version=current&theme=dark&actions=1' },
    { id: 'cc-reply',   label: 'Composer · replying (reply preview)', screen: 'chat', params: 'version=current&theme=dark&reply=1' },
    { id: 'cc-fmt',     label: 'Composer · formatting toolbar',       screen: 'chat', params: 'version=current&theme=dark&fmt=1' },
  ]},
  { group: 'Threads — in chat (Threads)', items: [
    { id: 'th-menu',    label: 'Context menu · Reply in thread',      screen: 'chat', params: 'version=revamp&theme=dark&menu=thread' },
    { id: 'th-qa',      label: 'Composer · new-thread icon',          screen: 'chat', params: 'version=revamp&theme=dark&qa=thread' },
    { id: 'th-card',    label: 'In-chat thread card (live)',          screen: 'chat', params: 'version=revamp&theme=dark&thread=card' },
    { id: 'th-chlist',  label: 'Threads in the channel list',         screen: 'chat', params: 'version=revamp&theme=dark' },
    { id: 'th-panel',   label: 'Desktop · thread side-panel (reply in thread)', screen: 'chat', params: 'version=revamp&theme=dark&view=desktop&tpanel=t-m1&surface=channel' },
    { id: 'th-panel-c', label: 'Desktop · new-thread side-panel',     screen: 'chat', params: 'version=revamp&theme=dark&view=desktop&tpanel=create&surface=channel' },
  ]},
  { group: 'Threads — surfaces (Threads)', items: [
    { id: 'th-create',  label: 'Creating Thread · from a message',    screen: 'threads', params: 'version=revamp&theme=dark&tview=create&parent=cc-1&from=chat' },
    { id: 'th-view',    label: 'Thread view (parent + replies)',      screen: 'threads', params: 'version=revamp&theme=dark&tview=thread&t=t-m1&surface=channel&from=chat' },
    { id: 'th-copy',    label: 'Thread view · Send copy ON',          screen: 'threads', params: 'version=revamp&theme=dark&tview=thread&t=t-m1&surface=channel&copy=1' },
    { id: 'th-closed',  label: 'Thread view · closed',                screen: 'threads', params: 'version=revamp&theme=dark&tview=thread&t=t-release&surface=channel&from=list' },
    { id: 'th-group',   label: 'Thread view · group chat',            screen: 'threads', params: 'version=revamp&theme=dark&tview=thread&t=t-group&surface=group&from=list' },
    { id: 'th-dm',      label: 'Thread view · DM',                    screen: 'threads', params: 'version=revamp&theme=dark&tview=thread&t=t-dm&surface=dm&from=list' },
    { id: 'th-list',    label: 'Threads list (active + past)',        screen: 'threads', params: 'version=revamp&theme=dark&tview=list' },
    { id: 'th-list-g',  label: 'Threads list · group surface',        screen: 'threads', params: 'version=revamp&theme=dark&tview=list&surface=group' },
  ]},
]
function findUseCase(id) { for (const g of USE_CASES) { const u = g.items.find(i => i.id === id); if (u) return u } }
function useCaseMenu() {
  const opts = USE_CASES.map(g => {
    const items = g.items.map(u => `<option value="${u.id}">${u.label}</option>`).join('')
    return `<optgroup label="${g.group}">${items}</optgroup>`
  }).join('')
  if (!opts) return ''
  return `<select class="presentation__toolbar-select" data-set-usecase title="Saved states — jump to any signed-off state"><option value="">Saved states…</option>${opts}</select>`
}

function renderToolbar() {
  const themeOptions = Object.entries(themes).map(([key, { label }]) =>
    `<option value="${key}" ${currentTheme === key ? 'selected' : ''}>${label}</option>`).join('')
  const versionOptions = Object.entries(versions).map(([key, { label }]) =>
    `<option value="${key}" ${currentVersion === key ? 'selected' : ''}>${label}</option>`).join('')
  const screenBtns = Object.entries(screens).map(([key, { label }]) =>
    `<button class="${currentScreen === key ? 'active' : ''}" data-set-screen="${key}">${label}</button>`).join('')

  return `
    <div class="presentation__toolbar">
      <span class="presentation__toolbar-label">Status Threads</span>
      <div class="presentation__toolbar-group">${screenBtns}</div>
      <select class="presentation__toolbar-select" data-set-version title="Design version">${versionOptions}</select>
      <select class="presentation__toolbar-select" data-set-theme title="Theme">${themeOptions}</select>
      <select class="presentation__toolbar-select" data-set-view title="Viewport">
        <option value="desktop" ${currentView === 'desktop' ? 'selected' : ''}>Desktop</option>
        <option value="mobile" ${currentView === 'mobile' ? 'selected' : ''}>Mobile</option>
      </select>
      ${useCaseMenu()}
      ${reviewMenu()}
      <div class="presentation__toolbar-reason">Base = faithful Community Channel recreation (version=Current, ported from status-redesign). Threads UI lands under version=Threads.</div>
    </div>
  `
}

function bindToolbarEvents() {
  const themeSelect = document.querySelector('[data-set-theme]')
  if (themeSelect) themeSelect.addEventListener('change', (e) => { currentTheme = e.target.value; render() })

  const viewSelect = document.querySelector('[data-set-view]')
  if (viewSelect) viewSelect.addEventListener('change', (e) => { currentView = e.target.value; render() })

  const versionSelect = document.querySelector('[data-set-version]')
  if (versionSelect) versionSelect.addEventListener('change', (e) => { currentVersion = e.target.value; render() })

  // Saved states — deep-link to a signed-off state (full reload with its params)
  const ucSelect = document.querySelector('[data-set-usecase]')
  if (ucSelect) ucSelect.addEventListener('change', (e) => {
    const uc = findUseCase(e.target.value); if (!uc) return
    const p = new URLSearchParams()
    p.set('screen', uc.screen)
    if (uc.params) uc.params.split('&').forEach(kv => { const [k, v] = kv.split('='); if (k) p.set(k, v) })
    location.search = p.toString()
  })

  const reviewSelect = document.querySelector('[data-set-review]')
  if (reviewSelect) reviewSelect.addEventListener('change', (e) => {
    const c = REVIEW_CASES.find(x => x.cid === e.target.value); if (!c) return
    const p = new URLSearchParams('screen=chat')
    p.set('theme', currentTheme === 'current-light' ? 'light' : 'dark')
    c.p.split('&').forEach(kv => { const [k, v] = kv.split('='); if (k) p.set(k, v) })
    p.set('review', c.cid)
    location.search = p.toString()
  })

  document.querySelectorAll('[data-set-screen]').forEach(btn => {
    btn.addEventListener('click', () => { currentScreen = btn.dataset.setScreen; render() })
  })

  const screen = screens[currentScreen]
  if (screen.bind) screen.bind(currentView, verFor())
}

// Boot — re-render in place whenever the thread store mutates (post reply, follow, close, …)
subscribe(() => render())
// View-only re-render (no store mutation, no reload): opening/closing the desktop thread panel
window.addEventListener('app:rerender', () => render())
render()

export { render }
