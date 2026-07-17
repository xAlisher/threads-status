#!/usr/bin/env bash
# qml-resolve.sh <ComponentName> [maxDepth=3]
#
# Dumps a QML component AND its full visual chain (its base type + every instantiated
# child component it uses), recursively. Use this BEFORE recreating any Status component
# in the prototype: read the WHOLE chain, extract every dimension into a values table,
# then write CSS. No guessing — every value must trace to a line printed here.
#
# Why: recreating from the top-level delegate alone misses the base component
# (e.g. StatusListItem, StatusDropdown, StatusRadioButton) where the real paddings,
# sizes, fonts and backgrounds live. That produced dropdowns that "looked different".
#
# Env: QML_SRC overrides the source root (default: status-app checkout).

set -uo pipefail
SRC="${QML_SRC:-/home/alisher/status-app-src/ui}"
ROOT="${1:?usage: qml-resolve.sh <ComponentName> [maxDepth]}"
MAXDEPTH="${2:-3}"

findqml() { find "$SRC" -name "$1.qml" -not -path '*/build/*' 2>/dev/null | head -1; }

# Capitalized element types instantiated in a file (TypeName { ... ) — the visual children.
children() {
  grep -oE '(^|[^A-Za-z0-9_.])[A-Z][A-Za-z0-9]*[[:space:]]*\{' "$1" 2>/dev/null \
    | grep -oE '[A-Z][A-Za-z0-9]*' | sort -u
}

seen=" "
queue="$ROOT:0"
count=0
while [[ -n "$queue" ]]; do
  item="${queue%% *}"; rest="${queue#"$item"}"; queue="${rest# }"
  name="${item%%:*}"; depth="${item##*:}"
  case "$seen" in *" $name "*) continue ;; esac
  seen="$seen$name "
  f="$(findqml "$name")"
  [[ -z "$f" ]] && continue
  count=$((count+1))
  echo "════════════════════════════════════════════════════════════════"
  echo "▶ $name   (depth $depth)   →   ${f#"$SRC"/}"
  echo "════════════════════════════════════════════════════════════════"
  cat "$f"
  echo
  if (( depth < MAXDEPTH )); then
    while read -r c; do
      [[ -z "$c" ]] && continue
      [[ -n "$(findqml "$c")" ]] || continue
      case "$seen" in *" $c "*) ;; *) queue="$queue $c:$((depth+1))" ;; esac
    done < <(children "$f")
  fi
done
echo "════════════════════════════════════════════════════════════════"
echo "resolved $count component file(s) in the chain for: $ROOT"
echo "RULE: every px/color/font in the recreation must cite a line above."
