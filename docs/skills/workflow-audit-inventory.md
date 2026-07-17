# Skill: Writing Audit-Passable Component Inventories

## Lesson source
Two consecutive FAIL audits on the community channel inventory (2026-04-06).

## What went wrong

### FAIL 1: Three independent errors
1. **Gap-only scope** — Inventoried only broken components from pause.md instead of every component on screen. The auditor requires a full screen inventory, not a delta.
2. **Wrong wiring context** — Described StatusChatInfoButton in isolation without reading how the parent (ColumnHeaderPanel.qml) wires its properties. ColumnHeaderPanel sets `type: OneToOneChat` (hides type icon) and never binds `pinnedMessagesCount` (hides pin controls). The center panel's ChatHeaderContentView has different wiring where those ARE visible.
3. **Wrong resolved value** — Assumed reply avatar was 36×36 (the main message avatar size) without reading MessageView.qml where the reply avatar is explicitly set to 20×20. `profileImage.height/2` = 10px, not 18px.

### FAIL 2: Incomplete conditional coverage
4. **Silent omission of conditional components** — Listed only "interesting" components and skipped loaders/children that would be EXCLUDE'd. The auditor requires an explicit INCLUDE/EXCLUDE decision for EVERY child, including loading spinners, banners, admin-only buttons, blocked-state banners, contact request headers, etc.

## Rules extracted

1. **Full screen, not gap-only**: Every component on the screen gets an entry. Start from the top-level view file and walk every child/loader.
2. **Read the parent wiring, not just the component**: A component's behavior depends on how its parent binds properties. Always read the parent file to determine actual visibility of conditional sub-components.
3. **Resolve values from the actual call site**: When a property depends on another component's size (e.g., `profileImage.height/2`), trace the value to the file that instantiates the component (e.g., MessageView.qml), not the component's own default.
4. **No silent omissions**: Every Loader, conditional child, banner, loading indicator, popup trigger, etc. must appear in the inventory with an explicit INCLUDE or EXCLUDE and a reason. If it's invisible in the mockup state, say so with the condition that makes it invisible.
5. **Walk parent files systematically**: For each panel (left, center), open the top-level view file and enumerate every direct child in source order. Don't cherry-pick.
