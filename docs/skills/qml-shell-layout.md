# Skill: QML Shell Layout → CSS Flexbox

## Source files
- `StatusSectionLayoutLandscape.qml` — three-column SplitView layout
- `PrimaryNavSidebar.qml` — icon-based nav bar

## Key dimensions from QML
- Nav sidebar content: 60px wide + 8px padding each side = 68px total (`implicitWidth: 60 + leftPadding + rightPadding`)
- Left panel: 306px default (`defaultLeftPanelWidth: 306`)
- Right panel: 250px default, min 58px
- Center panel: fills remaining space (min 300px)
- Nav button size: 44×44px with 8px radius
- Nav separator: 16px wide × 1px, color `baseColor1`
- Nav spacing/gap: 8px (`Theme.defaultHalfPadding`)

## Background colors
- Nav sidebar: `statusAppNavBar.backgroundColor` (light: #ECEFFB, dark: #373737)
- Left panel: `baseColor4` (light: #F6F8FA, dark: #252525)
- Center panel: `statusAppLayout.rightPanelBackgroundColor` (light: #FFFFFF, dark: #2C2C2C)
- Right panel: `baseColor4`

## CSS layout
```css
.shell { display: flex; }
.shell__nav { width: 68px; flex-direction: column; }
.shell__left { width: 306px; }
.shell__center { flex: 1; min-width: 300px; }
.shell__right { width: 250px; }
```

## Nav sidebar structure
Column layout: regular items → separator → communities → separator → bottom items → profile avatar.
Community buttons use border instead of solid bg when active (`border: 2px solid primaryColor1`).

## Presentation layer
- Fixed toolbar at top with: token selector, mode selector, screen tabs, side-by-side toggle
- Side-by-side uses two `.shell` containers with different `data-tokens` attributes
- Labels: "Current Design" / "Concept A — Warm Minimalism"
