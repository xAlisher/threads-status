# Skill: Project Setup Decisions

## Why HTML/CSS/JS (not Pencil/Penpot)
- AI reads/writes code directly — no encrypted formats or tool-mediated opacity
- CSS custom properties = design tokens — swap entire palette by toggling one data attribute
- Vite hot-reload gives instant feedback in Chromium
- Git-trackable diffs for every iteration
- User sees results in browser, gives feedback, AI edits tokens/CSS, browser refreshes

## Toolchain
- **pnpm** 10.32.1 (already installed at `~/.npm-global/bin/pnpm`)
- **node** 18.19.1 (system)
- **Vite** vanilla template — no frameworks
- **Chromium** at `/snap/bin/chromium` — used for visual review
- **Google Fonts** via CDN `<link>` (Inter + Roboto Mono) — offline not required

## Token architecture
- CSS custom properties scoped via `[data-tokens="current"][data-mode="light"]`
- 4 token files: `current-light.css`, `current-dark.css`, `concept-light.css`, `concept-dark.css`
- Switching = toggling `data-tokens` and `data-mode` attributes on `<html>`
- Source of truth: `/home/alisher/designer/status-app/tokens.json`

## Icon strategy
- **Rebuilding phase**: pixel-perfect reproduction — extract/tokenize icons from status-desktop SVGs
- **Styling phase**: experiment with applying other open-source icon sets
- Two distinct phases, don't mix them

## Stakeholder
- Alisher reviews all work directly (Senty not involved in this project)
- Ask Alisher before approval-triggering commands (pnpm install, etc.)

## File locations confirmed
- Brand strategy PDF: `/home/alisher/status-redesign/Brand Strategy_ Status .pdf`
- Design tokens: `/home/alisher/designer/status-app/tokens.json`
- QML sources: `/home/alisher/status-desktop/ui/` — all 15 referenced files verified present
