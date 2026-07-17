# Component Inventory — Community Channel (Full Screen)

Full screen inventory per BUILDER.md protocol. Covers every visible component
on the community channel screen: left panel + center panel.

---

## A. LEFT PANEL

### A1. ColumnHeaderPanel (Community Header)
File: /home/alisher/status-desktop/ui/app/AppLayouts/Communities/panels/ColumnHeaderPanel.qml
Used in: CommunityColumnView.qml (line 90)
Parent: Control, padding=halfPadding(8), rightPadding=padding(16), topPadding=smallPadding(10)
Sub-components: 2

#### A1a. StatusChatInfoButton (community name + member count)
File: /home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Controls/StatusChatInfoButton.qml
Wiring (ColumnHeaderPanel.qml):
- title: communityData.name
- subTitle: "%n member(s)"
- asset.name: communityData.image, asset.isImage: true, asset.color: communityData.color
- type: StatusChatInfoButton.Type.OneToOneChat (line 38)
- pinnedMessagesCount: NOT BOUND (default 0)
- muted: NOT BOUND (default false)

Visibility consequences of this wiring:
- StatusSmartIdenticon (36×36): VISIBLE — shows community avatar image — **INCLUDE** (already present in HTML)
- StatusIcon (type): HIDDEN — type is OneToOneChat, line 101: `visible: root.type !== OneToOneChat` — **EXCLUDE**
- TruncatedTextWithTooltip (title): VISIBLE — community name — **INCLUDE** (already present)
- StatusIcon (muted): HIDDEN — muted is false — **EXCLUDE**
- TruncatedTextWithTooltip (subtitle): VISIBLE — member count — **INCLUDE** (already present)
- Rectangle separator: HIDDEN — pinnedMessagesCount is 0, line 181: `visible: root.subTitle && root.pinnedMessagesCount` — **EXCLUDE**
- StatusIcon (pin): HIDDEN — pinnedMessagesCount is 0 — **EXCLUDE**
- TruncatedTextWithTooltip (pin count): HIDDEN — pinnedMessagesCount is 0 — **EXCLUDE**

#### A1b. StatusIconTabButton (invite contacts)
File: StatusQ (StatusIconTabButton.qml)
Wiring: icon.name: "add-contact", icon.color: directColor1, checkable: false
Tooltip: "Invite contacts"
**INCLUDE** ← MISSING in HTML

### A1c. Loader: columnHeaderButton (Join / Finalise Ownership)
File: CommunityColumnView.qml (line 105–115)
Active: when showFinaliseOwnershipButton OR showJoinButton (not joined or banned)
Components: finaliseCommunityOwnershipBtn | joinCommunityButton
**EXCLUDE** (mockup shows an already-joined community; neither condition active)

### A1d. ChatsLoadingPanel
File: CommunityColumnView.qml (line 117–122)
Active: when chatSectionModule is loading
**EXCLUDE** (transient loading state, not in static mockup)

### A2. StatusChatListAndCategories (Channel List)
File: /home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/StatusChatListAndCategories.qml
Used in: CommunityColumnView.qml (line 193), inside StatusScrollView
Sub-components per category:

#### A2a. StatusChatListCategoryItem (category header)
- Height: 34px, horizontalPadding: 8, chevron 18px — **INCLUDE** (already present)

#### A2b. StatusChatListItem (channel item)
- Height: 40px, width: 288px, radius: 8 — **INCLUDE** (already present)
- Identicon 24×24, channel icon 16×16, name, badge — all present

### A3. Banner Column (below channel list, inside ScrollView)
File: CommunityColumnView.qml (line 402–448)

#### A3a. Loader: WelcomeBannerPanel
Active: when isSectionAdmin AND banner not dismissed (line 417)
**EXCLUDE** (admin-only onboarding banner, not in static mockup)

#### A3b. Loader: ChannelsAndCategoriesBannerPanel
Active: when isSectionAdmin AND banner not dismissed (line 431)
**EXCLUDE** (admin-only onboarding banner, not in static mockup)

### A4. Loader: CreateChatOrCommunity (bottom link)
File: CommunityColumnView.qml (line 464–475)
Active: when isSectionAdmin (line 469)
**EXCLUDE** (admin-only UI, not in static mockup scope)

