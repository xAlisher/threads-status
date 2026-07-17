// Chat screen — community channel. Issue #1 ships a minimal placeholder that proves the harness
// (shell / routing / theme + viewport + version toggles) end-to-end. Faithful recreation of the
// message row, header, composer and reply patterns lands in issues #2–#6; threads in #7+.

const AV = (label, color) => `<span class="ch-msg__avatar" style="background:${color}">${label}</span>`

const SAMPLE = [
  { av: 'V', color: 'var(--misc-color-4)', name: 'Volo', time: '10:24', text: 'Where are we landing on the thread-view layout — side panel or full screen?' },
  { av: 'A', color: 'var(--misc-color-2)', name: 'Alisher', time: '10:26', text: 'Both — desktop gets a right side panel, mobile pushes a full-screen thread. Building the channel baseline first.' },
  { av: 'C', color: 'var(--misc-color-7)', name: 'carmen.eth', time: '10:31', text: 'Makes sense. Recreating the current chat faithfully before we add anything on top?' },
  { av: 'A', color: 'var(--misc-color-2)', name: 'Alisher', time: '10:32', text: 'Exactly. version=current is the faithful base, version=Threads is where the thread UI goes.' },
]

function renderChat(view, version) {
  const isThreads = version === 'revamp'
  const rows = SAMPLE.map(m => `
    <div class="ch-msg">
      ${AV(m.av, m.color)}
      <div class="ch-msg__body">
        <div class="ch-msg__head"><span class="ch-msg__name">${m.name}</span><span class="ch-msg__time">${m.time}</span></div>
        <div class="ch-msg__text">${m.text}</div>
      </div>
    </div>`).join('')

  const center = `
    <div class="ch">
      <div class="ch-header">
        <div class="ch-header__info">
          <span class="ch-header__hash">#</span>
          <div class="ch-header__titles">
            <span class="ch-header__title">general</span>
            <span class="ch-header__sub">Status community · thread designs &amp; reviews</span>
          </div>
        </div>
        <div class="ch-header__actions">
          <span class="ch-scaffold-badge">${isThreads ? 'version = Threads' : 'version = Current'} · ${view}</span>
        </div>
      </div>

      <div class="ch-list">
        <div class="ch-daysep"><span>Today</span></div>
        ${rows}
      </div>

      <div class="ch-composer">
        <div class="ch-composer__box">
          <span class="ch-composer__placeholder">Message #general</span>
        </div>
      </div>

      <div class="ch-scaffold-note">
        Harness scaffold (issue&nbsp;#1). Toggle <b>Current&nbsp;⇄&nbsp;Threads</b>, <b>Dark&nbsp;⇄&nbsp;Light</b>,
        <b>Desktop&nbsp;⇄&nbsp;Mobile</b> to confirm the shell. Faithful message row / header / composer land in #2–#6.
      </div>
    </div>`

  return { center }
}

function bindChat(/* view, version */) {
  // no interactions in the scaffold yet
}

export { renderChat, bindChat }
