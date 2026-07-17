#!/usr/bin/env bash
# qml-icon.sh <iconName>            — resolve a StatusQ icon NAME to its .svg and print it
# qml-icon.sh --in <ComponentName>  — list every icon reference in a component's chain,
#                                      each with the resolved .svg path
#
# Why: `icon.name: "swap"` / `statusIcon: "previous"` / `asset.name: "search"` reference an
# SVG by NAME — you must resolve the name to the file and LIFT the path, not hand-draw it.
# The recurring fail is drawing a generic glyph instead of the real asset (swap.svg cycle,
# clear.svg disc, search.svg magnifier).

set -uo pipefail
SRC="${QML_SRC:-/home/alisher/status-app-src/ui}"
ICONS="$SRC/StatusQ/src/assets/img/icons"
SELF="$(cd "$(dirname "$0")" && pwd)"

resolve() {  # icon name → file. icon.name resolves to the TOP-LEVEL icons dir first,
             # then subdirs (homepage/, network/, tiny/…), then anywhere.
  local n="$1" hit
  hit="$(find "$ICONS" -maxdepth 1 -name "$n.svg" 2>/dev/null | head -1)"
  [[ -z "$hit" ]] && hit="$(find "$ICONS" -name "$n.svg" 2>/dev/null | head -1)"
  [[ -z "$hit" ]] && hit="$(find "$SRC" -name "$n.svg" -not -path '*/build/*' 2>/dev/null | head -1)"
  printf '%s' "$hit"
}

if [[ "${1:-}" == "--in" ]]; then
  comp="${2:?usage: qml-icon.sh --in <Component>}"
  mapfile -t FILES < <("$SELF/qml-resolve.sh" "$comp" "${3:-3}" 2>/dev/null \
    | sed -nE 's/^▶ .*→[[:space:]]+(.+)$/\1/p')
  declare -A seen
  for rel in "${FILES[@]}"; do
    f="$SRC/$rel"; [[ -f "$f" ]] || continue
    grep -oEi '(icon\.name|statusIcon|asset\.name|iconName)[[:space:]]*:[[:space:]]*"[a-z0-9/_-]+"' "$f" \
      | grep -oE '"[^"]+"' | tr -d '"' | while read -r name; do
        base="${name##*/}"
        [[ -n "${seen[$base]:-}" ]] && continue
        seen[$base]=1
        sv="$(resolve "$base")"
        printf '  %-22s %s\n' "$name" "${sv:+${sv#"$SRC"/}}${sv:-(not found)}"
      done
  done
  exit 0
fi

name="${1:?usage: qml-icon.sh <iconName> | --in <Component>}"
f="$(resolve "${name##*/}")"
[[ -z "$f" ]] && { echo "icon '$name' not found under $ICONS"; exit 1; }
echo "▶ $name → ${f#"$SRC"/}"
cat "$f"; echo
echo "RULE: lift this path verbatim (recolor #000 → currentColor). Do not redraw it."
