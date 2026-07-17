# tools/ — Status fidelity gate

Scripts that make "recreate Status UI faithfully" mechanical. Run via the **`/status-fidelity`**
skill or `preflight.sh` before claiming a screen is done. Wired into `.claude/settings.json` as a
PreToolUse guard (`recreate-guard.sh`) that fires on edits to `src/screens/*.{js,css}`.

## Source layer (no app — catches call-site overrides + visibility gates)
| script | what |
|---|---|
| `qml-resolve.sh <C>` | full visual chain: base type + every instantiated child, recursively |
| `qml-states.sh <C>` | every `visible:`/`enabled:`/`hovered?` branch as a `[ ]` checklist |
| `qml-callsite.sh <C>` | every instantiation + props set there (catches unset-default-false gates + overrides) |
| `qml-icon.sh <name>\|--in <C>` | resolve `icon.name` → svg path to lift (don't hand-draw) |

## Render layer (diff vs a golden — catches color / position / layout / format)
| script | what |
|---|---|
| `sample-color.sh <png> x y [w h]` | core color of text/icon. Sample BOTH renders, compare hexes — never trust the token |
| `element-map.py map\|diff <png…>` | per-row elements with `x_frac` + `valign` (0=top,1=bottom). Catches intra-row offset bugs |
| `modal-profile.py profile\|diff <png…>` | color-band structure (missing/extra bands, wrong fill). Needs matched state |
| `screen-diff.py <mine> <golden> <out>` | side-by-side composite to eyeball layout/presence/format |

## Orchestration
| script | what |
|---|---|
| `preflight.sh <C…>` | runs the source layer + prints the render-layer checklist. **Run before "ready".** |
| `recreate-guard.sh` | PreToolUse hook (reads stdin JSON); reminds on screen-file edits. Non-blocking. |

## Golden sources
- **Live app** — running Status Desktop, native-res crop (best for dark assembled states).
- **Storybook** — Sneg `/home/sher/sb-shot.sh <Page> dark out.png` (grabWindow patch captures popups/overlays;
  dark-toggle doesn't reach the modal → use for structure + light theme).
- **Tokens** — parse `themepalette.cpp`+`statuscolors.h`+`theme.cpp` for exact color/spacing.

Deps: python3 + PIL + numpy + scipy (all present). No OCR/cv2 needed. See `../FIDELITY-FINDINGS.md`, `../USE-CASES.md`.