### A5. StatusMenu: adminPopupMenu (right-click context menu)
File: CommunityColumnView.qml (line 124–174)
Trigger: right-click on scroll view background, admin only
**EXCLUDE** (popup menu, not rendered in static mockup)

---

## B. CENTER PANEL

### B1. ChatHeaderContentView (Chat Toolbar)
File: /home/alisher/status-desktop/ui/app/AppLayouts/Chat/views/ChatHeaderContentView.qml
Used in: ChatContentView.qml
Parent: RowLayout

#### B1a. StatusChatInfoButton (channel name + description + pin count)
File: /home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Controls/StatusChatInfoButton.qml
Wiring (ChatHeaderContentView.qml, line 255–290):
- title: chatContentModule.chatDetails.name
- subTitle: chatContentModule.chatDetails.description (for communityChat type, line 273)
- asset.name: chatDetails.icon, asset.isImage: true when icon !== ""
- asset.isLetterIdenticon: true when icon === ""
- asset.color: chatDetails.color
- asset.emoji: chatDetails.emoji, asset.emojiSize: "24x24"
- type: chatContentModule.chatDetails.type → Constants.chatType.communityChat (6)
- pinnedMessagesCount: chatContentModule.pinnedMessagesModel.count (line 289) → BOUND, can be > 0
- muted: chatContentModule.chatDetails.muted (line 290)

Visibility consequences of this wiring:
1. StatusSmartIdenticon (36×36): VISIBLE — channel emoji/icon/letter — **INCLUDE** ← MISSING in HTML
2. StatusIcon (type): VISIBLE — type is CommunityChat, icon "tiny/channel" (or locked/unlocked variants) — **INCLUDE** (already present)
3. TruncatedTextWithTooltip (title): VISIBLE — channel name, font.weight Medium, directColor1 — **INCLUDE** (already present)
4. StatusIcon (muted): VISIBLE only when muted — **EXCLUDE** (not in static mockup scope)

Subtitle row (visible when subTitle OR pinnedMessagesCount):
5. TruncatedTextWithTooltip (description): VISIBLE — tertiaryTextFontSize, baseColor1 — **INCLUDE** (already present)
6. Rectangle separator: VISIBLE when BOTH subTitle AND pinnedMessagesCount — 1×12px, directColor7, leftMargin 4, rightMargin 2 — **INCLUDE** ← MISSING in HTML
7. StatusIcon (pin): VISIBLE when pinnedMessagesCount > 0 — 14×14, icon "pin", baseColor1 — **INCLUDE** ← MISSING in HTML
8. TruncatedTextWithTooltip (pin count): VISIBLE when pinnedMessagesCount > 0 — tertiaryTextFontSize, baseColor1 — **INCLUDE** ← MISSING in HTML

#### B1b. Action Buttons (ChatHeaderContentView.qml, line 84–249)
9. StatusFlatRoundButton (search) — icon "search", 32×32, type Secondary — **INCLUDE** (already present)
10. StatusFlatRoundButton (members) — icon "group-chat", 32×32 — **INCLUDE** (already present)
11. StatusFlatRoundButton (menu) — icon "more", 32×32 — **INCLUDE** (already present)

### B1c. Loader: StatusBanner (blocked contact)
File: ChatContentView.qml (line 92–100)
Active: when root.isBlocked (line 94)
Component: StatusBanner type Danger, text "Blocked"
**EXCLUDE** (mockup does not show a blocked contact state)

### B2. ChatMessagesView (Message List)
File: /home/alisher/status-desktop/ui/app/AppLayouts/Chat/views/ChatMessagesView.qml
Container: ListView, spacing 0

#### B2-loading. Conditional loading/state components (before message list)

##### B2-load-1. loadingMessagesIndicator (history loading spinner)
File: ChatMessagesView.qml (line 188–207)
Visible: when rootStore.loadingHistoryMessagesInProgress (line 190)
Contains: LoadingAnimation 18×18 (line 201–203)
**EXCLUDE** (transient loading state, not in static mockup)

##### B2-load-2. Loader: MessagesLoadingView (skeleton/placeholder)
File: ChatMessagesView.qml (line 209–223)
Active: when messageStore.loading (line 217)
**EXCLUDE** (initial load state, not in static mockup)

