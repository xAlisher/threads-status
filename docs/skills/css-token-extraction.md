# Skill: CSS Token Extraction from tokens.json

## Source structure
`tokens.json` has these sections:
- `colors.raw` — raw palette values (not mode-specific)
- `colors.hovered` — hover state palette
- `colors.semantic.light/dark` — semantic tokens (base, primary, danger, etc.)
- `colors.customisation.light/dark` — brand/avatar colors
- `colors.privacy.light/dark` — privacy-specific palette
- `colors.component.light/dark` — component-specific tokens (nav bar bg, modal bg, etc.)
- `typography` — font families, sizes, weight
- `spacing` — padding scale, radius, breakpoints, animation, opacity

## Naming convention
JSON camelCase → CSS kebab-case:
- `baseColor1` → `--base-color-1`
- `primaryColor1` → `--primary-color-1`
- `statusAppNavBar.backgroundColor` → `--app-nav-bar-bg`

## Token scoping
```css
[data-tokens="current"][data-mode="light"] { ... }
[data-tokens="concept"][data-mode="dark"] { ... }
```

## What to include
- ALL semantic colors (base, primary, danger, warning, success, mention, pin, direct, indirect, misc)
- ALL surface/component tokens (background, border, separator, card, nav, modal, etc.)
- Privacy tokens
- Typography (families + size scale)
- Spacing (padding scale + radius)
- Hover colors from raw palette
- Opacity values

## Shadow handling
Tokens with `alpha` field need `rgba()` in CSS since hex+alpha isn't universally supported for box-shadow:
- `dropShadow` with alpha 0.03 → `rgba(0, 34, 51, 0.03)`

## Typography note
tokens.json uses `InterStatus` for mono family but we use `Roboto Mono` per brand strategy direction.
