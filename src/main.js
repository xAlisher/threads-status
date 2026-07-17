// Status Threads — conversation-threads vanilla prototype (epic status-im/status-app#21090)
// Shell templated from the Swap prototype (xAlisher/status-token-swap-send): Status light/dark
// tokens + a desktop/mobile viewport switch + a version toggle (current baseline → threads revamp).

// Tokens
import './tokens/current-light.css'
import './tokens/current-dark.css'
import './tokens/fonts.css'

// Shell
import './shell/shell.css'

// Screen styles
import './screens/chat.css'

// Screen HTML generators
import { renderChat, bindChat } from './screens/chat.js'

// --- Theme registry (Status current light/dark) ---
const themes = {
  'current-dark':  { label: 'Dark',  tokens: 'current', mode: 'dark' },
  'current-light': { label: 'Light', tokens: 'current', mode: 'light' },
}

// --- Screen registry ---
const screens = {
  'chat': { label: 'Chat', render: renderChat, bind: bindChat },
}

// --- Version registry ---
// "Current" = faithful recreation of the live Status chat. "Threads" = the revamp we design on top.
const versions = {
  'current': { label: 'Current' },
  'revamp':  { label: 'Threads' },
}

// --- State (overridable via URL: ?screen=chat&theme=light&view=mobile&version=revamp) ---
const params = new URLSearchParams(location.search)
let currentScreen = screens[params.get('screen')] ? params.get('screen') : 'chat'
let currentTheme = params.get('theme') === 'light' ? 'current-light' : 'current-dark'
let currentView = params.get('view') === 'mobile' ? 'mobile' : 'desktop'
let currentVersion = versions[params.get('version')] ? params.get('version') : 'current'
const verFor = () => currentVersion

// --- Apply theme to DOM ---
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

// Click-through use cases — deep-links to a screen's entry state (grows as we add thread states).
const USE_CASES = [
  { group: 'Chat', items: [] },
]
function findUseCase(id) { for (const g of USE_CASES) { const u = g.items.find(i => i.id === id); if (u) return u } }

// Reviewer feedback harness (reused from the swap prototype). Each entry = one addressed review
// comment → a persistent deep-link that sets the demonstrating state + an on-screen banner linking
// back to the source comment. Empty until Volo reviews; keyed by comment id (numbering can dup).
const REVIEW_ISSUE = 'https://github.com/status-im/status-app/issues/21090#issuecomment-'
const REVIEW_CASES = [
  // { n: 1, cid: '<comment-id>', p: 'view=mobile&version=revamp', t: 'description' },
]
function reviewMenu() {
  if (!REVIEW_CASES.length) return ''
  const opts = REVIEW_CASES.map(c => `<option value="${c.cid}">${c.n}. ${c.t}</option>`).join('')
  return `<select class="presentation__toolbar-select" data-set-review title="Reviewer feedback — jump to each addressed item"><option value="">Review…</option>${opts}</select>`
}
function renderReviewBanner() {
  document.querySelector('.volo-banner')?.remove()
  const cid = new URLSearchParams(location.search).get('review'); if (!cid) return
  const c = REVIEW_CASES.find(x => x.cid === cid); if (!c) return
  const el = document.createElement('div')
  el.className = 'volo-banner'
  el.innerHTML = `<span class="volo-banner__n">#${c.n}</span><span class="volo-banner__t">${c.t}</span><a class="volo-banner__lnk" href="${REVIEW_ISSUE}${c.cid}" target="_blank" rel="noopener">comment ↗</a><button class="volo-banner__x" title="Dismiss" aria-label="Dismiss">✕</button>`
  el.querySelector('.volo-banner__x').addEventListener('click', () => el.remove())
  document.body.appendChild(el)
}

