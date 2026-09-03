// THE thread glyph — single definition shared by every thread surface (in-chat card, channel-list
// row, context menu, hover quick-actions, composer toggle, thread header, Details tab, share modal).
//
// Net-new: the Status QML source has no thread concept, so this is design invention drawn in the
// Status line style (speech bubble + return arrow). Vadym's official icon replaces THIS STRING and
// nothing else — keep the 24x24 viewBox and `currentColor` so every call site keeps working.
export const THREAD_GLYPH = `<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a8.38 8.38 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13.5 9.5 11 12l2.5 2.5M11 12h3.2a2.3 2.3 0 0 1 0 4.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
