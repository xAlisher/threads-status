# Skill: Detail Pass Discipline — Lessons from Swap Modal Review

## What happened
The detail pass plan focused only on the footer restructure, but Alisher's visual comparison against the live app revealed 4 additional mismatches that were never in the plan:

1. **Header looks different** — our mockup has title + "On:" + badge + close button in a bordered header. The real app has the title row inside the body (no border separator), with a different network filter control (dropdown with icon, not a small badge).
2. **No account selector** — the real app shows "Account 1" pill above the dialog. We excluded it in the inventory with a valid reason (floating above viewport), but the visual comparison shows it's clearly visible and part of the screen.
3. **Max button looks different** — the real app shows "Max. 0.009441" as a colored pill/link aligned right. Ours shows "Max: 4.2091" as plain text.
4. **Arrow button looks different** — the real app has a larger, more prominent circular button with a subtle border. Ours is smaller/simpler.

## Root cause
**The plan was written from a plan summary, not from comparing the actual live app against the mockup.** The plan listed specific fixes (footer restructure, exchange button bg, body padding, network badge, close hover) but never asked: "does the overall screen match?" It cherry-picked known deltas instead of doing a full visual comparison.

## Rules extracted

1. **Visual comparison first**: Before writing a detail-pass plan, compare the mockup side-by-side with the actual app (screenshot or live). Don't just re-read QML for known gaps.
2. **The plan is not the scope**: If Alisher's review reveals issues not in the plan, those are real issues. The plan was incomplete, not the screen.
3. **EXCLUDE ≠ invisible**: Just because a component is correctly EXCLUDED from the inventory (valid reason) doesn't mean it's invisible in the real app. If it's visible in the comparison screenshot, it needs to be addressed — either built or explicitly deferred with Alisher's agreement.
4. **Detail pass ≠ footer-only**: A detail pass should audit every visible element on the screen, not just the ones the plan mentioned.
5. **Compare against the actual live app, not just QML properties**: QML source gives exact dimensions and colors, but the spatial relationships, visual weight, and overall composition can only be verified by comparing the rendered output side-by-side with the real app. Multiple rounds of audit FAILs on the same screen (Swap Modal had 6+ code audit rounds) indicate the builder is fixing issues reactively instead of doing a thorough visual comparison upfront.
6. **When Alisher gives numbered issues, fix ALL of them in one pass**: Don't submit after fixing 2 of 6. Read all feedback, fix systematically, then submit once.
7. **Always read child component source for font properties**: Never assume Bold/Medium. QML defaults to `Font.Normal` (400) unless explicitly set. `HeaderTitleText` has no `font.weight` — it's 400, not 700. `TokenSelectorButton` selected state also has no weight — it's 400, not 500. Always trace to the actual component file.
8. **Don't add elements the prod doesn't show**: The close button was added because "StatusDialog has one" — but SwapModal overrides the header with AccountSelectorHeader, which replaces the default header including its close button. If prod doesn't show it, don't add it.
9. **Screenshots identify issues, sources provide fixes**: Never derive CSS values (font weights, sizes, colors, spacing) from screenshots. Use screenshots only to spot what's wrong, then go to the QML source for the exact property value. Screenshots compound guessing errors.
10. **Hand-drawn SVGs are always wrong**: Every time a `▾` text character, a freehand path, or a simplified shape is used instead of an extracted StatusQ icon, it will fail audit or visual review. ALWAYS extract from `StatusQ/src/assets/img/icons/`. The anti-pattern has repeated for: chevron-down, edit_pencil, password, arrow-down.
11. **When Alisher submits issues, follow the Step 5b protocol**: Log → research in QML → reflect/update skills → fix ALL in one pass → notify Senty → commit → audit → re-present. This sequence is now in BUILDER.md Step 5b.
