#!/usr/bin/env bash
# qml-callsite.sh <ComponentName>
#
# Finds every place <Component> is INSTANTIATED and prints the property block set at each
# call site. Use to trace GATING props down the chain: a feature can exist in a leaf
# component but be turned OFF (or never enabled) by a prop at the call site.
#
# Lived cost: built a fiat/crypto toggle from AmountToSend's conditionals, but the swap
# call site never sets `fiatInputInteractive` (defaults false) → the toggle is disabled in
# swap. Run this on the leaf, then on each caller, until you know the prop's real value here.
#
# Workflow: qml-callsite.sh AmountToSend   → SwapInputPanel sets fiatInputInteractive: root.…
#           qml-callsite.sh SwapInputPanel → SwapModal payPanel does NOT set it → false.

set -uo pipefail
SRC="${QML_SRC:-/home/alisher/status-app-src/ui}"
COMP="${1:?usage: qml-callsite.sh <ComponentName>}"

# files that instantiate `COMP {`
mapfile -t HITS < <(grep -rlE "^[[:space:]]*${COMP}[[:space:]]*\{" "$SRC" --include=*.qml 2>/dev/null | grep -v '/build/')

[[ ${#HITS[@]} -eq 0 ]] && { echo "no call sites found for: $COMP"; exit 0; }

for f in "${HITS[@]}"; do
  # extract each `COMP { ... }` block via brace matching; print only top-level `prop:` lines
  awk -v comp="$COMP" -v file="${f#"$SRC"/}" '
    $0 ~ "^[[:space:]]*" comp "[[:space:]]*\\{" && depth==0 {
      print "──────── " file ":" NR " ────────"
      depth=1; inblock=1; next
    }
    inblock {
      n=gsub(/\{/,"{"); m=gsub(/\}/,"}"); depth+=n-m
      if (depth<=0) { inblock=0; print ""; next }
      # top-level (depth==1) property assignments only
      if (depth==1 && $0 ~ /^[[:space:]]*[a-zA-Z_][a-zA-Z0-9_.]*[[:space:]]*:/)
        { sub(/^[[:space:]]+/,""); print "    " $0 }
    }
  ' "$f"
done
echo "────────────────────────────────────────────"
echo "RULE: for any state/gating prop NOT set above, trace it to the next caller — an unset"
echo "boolean defaults false. Do not implement a branch gated by a prop that is false here."