##### B2-load-3. ChatAnchorButtonsPanel (scroll-to-bottom + mentions)
File: ChatMessagesView.qml (line 280–299)
Anchored to bottom-right of ListView, always present but conditionally visible
Shows "jump to recent" when scrolled >400px from bottom, mentions count badge
**EXCLUDE** (scroll-dependent overlay, not in static mockup)

##### B2-load-4. ListView header: Contact request components
File: ChatMessagesView.qml (line 441–457)
Active: only when isOneToOne AND specific contactRequestState values
Components: sendContactRequestComponent (line 468–478), acceptOrDeclineContactRequestComponent (line 480–501), pendingContactRequestComponent (line 503–511)
**EXCLUDE** (one-to-one chat only, not applicable to community channel)

#### B2a. MessageView → StatusMessage
File: /home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/StatusMessage.qml
Used in: MessageView.qml (delegate)
Sub-components: 13

1. Reply Loader → StatusMessageReply (line 200–216, active when isAReply) — **INCLUDE** (see B2b)
2. StatusUserImage (profileImage) — 36×36, active when showHeader (line 224–238) — **INCLUDE** (already present)
3. StatusPinMessageDetails — active when isPinned, icon "tiny/pin" 16×16, pinColor1 (line 246–251) — **INCLUDE** (already present)
4. StatusMessageHeader Loader (line 252–268, active when showHeader) — **INCLUDE** (see B2c)
5. StatusTextMessage Loader (line 269–293) — **INCLUDE** (already present)
6. Image content Loader (line 294–331) — **EXCLUDE** (image messages not in mockup)
7. Attachments Loader (line 333–348) — **EXCLUDE** (not in mockup)
8. StatusSticker (line 349–356) — **EXCLUDE** (not in mockup)
9. Links Loader (line 357–366) — **EXCLUDE** (not in mockup)
10. Invitation Loader (line 367–372) — **EXCLUDE** (not in mockup)
11. Edit Loader (line 374–385) — **EXCLUDE** (not in mockup)
12. StatusMessageEmojiReactions Loader (line 386–402) — **INCLUDE** (already present)
13. StatusMessageQuickActions Loader (line 408–418) — **EXCLUDE** (hover-only popup, not for static mockup)

Background states (line 126–147): transparent, baseColor2 hover, mentionColor4/3, pinColor3/2, editMode baseColor2. Left border 2px mentionColor1/pinColor1. All already in CSS. ✓

#### B2b. StatusMessageReply (Reply Bubble + Connector)
File: /home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/private/statusMessage/StatusMessageReply.qml
Used in: StatusMessage.qml (line 209)
Sub-components: 6

1. Shape (replyCorner) — L-shaped connector (line 31–63) — **INCLUDE** ← WRONG in CSS
   - Layout.leftMargin: 35 (line 35)
   - Layout.topMargin: profileImage.height/2 (line 36)
   - profileImage is populated from replyDetails.sender.profileImage
   - In MessageView.qml (line 992–994): reply sender.profileImage width=20, height=20
   - **Resolved topMargin: 20/2 = 10px** (NOT 18px — the reply avatar is 20×20, not 36×36)
   - Layout.preferredWidth: 20 (line 37)
   - strokeWidth: 3 (line 49)
   - strokeColor: baseColor1 @ 40% alpha via hsla (line 43–48)
   - capStyle: RoundCap, joinStyle: RoundJoin (line 51–52)
   - Path: startX:20 startY:0 → PathLine x:10 y:0 → PathArc x:0 y:10 radiusX:13 radiusY:13 CCW → PathLine x:0 y:bottom
   - **CSS fix needed**: border-bottom-left-radius 8px→13px, top 50%→10px fixed

2. StatusSmartIdenticon (profileImage) — 20×20 reply author avatar (per MessageView.qml line 993) — **INCLUDE** (present as text, size needs verification)
3. StatusBaseText (sender name) — secondaryTextFontSize, Font.Medium, baseColor1 (line 93–99) — **INCLUDE** (already present)
4. StatusTextMessage Loader — secondaryTextFontSize, baseColor1, singleLine, stripHtml (line 123–136) — **INCLUDE** (already present)
5. StatusMessageImageAlbum Loader — 56px thumbnails (line 138–151) — **EXCLUDE** (image replies not in mockup)
6. StatusSticker — 48×48 (line 154–161) — **EXCLUDE** (sticker replies not in mockup)

