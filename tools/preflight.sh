#!/usr/bin/env bash
# preflight.sh <Component> [<Component> ...]
#
# The proactive review gate — run BEFORE saying a screen is "ready", not after the user
# catches a bug. It runs the two layers that would have caught every Send miss:
#
#   LAYER 1 (source) — for each component, enumerate the things that live at the CALL SITE,
#     not the base type: call-site property overrides (a filled bg overriding the base button)
#     and visibility gates (`visible: ... && canPaste`, an unset `fiatInputInteractive`).
#     These are the override/gate class — invisible if you only read the base component.
#
#   LAYER 2 (render, reminder) — capture my render + a golden and diff them with
#     tools/screen-diff.py (layout/position/presence/format) and tools/sample-color.sh
#     (colors, both renders). Catches the symbol-on-wrong-side / button-should-be-absent /
#     "$" vs "USD" class that source-reading misses.
#
# Usage: bash tools/preflight.sh AmountToSend SendRecipientInput SendModalFooter

set -uo pipefail
SRC=/home/alisher/status-app-src/ui
cd "$(dirname "$0")"

echo "================ PREFLIGHT — source layer ================"
for C in "$@"; do
  echo
  echo "########## $C ##########"
  echo "--- call-site OVERRIDES (props/background set where it's instantiated) ---"
  bash qml-callsite.sh "$C" 2>/dev/null | grep -iE 'background|color:|visible:|enabled:|border|radius|font|====|────|\.qml:' | head -20
  echo "--- visibility/state GATES (visible/enabled conditionals — is the branch ON here?) ---"
  bash qml-states.sh "$C" 2>/dev/null | grep -iE 'visible:|enabled:|canPaste|Interactive|showSelection|dropShadow' | head -15
done

cat <<'NEXT'

================ PREFLIGHT — render layer (do these now) ================
  1. Capture my render:   chromium --headless --screenshot=/tmp/mine.png "<preview-url>?screen=..."
  2. Get a golden:        live-app crop  OR  ssh sher@snezhok /home/sher/sb-shot.sh <Page> dark out.png
  3. Composite + eyeball: python3 tools/screen-diff.py /tmp/mine.png /tmp/golden.png /tmp/diff.png
  4. Sample key colors:   tools/sample-color.sh /tmp/mine.png x y   vs   golden  (must agree)
  5. POSITIONS:           python3 tools/element-map.py diff /tmp/mine.png /tmp/golden.png
     (per-row element x_frac + valign — catches intra-row offset bugs like a symbol sitting at
      the TOP vs the baseline of a number, which band/color diffing cannot see. Cleanest on
      matched-state renders; on a single render, check that small elements have the expected
      valign, e.g. a currency symbol next to an amount should read valign ~0.7, not ~0.2.)
  A difference in the composite, a color mismatch, OR an element valign/x diff is a finding to
  FIX NOW — not after review.
NEXT
