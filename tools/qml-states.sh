#!/usr/bin/env bash
# qml-states.sh <ComponentName> [maxDepth=3]
#
# Walks a component's FULL visual chain (same as qml-resolve) and extracts every
# STATE-DEPENDENT conditional — ternaries and bindings gated on hovered / enabled /
# checked / pressed / down / activeFocus / focus / highlighted / selected / loading /
# visible / opacity, plus any `<prop> ? A : B`. Prints them as a checklist.
#
# Why: the recurring fail is implementing the DEFAULT branch of a conditional and
# dropping the others (the hover arrow, the disabled opacity, showIndicator:false, etc.).
# A branch you didn't read is a branch you didn't build. This makes them un-skippable:
# every line below is a state you MUST implement AND verify (forced-state screenshot).

set -uo pipefail
SRC="${QML_SRC:-/home/alisher/status-app-src/ui}"
ROOT="${1:?usage: qml-states.sh <ComponentName> [maxDepth]}"
MAXDEPTH="${2:-3}"
SELF="$(cd "$(dirname "$0")" && pwd)"

# Reuse the chain walk to get the file list (▶ Name → path lines).
mapfile -t FILES < <("$SELF/qml-resolve.sh" "$ROOT" "$MAXDEPTH" 2>/dev/null \
  | sed -nE 's/^▶ .*→[[:space:]]+(.+)$/\1/p')

STATE='hovered|enabled|checked|pressed|down|activeFocus|focus|highlighted|selected|loading'
n=0
for rel in "${FILES[@]}"; do
  f="$SRC/$rel"
  [[ -f "$f" ]] || continue
  # ternaries + state-gated visible/opacity/active/color bindings; drop comments/imports/qsTr-only
  while IFS=: read -r ln text; do
    [[ -z "$ln" ]] && continue
    n=$((n+1))
    printf '[ ] %s:%s  %s\n' "$rel" "$ln" "$(echo "$text" | sed -E 's/^[[:space:]]+//')"
  done < <(grep -nEi "(${STATE})[[:space:]]*\?|[?][^?]*:|(visible|opacity|active)[[:space:]]*:[^/]*(${STATE}|\?)" "$f" \
            | grep -vE '://|^\s*[0-9]+:\s*(//|\*|import )' )
done

echo "────────────────────────────────────────────────────────────"
echo "$n state-conditional line(s) for: $ROOT"
echo "RULE: implement EVERY branch above, and VERIFY each non-default state with a"
echo "forced-state screenshot (e.g. ?hover=… / a .hovering class). Tick each [ ]."
