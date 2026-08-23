# Graph Report - /home/kabil/kabil-backup/backup/personal/projects/Bamboo/frontend  (2026-08-08)

## Corpus Check
- 295 files · ~130,648 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1469 nodes · 3160 edges · 165 communities (84 shown, 81 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Route Layouts
- Article & Comments
- Collab Editor
- Blog & Profile Cards
- TipTap Extensions
- Combobox UI
- Editor Icons A
- TypeScript Refs
- Package Config
- Featured & Profile Routes
- Editor Icons B
- Blog Update Details
- Auth & Root Layout
- Toolbar & Avatar
- List Buttons
- AI Dropdown & Profile
- Article Render
- Landing Pages
- Edit Profile Form
- Alignment Icons
- Heading Buttons
- Node Button Primitives
- Text Styling Buttons
- Image Upload Extension
- Sidebar Components
- API & Auth Interceptors
- Color Highlight Extension
- Docs Sidebar
- Dropdown Menu
- Alert Dialog
- Dialog Components
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 147
- Community 148
- Community 149
- Community 150
- Community 151
- Community 152
- Community 161
- Community 162
- Community 163

## God Nodes (most connected - your core abstractions)
1. `cn()` - 192 edges
2. `react` - 53 edges
3. `Button()` - 44 edges
4. `useAppDispatch()` - 35 edges
5. `useAppState` - 33 edges
6. `useTiptapEditor()` - 22 edges
7. `api` - 21 edges
8. `ButtonProps` - 18 edges
9. `Button` - 18 edges
10. `Input()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `ImageUploadDragArea()` --references--> `react`  [EXTRACTED]
  src/components/tiptap-node/image-upload-node/image-upload-node.tsx → package.json
- `usePopoverContext()` --references--> `react`  [EXTRACTED]
  src/components/tiptap-ui-primitive/popover/popover.tsx → package.json
- `useToolbarKeyboardNav()` --references--> `react`  [EXTRACTED]
  src/components/tiptap-ui-primitive/toolbar/toolbar.tsx → package.json
- `useTooltipContext()` --references--> `react`  [EXTRACTED]
  src/components/tiptap-ui-primitive/tooltip/tooltip.tsx → package.json
- `useImageColors()` --references--> `colorthief`  [EXTRACTED]
  src/hooks/useImageColors.ts → package.json

## Import Cycles
- 2-file cycle: `src/components/atomsComponents/SideNavBarMenu/index.tsx -> src/components/atomsComponents/index.tsx -> src/components/atomsComponents/SideNavBarMenu/index.tsx`

## Communities (165 total, 81 thin omitted)

### Community 0 - "Route Layouts"
Cohesion: 0.06
Nodes (32): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+24 more)

### Community 1 - "Article & Comments"
Cohesion: 0.08
Nodes (36): ArticleMobileToc(), ArticleMobileTocProps, buildCommentRoomName(), Comment, CommentAuthor, CommentCursorResponse, CommentReply, CommentsDrawer() (+28 more)

### Community 2 - "Collab Editor"
Cohesion: 0.11
Nodes (27): @hocuspocus/provider, @hocuspocus/provider, BlogEditor(), getCollabHttpBaseUrl(), BubbleMenuEditor(), EditorContiner(), MainToolbarContent(), Editor() (+19 more)

### Community 3 - "Blog & Profile Cards"
Cohesion: 0.11
Nodes (31): tagColors, ProfileTag(), DESIGNATIONS, formatDesignation(), profileSchema, SetProfileForm(), TAGS, Card() (+23 more)

### Community 4 - "TipTap Extensions"
Cohesion: 0.07
Nodes (22): Link, Selection, TrailingNode, TrailingNodeOptions, CloseIcon, Commands, ImageUploadNode, ImageUploadNodeOptions (+14 more)

### Community 5 - "Combobox UI"
Cohesion: 0.08
Nodes (26): ComboboxClear(), ComboboxGroup(), ComboboxInput(), ComboboxLabel(), ComboboxSeparator(), ComboboxTrigger(), Command(), CommandGroup() (+18 more)

### Community 6 - "Editor Icons A"
Cohesion: 0.09
Nodes (20): ChevronDownIcon, HeadingFiveIcon, HeadingFourIcon, HeadingIcon, HeadingOneIcon, HeadingSixIcon, HeadingThreeIcon, HeadingTwoIcon (+12 more)

### Community 7 - "TypeScript Refs"
Cohesion: 0.06
Nodes (31): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, src/components/atomsComponents/searchBox (+23 more)

### Community 8 - "Package Config"
Cohesion: 0.07
Nodes (29): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, sass (+21 more)

### Community 9 - "Featured & Profile Routes"
Cohesion: 0.15
Nodes (23): FeaturedCarousel(), formatDateLabel(), ProfileRoutes(), Tabs(), TabsProps, TabChips(), Tabs(), TabsProps (+15 more)

### Community 10 - "Editor Icons B"
Cohesion: 0.11
Nodes (19): BoldIcon, Code2Icon, ItalicIcon, StrikeIcon, SubscriptIcon, SuperscriptIcon, UnderlineIcon, canToggleMark() (+11 more)

### Community 11 - "Blog Update Details"
Cohesion: 0.16
Nodes (22): BlogUpdateDetails(), BlogUpdateDetailsProps, CreateContentProps, CreateContentProps, EditorModel(), ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+14 more)

### Community 12 - "Auth & Root Layout"
Cohesion: 0.16
Nodes (18): AuthBootstrap(), RootLayout(), Layout(), tabs, Layout(), OAuthCallback(), BlogCard(), DropDownProfileMenu() (+10 more)

### Community 13 - "Toolbar & Avatar"
Cohesion: 0.14
Nodes (18): profileCache, MainToolbarContentProp, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+10 more)

### Community 14 - "List Buttons"
Cohesion: 0.14
Nodes (21): ListIcon, canToggleList(), getListOption(), isListActive(), ListButton, ListButtonProps, ListOption, listOptions (+13 more)

### Community 15 - "AI Dropdown & Profile"
Cohesion: 0.14
Nodes (19): SadProfile(), sizeIcon, AskWithAiDropdownProps, MenuItem, MenuSection, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+11 more)

### Community 16 - "Article Render"
Cohesion: 0.18
Nodes (17): ArticleRender(), extractId(), extractText(), jetBrains_Mono, slugify(), VisibilityPopover(), MarkdownViewDialogProps, SharePopover() (+9 more)

### Community 17 - "Landing Pages"
Cohesion: 0.15
Nodes (18): cardData, fadePanelProps, fadeTransition, Profile(), cardData, fadePanelProps, fadeTransition, UserProfile() (+10 more)

### Community 18 - "Edit Profile Form"
Cohesion: 0.13
Nodes (18): defaultProfileData, defaultProfileImages, EditProfileFormProps, platformIcons, ProfileData, SocialLink, socialPlatforms, defaultProfileImages (+10 more)

### Community 19 - "Alignment Icons"
Cohesion: 0.13
Nodes (17): AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, canSetTextAlign(), checkTextAlignExtension(), hasSetTextAlign(), isTextAlignActive() (+9 more)

### Community 20 - "Heading Buttons"
Cohesion: 0.13
Nodes (18): ContextType, DropdownMenu(), DropdownMenuContent, DropdownMenuContentProps, DropdownMenuContext, DropdownMenuGroup, DropdownMenuGroupProps, DropdownMenuItem (+10 more)

### Community 21 - "Node Button Primitives"
Cohesion: 0.16
Nodes (16): followUser(), getFollowersByHandle(), unfollowUser(), ProfileHoverTag(), platformHoverColors, platformIcons, platformNames, SectionCards() (+8 more)

### Community 22 - "Text Styling Buttons"
Cohesion: 0.13
Nodes (12): ErrorProps, ArticleNotFound(), DocsCard(), DocsShelf(), EditProfileForm(), MoreAbout(), MoreAboutData, Author (+4 more)

### Community 23 - "Image Upload Extension"
Cohesion: 0.12
Nodes (18): emojiExtension, emoticonExtension, emoticonRegex, escapedEmoticons, insExtension, markExtension, Popup(), props (+10 more)

### Community 24 - "Sidebar Components"
Cohesion: 0.13
Nodes (19): ApiRole, BlogMemberRoleResponse, buildApiUrl(), CollabUser, DocsMemberRoleResponse, InvitedUser, InviteRole, ToolBarBottom() (+11 more)

### Community 25 - "API & Auth Interceptors"
Cohesion: 0.16
Nodes (13): authApi, api, getFollowingByHandle(), setupInterceptors(), failedQueue, getServiceLabel(), maybeToastServiceUnavailable(), processQueue() (+5 more)

### Community 26 - "Color Highlight Extension"
Cohesion: 0.17
Nodes (17): initialState, setProfileReducers, SetProfileReducersState, getProfile, profileInitialState, ProfileReducersState, AllProfileBlog, AllProfileDocs (+9 more)

### Community 27 - "Docs Sidebar"
Cohesion: 0.14
Nodes (9): Logo(), SearchBox(), cardData, DocsCards(), LoginForm(), MenuItem, NavBar(), NavbarProps (+1 more)

### Community 28 - "Dropdown Menu"
Cohesion: 0.11
Nodes (19): axios, highlight.js, motion, dependencies, axios, highlight.js, motion, @radix-ui/react-dropdown-menu (+11 more)

### Community 29 - "Alert Dialog"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, store, ui, utils, iconLibrary (+10 more)

### Community 30 - "Dialog Components"
Cohesion: 0.23
Nodes (13): ArticleSidebar(), TocItem, Collapsible(), CollapsibleContent(), CollapsibleTrigger(), SidebarMenu(), SidebarMenuButton(), SidebarMenuItem() (+5 more)

### Community 31 - "Community 31"
Cohesion: 0.15
Nodes (14): ListOrderedIcon, ListTodoIcon, canToggleList(), getListOption(), isListActive(), ListOption, listOptions, listShortcutKeys (+6 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (14): formatShortcutKey(), MAC_SYMBOLS, parseShortcutKeys(), PlatformShortcuts, Tooltip(), TooltipContent, TooltipContentProps, TooltipContext (+6 more)

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (13): RecentlyUpdatedDocs(), RecentlyUpdatedDocsProps, injectOverview(), initialType, getDocs, initialState, AuthorSummary, Docs (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.15
Nodes (12): ArticleTableContent(), buildTocTree(), AskWithAiDropdown(), MarkdownViewDialog(), BlogPageSkeleton(), paragraphWidths, tocWidths, BlogRenderPage() (+4 more)

### Community 35 - "Community 35"
Cohesion: 0.19
Nodes (13): MenuItem, Navbar1Props, NavigationMenuBar(), renderMenuItem(), NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem() (+5 more)

### Community 36 - "Community 36"
Cohesion: 0.16
Nodes (11): BanIcon, HighlighterIcon, ColorHighlightPopoverButton, ColorHighlightPopoverColor, ColorHighlightPopoverContent(), ColorHighlightPopoverContentProps, ColorHighlightPopoverProps, DEFAULT_HIGHLIGHT_COLORS (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (10): Home(), pickCuratedDocs(), tabs, StartWritingCTA(), getCoverBlog, DocsCoverRtk, featuredBlogReducer, FeaturedBlogState (+2 more)

### Community 38 - "Community 38"
Cohesion: 0.19
Nodes (11): Redo2Icon, Undo2Icon, canExecuteHistoryAction(), executeHistoryAction(), HistoryAction, historyActionLabels, historyIcons, historyShortcutKeys (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (13): canToggleHighlight(), ColorHighlightButton, ColorHighlightButtonProps, HIGHLIGHT_COLORS, isColorHighlightButtonDisabled(), isHighlightActive(), shouldShowColorHighlightButton(), toggleHighlight() (+5 more)

### Community 40 - "Community 40"
Cohesion: 0.21
Nodes (13): react, react, Search(), SidebarMenuSkeleton(), LinkContent(), LinkPopover(), useLinkHandler(), useDropdownMenuContext() (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.19
Nodes (8): CornerDownLeftIcon, ExternalLinkIcon, LinkIcon, TrashIcon, LinkButton, LinkHandlerProps, LinkMainProps, LinkPopoverProps

### Community 42 - "Community 42"
Cohesion: 0.16
Nodes (9): Orientation, Separator, SeparatorProps, BaseProps, Toolbar, ToolbarGroup, ToolbarProps, ToolbarSeparator (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.23
Nodes (11): EditorNotes(), formatDateLabel(), getBlogPage, initialState, AuthorSummary, BlogBase, BlogContentState, BlogEditorState (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.27
Nodes (10): getUserProfile(), updateUserProfile(), ProfileEditDialog(), ProfileEditDialogProps, ProfileFormData, socialLink, userBase, userProfile (+2 more)

### Community 45 - "Community 45"
Cohesion: 0.19
Nodes (8): AccountSettingsDialog(), AccountSettingsDialogProps, platformIcons, ProfileData, SocialLink, socialPlatforms, Input(), Label()

### Community 46 - "Community 46"
Cohesion: 0.24
Nodes (10): BlockQuoteIcon, BlockquoteButton, BlockquoteButtonProps, canToggleBlockquote(), isBlockquoteActive(), isBlockquoteButtonDisabled(), shouldShowBlockquoteButton(), toggleBlockquote() (+2 more)

### Community 47 - "Community 47"
Cohesion: 0.21
Nodes (10): ImagePlusIcon, ImageUploadButton, ImageUploadButtonProps, insertImage(), isImageActive(), useImageUploadButton(), Button, ButtonProps (+2 more)

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (11): Popover(), PopoverContent, PopoverContentProps, PopoverContext, PopoverContextValue, PopoverOptions, PopoverProps, PopoverTrigger (+3 more)

### Community 49 - "Community 49"
Cohesion: 0.26
Nodes (9): CodeBlockIcon, canToggleCodeBlock(), CodeBlockButton, CodeBlockButtonProps, isCodeBlockActive(), isCodeBlockButtonDisabled(), shouldShowCodeBlockButton(), toggleCodeBlock() (+1 more)

### Community 50 - "Community 50"
Cohesion: 0.27
Nodes (8): DocsRenderPage(), estimateReadingTime(), fadeUp, flattenTree(), stagger, useApiLoading(), usePathResolver(), DocsRTK

### Community 51 - "Community 51"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 52 - "Community 52"
Cohesion: 0.31
Nodes (3): ArticleNotFoundProps, Button(), buttonVariants

### Community 53 - "Community 53"
Cohesion: 0.27
Nodes (5): inter, metadata, Providers(), Toaster(), ThemeProvider()

### Community 54 - "Community 54"
Cohesion: 0.31
Nodes (8): BreadcrumbsArticle(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 55 - "Community 55"
Cohesion: 0.24
Nodes (6): LinkMain(), isAllowedUri(), ProtocolConfig, ProtocolOptions, TODO: Needed?, sanitizeUrl()

### Community 56 - "Community 56"
Cohesion: 0.28
Nodes (5): docsHomeSelectors, getCoverDocs, initialState, AppDispatch, RootState

### Community 57 - "Community 57"
Cohesion: 0.32
Nodes (6): CursorVisibilityOptions, TODO: Needed?, RectState, useCursorVisibility(), useWindowSize(), WindowSizeState

### Community 58 - "Community 58"
Cohesion: 0.33
Nodes (5): BambooLoader(), BambooLoaderProps, LoaderVariant, agbalumo, LogoProps

### Community 59 - "Community 59"
Cohesion: 0.33
Nodes (5): blogCoverSelectors, BlogCoverState, homeBlogCoverReducers, initialState, BlogCursorResponse

### Community 61 - "Community 61"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 62 - "Community 62"
Cohesion: 0.40
Nodes (3): containerVariants, iconVariants, itemVariants

### Community 63 - "Community 63"
Cohesion: 0.40
Nodes (3): containerVariants, iconVariants, itemVariants

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (4): ArticleHeader(), ArticleHeaderProps, fadeUp, formatDate()

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (4): ArticleNavigation(), ArticleNavigationProps, fadeUp, NavigationPage

### Community 66 - "Community 66"
Cohesion: 0.40
Nodes (4): FloatingAction, FloatingActionBar(), FloatingActionBarProps, ToolTip()

### Community 68 - "Community 68"
Cohesion: 0.60
Nodes (4): deriveReason(), formatDateLabel(), WhatToReadNext(), WhatToReadNextProps

### Community 69 - "Community 69"
Cohesion: 0.50
Nodes (4): Graphify Rules Document, Graphify Knowledge Graph Integration, Graphify Pipeline Execution, Graphify Workflow Document

### Community 70 - "Community 70"
Cohesion: 0.50
Nodes (4): Background Pattern Image, Space Doodle Background Pattern, Space Exploration Illustration, Hand Drawn Space Artwork

### Community 71 - "Community 71"
Cohesion: 0.50
Nodes (4): Frontend README Document, Geist Font Optimization, Next.js Framework, Vercel Platform Deployment

### Community 72 - "Community 72"
Cohesion: 0.67
Nodes (3): barWidth(), ThisWeek(), ThisWeekProps

### Community 73 - "Community 73"
Cohesion: 0.67
Nodes (3): config, proxy(), PUBLIC_ROUTES

### Community 74 - "Community 74"
Cohesion: 0.50
Nodes (3): Docs, DocsPage, DocsSlice

## Knowledge Gaps
- **413 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+408 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **81 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 40` to `Route Layouts`, `Blog & Profile Cards`, `TipTap Extensions`, `Combobox UI`, `Editor Icons A`, `Featured & Profile Routes`, `Blog Update Details`, `Auth & Root Layout`, `List Buttons`, `Article Render`, `Landing Pages`, `Alignment Icons`, `Heading Buttons`, `Dropdown Menu`, `Community 32`, `Community 36`, `Community 38`, `Community 39`, `Community 42`, `Community 46`, `Community 47`, `Community 48`, `Community 49`, `Community 57`?**
  _High betweenness centrality (0.317) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Dropdown Menu` to `Community 128`, `Community 129`, `Collab Editor`, `Community 130`, `Community 131`, `Community 132`, `Community 133`, `Community 134`, `Package Config`, `Community 135`, `Community 136`, `Community 137`, `Community 138`, `Community 139`, `Community 140`, `Community 141`, `Community 142`, `Community 143`, `Community 144`, `Community 145`, `Community 146`, `Community 147`, `Community 148`, `Community 40`, `Community 76`, `Community 78`, `Community 79`, `Community 80`, `Community 81`, `Community 82`, `Community 84`, `Community 85`, `Community 86`, `Community 87`, `Community 88`, `Community 89`, `Community 90`, `Community 91`, `Community 92`, `Community 93`, `Community 94`, `Community 96`, `Community 98`, `Community 99`, `Community 100`, `Community 101`, `Community 102`, `Community 103`, `Community 104`, `Community 105`, `Community 106`, `Community 107`, `Community 108`, `Community 109`, `Community 110`, `Community 111`, `Community 112`, `Community 113`, `Community 114`, `Community 115`, `Community 116`, `Community 117`, `Community 118`, `Community 119`, `Community 120`, `Community 121`, `Community 122`, `Community 123`, `Community 124`, `Community 125`, `Community 126`, `Community 127`?**
  _High betweenness centrality (0.259) - this node is a cross-community bridge._
- **Why does `cn()` connect `Combobox UI` to `Route Layouts`, `Article & Comments`, `Blog & Profile Cards`, `Featured & Profile Routes`, `Blog Update Details`, `Auth & Root Layout`, `Toolbar & Avatar`, `AI Dropdown & Profile`, `Article Render`, `Landing Pages`, `Edit Profile Form`, `Node Button Primitives`, `Sidebar Components`, `Docs Sidebar`, `Dialog Components`, `Community 35`, `Community 40`, `Community 45`, `Community 51`, `Community 52`, `Community 54`, `Community 67`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _413 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Route Layouts` be split into smaller, more focused modules?**
  _Cohesion score 0.06280193236714976 - nodes in this community are weakly interconnected._
- **Should `Article & Comments` be split into smaller, more focused modules?**
  _Cohesion score 0.08416389811738649 - nodes in this community are weakly interconnected._
- **Should `Collab Editor` be split into smaller, more focused modules?**
  _Cohesion score 0.10609756097560975 - nodes in this community are weakly interconnected._