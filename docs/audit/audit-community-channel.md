## Inventory Audit: community-channel
Status: FAIL
Date: 2026-04-06

### Findings:
- INCOMPLETE SCOPE: [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L3) limits itself to "`components with GAPS`" from `docs/pause.md`. That is not a full screen inventory per audit protocol, so this submission cannot PASS as an inventory gate.
- WRONG PARENT / MISSING SCREEN COMPONENT: [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L10) says `StatusChatInfoButton` is used in `ChatHeaderContentView.qml`, but the community channel screen wires it through [ColumnHeaderPanel.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Communities/panels/ColumnHeaderPanel.qml#L28). That same panel also includes a sibling `StatusIconTabButton` invite/share control at [ColumnHeaderPanel.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Communities/panels/ColumnHeaderPanel.qml#L41), which is missing from the inventory entirely.
- WRONG VISIBILITY DECISIONS IN HEADER: [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L15), [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L21), [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L22), and [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L23) mark the type icon and pinned-message subtitle controls as in-scope gaps. On the actual community screen, `ColumnHeaderPanel` sets `type: StatusChatInfoButton.Type.OneToOneChat` and does not bind `pinnedMessagesCount` at all at [ColumnHeaderPanel.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Communities/panels/ColumnHeaderPanel.qml#L31). In [StatusChatInfoButton.qml](/home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Controls/StatusChatInfoButton.qml#L100), the type icon is hidden for `OneToOneChat`, and the separator/pin/icon text only render when `root.pinnedMessagesCount` is truthy at [StatusChatInfoButton.qml](/home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Controls/StatusChatInfoButton.qml#L175). Those four items are not valid INCLUDE findings for this screen as wired.
- WRONG REPLY CONNECTOR MATH: [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L57) and [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L63) derive `Layout.topMargin` as 18px from a 36px identicon. In [StatusMessageReply.qml](/home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/private/statusMessage/StatusMessageReply.qml#L36) the margin is `profileImage.height / 2`, and the reply `profileImage` is populated from `replyDetails.sender.profileImage` which is `20x20` in [MessageView.qml](/home/alisher/status-desktop/ui/imports/shared/views/chat/MessageView.qml#L992). The correct resolved top margin for this screen is 10px, not 18px.

### Required resubmission:
- Submit a full screen inventory, not a gap-only delta from `docs/pause.md`.
- Rebuild the community header section from the actual `ColumnHeaderPanel.qml` wiring for this screen.
- Correct the reply connector geometry using the reply avatar size from `MessageView.qml`, not the main header avatar size.

## Inventory Re-Audit: community-channel
Status: FAIL
Date: 2026-04-06

### Findings:
- STILL INCOMPLETE AS A FULL-SCREEN INVENTORY: the resubmission claims to cover "every visible component on the community channel screen" at [docs/audit/inventory-community-channel.md](/home/alisher/status-redesign/docs/audit/inventory-community-channel.md#L3), but it still omits several parent-level child/loaders from the top-level screen composition with no INCLUDE/EXCLUDE decision.
- MISSING COMMUNITYCOLUMNVIEW CHILDREN: the resubmitted inventory covers `ColumnHeaderPanel`, `StatusChatListAndCategories`, and `createChatOrCommunity`, but it omits `columnHeaderButton` at [CommunityColumnView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Communities/views/CommunityColumnView.qml#L105), `ChatsLoadingPanel` at [CommunityColumnView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Communities/views/CommunityColumnView.qml#L117), and the banner loaders for `WelcomeBannerPanel` and `ChannelsAndCategoriesBannerPanel` at [CommunityColumnView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Communities/views/CommunityColumnView.qml#L416) and [CommunityColumnView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Communities/views/CommunityColumnView.qml#L430). Even if these are out of scope for the static mockup, they still need explicit EXCLUDE entries with valid reasons.
- MISSING CHATCONTENTVIEW / CHATMESSAGESVIEW WRAPPERS: the inventory jumps straight to `ChatHeaderContentView`, `StatusMessage`, and `StatusChatInput`, but does not account for the blocked-state `StatusBanner` loader in [ChatContentView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Chat/views/ChatContentView.qml#L92), or the parent-level loading/anchor/header states in `ChatMessagesView`: `loadingMessagesIndicator` and `LoadingAnimation` at [ChatMessagesView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Chat/views/ChatMessagesView.qml#L188), `MessagesLoadingView` at [ChatMessagesView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Chat/views/ChatMessagesView.qml#L209), `ChatAnchorButtonsPanel` at [ChatMessagesView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Chat/views/ChatMessagesView.qml#L280), and the contact-request header components at [ChatMessagesView.qml](/home/alisher/status-desktop/ui/app/AppLayouts/Chat/views/ChatMessagesView.qml#L445). These are part of the parent composition and need explicit inventory treatment.

### Required resubmission:
- Keep the corrected wiring and reply-connector math from the current resubmission.
- Expand the inventory to include all parent-level children/loaders in `CommunityColumnView.qml`, `ChatContentView.qml`, and `ChatMessagesView.qml`.
- For each conditional component not intended for the static mockup, add an explicit EXCLUDE with a source-backed justification instead of omitting it.

## Inventory Re-Audit v3: community-channel
Status: PASS
Date: 2026-04-06

### Findings:
- PASS: the v3 resubmission adds explicit EXCLUDE decisions for the previously omitted parent-level conditional components in `CommunityColumnView.qml`, `ChatContentView.qml`, and `ChatMessagesView.qml`, while preserving the corrected header wiring and reply-connector math.

## Code Audit: community-channel
Status: FAIL
Date: 2026-04-06

### Blocking:
- [src/screens/community-channel.js](/home/alisher/status-redesign/src/screens/community-channel.js#L254) and [src/screens/community-channel.js](/home/alisher/status-redesign/src/screens/community-channel.js#L294) render the secondary display name twice. `headerDotsHtml` already includes `secondaryNameHtml`, but the final header markup prepends `secondaryNameHtml` again, so messages with ENS names render `(elena.eth)` twice. QML only instantiates one `secondaryDisplayNameLoader` at [StatusMessageHeader.qml](/home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/StatusMessageHeader.qml#L105).
- [src/screens/community-channel.js](/home/alisher/status-redesign/src/screens/community-channel.js#L231) still omits the reply author `StatusSmartIdenticon`. The reply header renders only sender text, but QML includes a 20x20 `StatusSmartIdenticon` before the sender name at [StatusMessageReply.qml](/home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/private/statusMessage/StatusMessageReply.qml#L80). This is an included child component with no corresponding HTML.
- [src/screens/community-channel.css](/home/alisher/status-redesign/src/screens/community-channel.css#L474) and [src/screens/community-channel.css](/home/alisher/status-redesign/src/screens/community-channel.css#L475) use `var(--direct-color-6)` for the reply connector stroke. QML computes the connector color from `Theme.palette.baseColor1` with 40% alpha at [StatusMessageReply.qml](/home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/private/statusMessage/StatusMessageReply.qml#L43). In the current dark tokens, `--base-color-1` is `#909090` while `--direct-color-6` is `#FFFFFF33`, so the CSS is not using the source-specified color.

## Code Re-Audit: community-channel
Status: PASS
Date: 2026-04-06

### Findings:
- PASS: commit `5009b7b` fixes the three blocked items from the prior code audit. The duplicate secondary-name rendering is removed, the reply header now includes a 20x20 avatar before the sender name, and the reply connector stroke now uses `baseColor1` at 40% alpha via `color-mix(...)`, matching the QML color computation.
