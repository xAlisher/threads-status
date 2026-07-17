#!/usr/bin/env bash
# PreToolUse guard (Edit|Write). Reads the hook JSON on stdin; if the target is a screen
# file in this prototype, emits a reminder to recreate from source (resolve the full
# component chain, cite source lines) instead of guessing dimensions.
#
# Wired in .claude/settings.json. Non-blocking: always exits 0.

input="$(cat)"
path="$(printf '%s' "$input" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))' 2>/dev/null)"

case "$path" in
  *"/status-token-swap-send/src/screens/"*.css | *"/status-token-swap-send/src/screens/"*.js)
    cat <<'MSG' >&2
RECREATE-FROM-SOURCE GUARD:
  Editing a Status screen recreation. Before setting any px/color/font/radius:
  1. Full chain:        tools/qml-resolve.sh  <Component>   (base + every control)
  2. State branches:    tools/qml-states.sh   <Component>   (impl EVERY branch)
  3. Call-site props:   tools/qml-callsite.sh <Component>   (is the branch even ON here?
                        a prop unset = false = feature OFF — don't build it)
  4. Icon names→SVG:    tools/qml-icon.sh --in <Component>  (lift the path, don't draw)
  5. Custom Shapes: replicate (mask/clip-path/svg) or tag // APPROXIMATED.
  6. Every value cites source file:line. Verify render + each state (?hover=…).
  7. COLORS: sample pixels on BOTH renders, never trust the token —
     tools/sample-color.sh <live.png> x y  vs  tools/sample-color.sh <mine.png> x y
     Two hexes must agree. Token = intent, not render (they diverge: name token=white,
     renders #A8 gray). "Read the token, set it" is NOT a color check.
  8. POSITIONS: tools/element-map.py diff <mine.png> <golden.png>
     per-row element x_frac + valign — catches a symbol at the TOP vs baseline of a number
     (an intra-band shift color/band diffing can't see). Also screen-diff.py composite.
  >> One command for layers 1+2:  tools/preflight.sh <Component…>   ·   Skill: /status-fidelity
  Protocol: ~/fieldcraft/protocols/recreate-from-source.md
MSG
    ;;
esac
exit 0
