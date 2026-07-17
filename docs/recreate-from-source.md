# Recreate From Source (no guessing)

When the user says "recreate from source", "match the live app", or "build component X
faithfully", the output must be **traceable to source, not invented**. Every pixel, color,
font, radius, and padding in the recreation must cite the exact source line it came from. If a
value isn't in the source you read, you haven't read enough source yet — you're guessing.

This is `source-over-summaries` applied to UI components, one level deeper: the failure isn't
working from a summary, it's working from **one file** when the real values live in the
component's inherited base type and the controls it instantiates.

**Reframe (the lesson behind ~7 repeats):** a UI component is a **tree of conditionals over a chain
of base components**, not a flat list of values. Each conditional — a `hovered ?`/`enabled ?` state,
a call-site prop (`showSelectionIndicator:false`, an unset `fiatInputInteractive` defaulting false),
an `icon.name` → asset, a custom `Shape` — is a branch you must enumerate and build, or explicitly
verify is OFF here. Building the default branch and stopping is the recurring fail. The four tools
below make the enumeration mechanical so it doesn't depend on remembering.

## The rule

A framework component (QML `StatusListItem`, a React component, a Compose `@Composable`, etc.)
gets its real dimensions from THREE places, not one:
1. **The named file** (e.g. `NetworkSelectItemDelegate.qml`) — the overrides.
2. **Its base type** (`StatusListItem`) — the default layout, paddings, fonts.
3. **The controls it instantiates** (`StatusRadioButton`, `StatusDropdown`) — sub-element specs.

Reading only #1 means #2 and #3 are guessed. That is the bug.

## Preflight gate (run it yourself BEFORE asking for review)

The misses that reach the user are not capability gaps — they're skipped steps. Two layers,
both mechanical, catch the recurring classes. Run `tools/preflight.sh <Components…>` (in the
status prototype repo) before declaring a screen ready:

