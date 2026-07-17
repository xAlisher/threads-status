# Recreating Status UI from QML source — fidelity checklist

## Problem
Building a faithful vanilla recreation of a Status wallet screen. Eyeballing measurements and
hand-drawing icons produces a near-miss that gets corrected round-by-round. The exact values and
assets already exist in the QML source — use them.

## Where things live (status-app checkout: `~/status-app-src/ui/`)
- **Screen QML**: `app/AppLayouts/Wallet/**` — `controls/`, `panels/`, `views/` (delegates),
  `popups/swap/`, `popups/simpleSend/`, `stores/`.
- **Design system**: `StatusQ/src/StatusQ/Controls/` (StatusInput, StatusBaseInput,
  StatusTabButton, StatusClearButton, StatusFlatRoundButton, …) — these carry the real
  sizes/colors/radii.
- **Theme tokens**: `StatusQ/src/StatusQ/Core/Theme/` + the per-mode CSS in this repo's
  `src/tokens/current-{light,dark}.css` (`--base-color-*`, `--direct-color-*`, `--primary-color-*`,
  `--radius`, padding vars).
- **Bundled assets** (don't fetch from the web): token PNGs at `StatusQ/src/assets/png/tokens/`
  (`SYMBOL@2x.png`, 80×80), network SVGs at `StatusQ/src/assets/img/icons/network/`, and named
  glyphs at `StatusQ/src/assets/img/icons/` (`search.svg`, `clear.svg`, `close-circle.svg`, …).

## Resolve the FULL chain first (tools/qml-resolve.sh)
A component's real values live in THREE places: the named file, its **base type**
(`StatusListItem`, `StatusDropdown`…), and the **controls it instantiates**
(`StatusRadioButton`, `StatusSmartIdenticon`…). Reading only the named file = guessing the rest.
```
tools/qml-resolve.sh NetworkSelectItemDelegate   # dumps base + children, recursively
```
Then build a values table (one row per property, each citing source `file:line`) BEFORE writing CSS.
Also run `tools/qml-states.sh <Component>` — it lists every state conditional (hovered/enabled/
checked/`<prop>?`) as a checklist; implement AND screenshot-verify every branch, not just the default.
A `.claude/settings.json` PreToolUse guard reminds on every screen edit. See
`~/fieldcraft/protocols/recreate-from-source.md`.

## Recipe (do this before drawing anything)
1. **Read the delegate + its base + its controls** (use qml-resolve) — the delegate has the row
   geometry (`implicitHeight`, `horizontalPadding`, `spacing`, `icon.width`); the base + controls
   have the rest (radio = filled 20px circle + 12px white dot; account row = 64px, 40px identicon,
   mono address subtitle — both missed when only the delegate was read).
2. **Grep every dimension**: `grep -nE "radius|implicit(Width|Height)|preferredWidth|preferredHeight|padding|spacing|width:|height:" <component>.qml`. Resolve `Theme.radius` etc. to the token value (radius = 8).
3. **Lift exact glyph paths** from the named SVGs (`search.svg`, `clear.svg`) instead of hand-drawing;
   recolor `fill="#000"` → `currentColor` so it themes.
4. **Trace color through state**: a control's asset/icon `color` default (e.g. `baseColor1`) can be
   overridden when focused/hovered/checked. The rendered color is the truth — verify against the
   running app (launch the AppImage, pixel-sample a screenshot), not the QML default.
5. **Copy real assets** into `public/icons/` and reference via `import.meta.env.BASE_URL`.

## Verified values (token selector, 2.38.0)
StatusDropdown width 448; TokenSelector `maxPopupHeight` 455; dialog radius `Theme.radius`=8;
asset row 60px, icon 32px, h-padding 16, spacing 8; TokenSearchBox 56px, input padding 14;
search/clear icons 24×24; StatusTabButton indicator fixed 24×2 radius 4, primaryColor1 (checked) /
primaryColor2 (hover); fiat format `"<amount> USD"` suffix; section headers shown in Swap selector
("Your assets"/"Assets"), flat owned-only in Send.

## See also
verify-before-claiming (source default ≠ rendered truth), source-over-summaries (look up every dimension).