function renderToolbar() {
  const themeOptions = Object.entries(themes).map(([key, { label }]) =>
    `<option value="${key}" ${currentTheme === key ? 'selected' : ''}>${label}</option>`
  ).join('')

  const screenBtns = Object.entries(screens).filter(([, s]) => !s.secondary).map(([key, { label }]) =>
    `<button class="${currentScreen === key ? 'active' : ''}" data-set-screen="${key}">${label}</button>`
  ).join('')

  const versionOptions = Object.entries(versions)
    .map(([key, { label }]) => `<option value="${key}" ${currentVersion === key ? 'selected' : ''}>${label}</option>`)
    .join('')

  const useCaseOptions = USE_CASES
    .flatMap(g => g.items)
    .filter(u => (u.flow || u.screen) === currentScreen)
    .map(u => `<option value="${u.id}">${u.label}</option>`).join('')

  const collapsed = localStorage.getItem('th-toolbar-collapsed') === '1'
  return `
    <div class="presentation__toolbar${collapsed ? ' collapsed' : ''}">
      <div class="presentation__toolbar-body">
        <span class="presentation__toolbar-label">Status Threads</span>
        <div class="presentation__toolbar-group">${screenBtns}</div>
        <span class="presentation__toolbar-separator"></span>
        <select class="presentation__toolbar-select" data-set-version title="Design version">${versionOptions}</select>
        ${useCaseOptions ? `<select class="presentation__toolbar-select" data-set-usecase title="Jump to a clickable use case"><option value="">Use case…</option>${useCaseOptions}</select>` : ''}
        ${reviewMenu()}
        <span class="presentation__toolbar-separator"></span>
        <select class="presentation__toolbar-select" data-set-theme title="Theme">${themeOptions}</select>
        <select class="presentation__toolbar-select" data-set-view title="Viewport">
          <option value="desktop" ${currentView === 'desktop' ? 'selected' : ''}>Desktop</option>
          <option value="mobile" ${currentView === 'mobile' ? 'selected' : ''}>Mobile</option>
        </select>
      </div>
      <button class="presentation__toolbar-collapse" data-collapse title="Hide/show the toolbar" aria-label="Hide/show the toolbar">${collapsed ? '⌄ Controls' : '⌃ Hide'}</button>
    </div>
  `
}

function renderShellInner(screenFn) {
  const { nav, left, center, right } = screenFn(currentView, verFor())
  return `
    ${nav || renderNav()}
    ${left ? `<div class="shell__left">${left}</div>` : ''}
    <div class="shell__center">${center}</div>
    ${right ? `<div class="shell__right">${right}</div>` : ''}
  `
}

function renderMobileShellInner(screenFn) {
  const { center } = screenFn(currentView, verFor())
  return `<div class="shell__mobile-content">${center}</div>`
}

// Minimal Status nav rail (Messages active) for desktop context
function renderNav() {
  return `
    <div class="shell__nav">
      <div class="shell__nav-main">
        <div class="shell__nav-section">
          <button class="shell__nav-btn" title="Home">${icon('home')}</button>
          <button class="shell__nav-btn" title="Wallet">${icon('wallet')}</button>
          <button class="shell__nav-btn active" title="Messages">${icon('messages')}</button>
          <button class="shell__nav-btn" title="Browser">${icon('browser')}</button>
        </div>
        <div class="shell__nav-separator"></div>
        <div class="shell__nav-section shell__nav-section--grow">
          <button class="shell__nav-btn shell__nav-btn--community" title="Status Community">
            <span style="font-size:14px;font-weight:700">S</span>
          </button>
        </div>
        <div class="shell__nav-separator"></div>
        <div class="shell__nav-section">
          <button class="shell__nav-btn" title="Settings">${icon('settings')}</button>
        </div>
      </div>
      <div class="shell__nav-avatar" title="Profile">A<span class="status-dot"></span></div>
    </div>
  `
}