- **Source layer** — `qml-callsite.sh` + `qml-states.sh` per component. Catches the two classes
  pure base-component reading misses: **call-site overrides** (a filled `background:` set where the
  button is instantiated, overriding the base — e.g. SimpleSendModal's MaxSendButton) and
  **visibility gates** (`visible: … && canPaste`, an unset `fiatInputInteractive`). If you only read
  the base type you will ship the wrong default.
- **Render layer** — `tools/screen-diff.py mine.png golden.png out.png` composites your render beside
  a golden so **layout / position / presence / text-format** diffs are obvious (symbol on the wrong
  side, a button that should be absent, "$" vs "USD") — then `sample-color.sh` for colors on BOTH.
  Golden source: the **live app** for assembled/populated states (best when already in that state),
  **Storybook** for inline default-state components. Caveat: Storybook `grabToImage` captures only
  inline page content — dropdowns/popups/dialogs render in an overlay and are NOT captured, so most
  selector/modal components need the live app (or a harness upgrade to grab the overlay).

A difference in the composite, or a call-site override/gate you didn't replicate, is a finding to
fix NOW — not after the user points at it.

**Three layers, every time (2026-06-22):**
1. **Element POSITION, not just color.** Color/band diffing cannot see an offset *inside* one band
   (a currency symbol at the top vs the baseline of a number). Use `element-map.py diff` (per-row
   element `x_frac` + `valign`). A QML layout value mistranslates silently: `AlignVCenter + topMargin`
   = CSS `align-items:center + margin-top`, NOT `flex-start + margin-top` (lands it at the top).
2. **Multi-oracle, reconciled.** No single source is sufficient. Real component render (Storybook —
   patch grabWindow to capture dialog overlays), the live app (dark/assembled states), an adversarial
   source audit, and parsed theme tokens — each catches what the others miss. When two conflict, go to
   the source and check *which file the component actually resolves to* (two same-named QML files bit us).
3. **The adversarial auditor must READ the files.** A sandboxed Codex/Senty run that can't open the
   recreation returns UNVERIFIABLE — wasted. Launch it with the repo in its workspace, or paste content.

And: never flip a use-case/finding to ✅ on build-success — only on render-observation.

## The process (do every step, in order)

0. **Start at the CALL SITE and trace every prop — `tools/qml-callsite.sh <Component>`.** It lists
   every instantiation with the props set there. Each prop flips conditionals deep in the chain,
   **both ways**: a prop set `false` disables a branch (`showSelectionIndicator:false` → no radio),
   AND a prop **never set** (defaults false) disables a feature that exists in the leaf
   (`fiatInputInteractive` is never set on the swap panels → the fiat/crypto toggle is OFF in swap).
   Trace each gating prop up the callers until you know its real value HERE. **Do not implement a
   branch gated by a prop that is false/unset in this context** — and do not skip a branch turned on.

0b. **Resolve every icon NAME to its SVG — `tools/qml-icon.sh --in <Component>`** (and
   `qml-icon.sh <name>` for one). `icon.name:"swap"` → `icons/swap.svg`; **lift the path verbatim**
   (recolor `#000`→`currentColor`). Never hand-draw a glyph that has a named asset (swap=cycle,
   clear=disc, search=magnifier). Note: a name can exist in multiple dirs — the top-level `icons/`
   wins over `icons/homepage/` etc.

0c. **Custom geometry is replicated, not approximated.** A `Shape`/path (e.g. the SwapInputPanel
   button cutout) is implemented with a real `mask`/`clip-path`/inline SVG — or explicitly flagged
   `// APPROXIMATED: <what>` so it's visible, never passed off as faithful.
1. **Resolve the full chain.** Run the chain resolver before writing anything:
   `tools/qml-resolve.sh <Component>` (in the status prototype repo) — it prints the named
   component plus its base type and every instantiated child, recursively. For non-QML stacks,
   do the equivalent: follow `extends`/imports until every visual value is in front of you.
2. **Build a values table.** One row per visual property you will set, each with the source
   `file:line` it came from. Example:
   `radio outer = 20px filled, directColor8 / primaryColor1 — StatusRadioButton.qml:34-39`.
   `account row height = 64 — WalletAccountListItem.qml:38`.

2b. **Extract the STATE branches — `tools/qml-states.sh <Component>`.** This lists every
   conditional in the chain (`hovered ? / enabled ? / checked ? / <prop> ?`, opacity, visible…)
   as a `[ ]` checklist. **Implement every branch, and VERIFY each non-default state with a
   forced-state screenshot** (a `?hover=…` deep-link or a `.hovering` class — never "looks
   right"). The recurring fail is shipping the DEFAULT branch and dropping `hovered`/`enabled`/
   call-site branches (the hover arrow, disabled opacity, `showSelectionIndicator:false`,
   `dropShadowEnabled:true`). A branch not on a ticked checklist line is a branch you skipped.
3. **Write the recreation** from the table. Comment non-obvious values with their source.
4. **Verify the rendered result** against a screenshot of the live app (verify-before-claiming).
   A `:hover`/state you can't screenshot must still cite the source algorithm (e.g. the C++
   `hoverColor()` = lighter(120)/darker(120)).

4c. **EVERY color is sampled from pixels, on BOTH renders — never claimed from the token.**
   The source color token is the *declared intent*, not the *rendered truth*; they diverge often
   (account-name token `directColor1`/white → renders `directColor4`/`#A8` gray; search-icon token
   `baseColor1`/gray → renders `directColor1`/white on focus). The check is mechanical, so do it:
   `tools/sample-color.sh <live-app.png> <x> <y>` and `tools/sample-color.sh <prototype.png> <x> <y>`,
   then compare the two hex values. "I read the token and set it" is NOT a color check and must
   never be reported as "colors match". A color is verified only when you have two sampled hexes
   that agree. This rule cost the user three catches (search icon, account name twice) — it is not
   optional and not a special case for "tricky" colors; apply it to every color you set.

## Smell test (you are guessing if…)

- You set a padding/size/color you did not read in a file this session.
- You recreated a component without reading its base type.
- A radio/checkbox/indicator/identicon is "close enough" rather than copied.
- The user says "looks different from the app" — that means an unread component in the chain.

> **Lived cost (2026-06-22).** Built the swap network + account dropdowns from the top-level
> delegates only. Radio drawn as a bordered ring (real: filled circle + white dot); account row
> 32px emoji + balance (real: 64px, 40px identicon, name + mono truncated address). User caught it
> twice. Cause: read `NetworkSelectItemDelegate`/`AccountSelector`, not their `StatusListItem` /
> `StatusRadioButton` / `WalletAccountListItem` bases. The resolver script now dumps the whole chain
> so there is nothing left to guess.
