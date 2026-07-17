# Skill: QML Reading Discipline — Lessons from 5 Passes of Rebuilding

## Incident 1: Visual structure missed (Pass 1)
Read PrimaryNavSidebar.qml but missed outer bg, container radius, button shapes, sizes.
**Root cause:** Read the parent but not the children. Assumed standard patterns.

## Incident 2: Content/items missed (Pass 2-3)
Sidebar had wrong buttons in wrong order. Missing Home, Swap, QR Scanner.
**Root cause:** QML separates VIEW from DATA. Read the view but never traced the model/adaptor chain.

## Incident 3: Approximated icons and omitted layout elements (Pass 4)
Hand-drawn SVGs instead of actual StatusQ icons. Skipped identicon, omitted category chevron.
**Root cause:** Drew approximations. Treated structural elements as optional.

## Incident 4: Complexity blindness (Pass 5)
StatusMessage.qml has 12+ conditional Loader sub-components. I built HTML with 4 elements (avatar, name, text, reactions), missing: reply connector, pinned indicator, verification badges, delivery status, hover toolbar, display name color (primaryColor1 not directColor1), edit mode, image/sticker branches, link previews, show-more, system messages.

**Root causes:**
- Read the parent component's layout properties but didn't count its children
- StatusMessage.qml has 12+ Loaders — each one renders a conditional sub-component. I saw them, noted the spacing/padding, and skipped them.
- No step in my process to audit "how many sub-components exist vs how many I'm building"
- Treated the component as simple because I wanted it to be simple

---

## THE PROCESS (4 layers, applied in order)

### Layer 0: Complexity audit (BEFORE anything else)
1. **Count all Loaders and conditional components** — if the QML has N sub-components and your planned HTML has fewer than N, STOP
2. **List every Loader's `active:` condition** — these define the visual states the component can be in
3. **For each Loader, name the component it loads** — this is your build checklist
4. **Decide scope explicitly** — if building a subset, document what's excluded and WHY (e.g. "edit mode omitted — not relevant for static styling mockup"). Never silently skip.
5. **If a component has >5 conditional sub-components, it's complex** — budget time accordingly, don't rush

### Layer 1: Visual structure (view)
1. **Read the full file** — every property binding, every Rectangle, every radius
2. **Follow every component reference** — read every child component file
3. **Trace every color binding** — through aliases/theme to actual hex values
4. **Check container nesting** — QML wraps content in Control/Rectangle for bg/radius
5. **Read implicitWidth/implicitHeight** — designed dimensions, not suggestions

### Layer 2: Content/data (model)
1. **Find every `model` / `required property var xxxModel`** — external data
2. **Trace to the adaptor/store** that populates it
3. **Enumerate ALL items** from the model source — don't assume
4. **Note sort order and conditional visibility**

### Layer 3: Assets (icons, images)
1. **Never draw approximate SVGs** — extract from `StatusQ/src/assets/img/icons/`
2. **Replace hardcoded colors** with `currentColor`
3. **If QML says `icon.name: "xyz"`** → read `xyz.svg`

---

## ANTI-PATTERNS (accumulated from all incidents)

1. **Starting from mental models** — "what does a chat app look like" instead of "what does the code say"
2. **Asking agents the wrong questions** — "what shape" instead of "what exists"
3. **Treating QML view as complete source** — content comes from models/adaptors
4. **Fixing appearance without questioning content** — polishing wrong buttons
5. **Complexity blindness** — reading a component with 12 Loaders and building 4 elements
6. **"For simplicity" shortcuts** — skipping elements shifts layout downstream
7. **Guessing dimensions** — radius 10 instead of 12, padding 2 instead of 4
8. **Drawing icons instead of extracting** — every freehand SVG is wrong

---

## CHECKLIST (must complete before writing ANY CSS/HTML)

### Audit
- [ ] Count all Loaders/conditional sub-components in target QML
- [ ] List each one with its `active:` condition
- [ ] Compare count against planned HTML — if mismatch, document exclusions explicitly

### View
- [ ] Read parent component fully
- [ ] Read ALL referenced child components
- [ ] List every Rectangle with color + radius
- [ ] List every dimension (width, height, padding, spacing)
- [ ] List every color binding for every state (normal, hover, active, mentioned, pinned, edit, etc.)
- [ ] Sketch container nesting structure

### Model
- [ ] Find and read ALL model sources (adaptors, stores, config)
- [ ] Enumerate exact items in any list/repeater
- [ ] Note sort order and conditional visibility

### Assets
- [ ] Find every `icon.name` reference → extract actual SVG from StatusQ
- [ ] Verify viewBox matches QML `icon.width`/`icon.height`
- [ ] All SVG colors → `currentColor`

### Final
- [ ] Every Loader accounted for (built or explicitly excluded with reason)
- [ ] Zero hand-drawn SVGs
- [ ] Zero guessed dimensions
- [ ] Only then write CSS + HTML
