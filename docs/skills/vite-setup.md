# Skill: Vite Project Setup

## Node version
- System node is 18.19.1 — too old for Vite 8+ (needs node >=20.19 or >=22.12)
- Installed fnm at `~/.local/share/fnm`, node 22 via `fnm install 22`
- Pinned with `.node-version` file in project root
- Every session must activate fnm before running pnpm/vite:
  ```bash
  export FNM_PATH="/home/alisher/.local/share/fnm"
  export PATH="$FNM_PATH:$PATH"
  eval "$(fnm env --shell bash)"
  ```

## Scaffolding in existing directory
- `pnpm create vite . --template vanilla` prompts interactively if files exist — hangs in non-interactive shells
- Workaround: scaffold in `/tmp/`, copy only package.json + .gitignore, write custom index.html/main.js

## Token file pattern
- All 4 token CSS files imported in main.js (empty placeholders until populated)
- Scoping via `[data-tokens][data-mode]` selectors on `<html>`
- `data-tokens="current"` / `data-tokens="concept"`, `data-mode="light"` / `data-mode="dark"`

## Dev server
- `pnpm dev` → localhost:5173
- Vite 8.0.4 starts in ~128ms