#### B2c. StatusMessageHeader
File: /home/alisher/status-desktop/ui/StatusQ/src/StatusQ/Components/StatusMessageHeader.qml
Used in: StatusMessage.qml (line 256)
Sub-components: 10 (RowLayout, spacing 4)

1. TextEdit (primaryDisplayName) — primaryColor1, Font.Medium, primaryTextFontSize, padding 4px with -4px margins (line 49–83) — **INCLUDE** (already present)
2. Loader (messageOriginInfo) — active when messageOriginInfo set, asideTextFontSize, baseColor1 (line 85–94) — **EXCLUDE** (bridge messages only)
3. Loader (verificationIcons) — StatusContactVerificationIcons, active when !amISender (line 96–103) — **EXCLUDE** (needs contact state data, deferred per pause.md)
4. Loader (secondaryDisplayName) — "(ENS name)" in parens, asideTextFontSize, baseColor1, active when !amISender && sender.secondaryName (line 105–115) — **INCLUDE** ← MISSING in HTML (CSS class `.message__secondary-name` exists)
5. Loader (dot) — "•", asideTextFontSize, baseColor1, active when BOTH secondaryDisplayName AND tertiaryDetail active (line 117–121) — **INCLUDE** ← MISSING in HTML (CSS class `.message__header-dot` exists)
6. Loader (tertiaryDetail) — Utils.elideText(sender.id, 3, 6), asideTextFontSize, baseColor1, active when !amISender && no messageOriginInfo && tertiaryDetail set (line 123–135) — **INCLUDE** ← MISSING in HTML
7. Loader (secondDot) — "•", active when verificationIcons has no width OR secondary active OR amISender OR tertiary active (line 137–141) — **INCLUDE** ← MISSING in HTML (dot before timestamp)
8. StatusTimeStampLabel — timestamp (line 143–148) — **INCLUDE** (already present)
9. Loader (deliveryStatus) — icon 15×15 + optional label on hover, baseColor1 or warningColor1 (line 160–213) — **INCLUDE** (already present)
10. Loader (resendButton) — active when expired + showOutgoingStatusLabel (line 215–228) — **EXCLUDE** (expired messages only)

### B3. StatusChatInput (Input Bar)
File: /home/alisher/status-desktop/ui/imports/shared/status/StatusChatInput.qml
Used in: ChatContentView.qml
Parent: Rectangle, bg=baseColor2, radius variants

Sub-components in input row:
1. Command button — 32×32, icon "chat-commands" — **INCLUDE** (already present)
2. Text input (StatusChatInputTextArea) — padding 9px 12px — **INCLUDE** (already present)
3. Emoji button — 32×32, icon "emojis" — **INCLUDE** (already present)
4. GIF button — icon "gif" — **INCLUDE** (already present)
5. Stickers button — icon "stickers" — **INCLUDE** (already present)
6. Send button — icon "send", primaryColor1 — **INCLUDE** (already present)

---

## Summary: INCLUDE items that are MISSING or BROKEN

| # | Section | Component | Issue | Severity |
|---|---------|-----------|-------|----------|
| 1 | A1b | StatusIconTabButton (invite) | Entire button missing from left panel header | Medium |
| 2 | B1a.1 | Chat header → StatusSmartIdenticon | 36×36 avatar missing from center panel header | Critical |
| 3 | B1a.6 | Chat header → Rectangle separator | 1×12px separator missing in subtitle row | Critical |
| 4 | B1a.7 | Chat header → Pin icon | 14×14 pin icon missing in subtitle row | Critical |
| 5 | B1a.8 | Chat header → Pin count text | "N pinned messages" text missing | Critical |
| 6 | B2b.1 | Reply connector → Shape | border-radius 8px→13px; top 50%→10px (reply avatar is 20×20) | Critical |
| 7 | B2c.4 | Message header → secondaryDisplayName | ENS name in parens missing (CSS class exists) | Medium |
| 8 | B2c.5 | Message header → dot separator | "•" between secondary/tertiary missing (CSS exists) | Medium |
| 9 | B2c.6 | Message header → tertiaryDetail | Compressed sender ID missing | Medium |
| 10 | B2c.7 | Message header → secondDot | Dot before timestamp missing | Medium |