// --- Shared icon set (24x24 stroke, currentColor) ---
function icon(name) {
  const p = {
    home: '<path d="M11.31 3.68a1.1 1.1 0 0 1 1.38 0l7.5 6.43c.27.23.42.56.42.91V19.5c0 .66-.54 1.2-1.2 1.2H4.5c-.66 0-1.2-.54-1.2-1.2v-8.41c0-.35.15-.68.42-.91l7.5-6.43z" stroke="currentColor" stroke-width="1.4"/>',
    wallet: '<path d="M12 1.8c2.13 0 3.84.06 5.19.3 1.36.24 2.44.67 3.24 1.47s1.23 1.88 1.47 3.24c.24 1.35.3 3.06.3 5.19s-.06 3.84-.3 5.19c-.24 1.36-.67 2.44-1.47 3.24s-1.88 1.23-3.24 1.47c-1.35.24-3.06.3-5.19.3s-3.84-.06-5.19-.3c-1.36-.24-2.44-.67-3.24-1.47s-1.23-1.88-1.47-3.24C1.86 15.84 1.8 14.13 1.8 12s.06-3.84.3-5.19c.24-1.36.67-2.44 1.47-3.24S5.45 2.34 6.81 2.1C8.16 1.86 9.87 1.8 12 1.8Z" stroke="currentColor" stroke-width="1.4"/>',
    messages: '<path d="M12 2.3C17.36 2.3 21.7 6.64 21.7 12v6c0 2.04-1.66 3.7-3.7 3.7h-6C6.64 21.7 2.3 17.36 2.3 12S6.64 2.3 12 2.3Z" stroke="currentColor" stroke-width="1.4"/>',
    browser: '<path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="1.4"/><path d="M9.99 10.55 8.55 15.33c-.02.07.05.14.12.12l5.27-1.43c.04-.01.07-.04.08-.08l1.43-5.25c.02-.08-.06-.15-.13-.12l-5.27 1.91c-.03.01-.05.04-.06.07Z" stroke="currentColor" stroke-width="1.4"/>',
    settings: '<circle cx="12" cy="12" r="3.7" stroke="currentColor" stroke-width="1.4"/><path d="M19.5 12c0-.5-.05-1-.13-1.47l1.9-1.48-1.9-3.3-2.24 1.04c-.74-.62-1.6-1.1-2.53-1.4L14.1 2.5H9.9l-.4 2.4c-.94.3-1.8.78-2.53 1.4L4.73 5.26l-1.9 3.3 1.9 1.48C4.65 11 4.5 11.5 4.5 12s.05 1 .13 1.47l-1.9 1.48 1.9 3.3 2.24-1.04c.74.62 1.6 1.1 2.53 1.4l.4 2.4h4.2l.4-2.4c.94-.3 1.8-.78 2.53-1.4l2.24 1.04 1.9-3.3-1.9-1.48c.08-.47.13-.97.13-1.47Z" stroke="currentColor" stroke-width="1.4"/>',
  }
  return `<svg viewBox="0 0 24 24" fill="none">${p[name] || ''}</svg>`
}

// --- Toolbar events ---
function bindToolbarEvents() {
  const themeSelect = document.querySelector('[data-set-theme]')
  if (themeSelect) themeSelect.addEventListener('change', (e) => { currentTheme = e.target.value; render() })

  const viewSelect = document.querySelector('[data-set-view]')
  if (viewSelect) viewSelect.addEventListener('change', (e) => { currentView = e.target.value; render() })

  const versionSelect = document.querySelector('[data-set-version]')
  if (versionSelect) versionSelect.addEventListener('change', (e) => { currentVersion = e.target.value; render() })

  const ucSelect = document.querySelector('[data-set-usecase]')
  if (ucSelect) ucSelect.addEventListener('change', (e) => {
    const uc = findUseCase(e.target.value); if (!uc) return
    const p = new URLSearchParams()
    p.set('screen', uc.screen); p.set('theme', currentTheme); p.set('view', currentView); p.set('version', currentVersion)
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

  const collapseBtn = document.querySelector('[data-collapse]')
  if (collapseBtn) collapseBtn.addEventListener('click', () => {
    const tb = document.querySelector('.presentation__toolbar')
    const now = tb.classList.toggle('collapsed')
    localStorage.setItem('th-toolbar-collapsed', now ? '1' : '0')
    collapseBtn.textContent = now ? '⌄ Controls' : '⌃ Hide'
  })

  document.querySelectorAll('[data-set-screen]').forEach(btn => {
    btn.addEventListener('click', () => { currentScreen = btn.dataset.setScreen; render() })
  })

  const screen = screens[currentScreen]
  if (screen.bind) screen.bind(currentView, verFor())
}

// Boot
render()

export { render }
