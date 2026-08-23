# Graph Report - bamboo-single-backend  (2026-08-23)

## Corpus Check
- 356 files · ~209,428 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3250 nodes · 5096 edges · 201 communities (98 shown, 103 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
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
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
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
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 161
- Community 162
- Community 163
- Community 164
- Community 165
- Community 166
- Community 167
- Community 168
- Community 169
- Community 170
- Community 171
- Community 172
- Community 173
- Community 174
- Community 175
- Community 176
- Community 177
- Community 178
- Community 179
- Community 180
- Community 181
- Community 182
- Community 183
- Community 193
- Community 194
- Community 195

## God Nodes (most connected - your core abstractions)
1. `cn()` - 192 edges
2. `Button()` - 42 edges
3. `useAppDispatch()` - 33 edges
4. `useAppState` - 31 edges
5. `useTiptapEditor()` - 31 edges
6. `api` - 25 edges
7. `PrismaClient` - 21 edges
8. `Button` - 19 edges
9. `DocumentDelegate` - 18 edges
10. `DocumentPageDelegate` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Tabs()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/atomsComponents/profileRoutes/index.tsx → frontend/src/lib/utils.ts
- `Tabs()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/atomsComponents/tabChips/index.tsx → frontend/src/lib/utils.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/shadcnUI/alert-dialog.tsx → frontend/src/lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/shadcnUI/alert-dialog.tsx → frontend/src/lib/utils.ts
- `BreadcrumbLink()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/shadcnUI/breadcrumb.tsx → frontend/src/lib/utils.ts

## Import Cycles
- 2-file cycle: `frontend/src/components/atomsComponents/SideNavBarMenu/index.tsx -> frontend/src/components/atomsComponents/index.tsx -> frontend/src/components/atomsComponents/SideNavBarMenu/index.tsx`
- 3-file cycle: `frontend/src/store/reducers/BlogCoverReducer.ts -> frontend/src/store/store.ts -> frontend/src/store/reducers/FeaturedBlogReducer.ts -> frontend/src/store/reducers/BlogCoverReducer.ts`
- 3-file cycle: `backend/src/generated/prisma/commonInputTypes.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/commonInputTypes.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/User.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/PostLike.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/MediaAsset.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/Document.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/DocumentPage.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/Newsletter.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/Post.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/PostBookmark.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/ReadingPlatform.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/RefreshToken.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`
- 3-file cycle: `backend/src/generated/prisma/internal/prismaNamespace.ts -> backend/src/generated/prisma/models.ts -> backend/src/generated/prisma/models/Tag.ts -> backend/src/generated/prisma/internal/prismaNamespace.ts`

## Communities (201 total, 103 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.01
Nodes (140): AggregateUser, DateTimeFieldUpdateOperationsInput, GetUserAggregateType, GetUserGroupByPayload, NullableDateTimeFieldUpdateOperationsInput, NullableStringFieldUpdateOperationsInput, StringFieldUpdateOperationsInput, User$bookmarksArgs (+132 more)

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (121): AnyNull, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, Boolean (+113 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (115): AggregatePost, GetPostAggregateType, GetPostGroupByPayload, Post$bookmarksArgs, Post$likesArgs, Post$mediaArgs, PostAggregateArgs, PostCountAggregateInputType (+107 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (111): AggregateDocumentPage, DocumentPage$childrenArgs, DocumentPage$parentArgs, DocumentPageAggregateArgs, DocumentPageAvgAggregateInputType, DocumentPageAvgAggregateOutputType, DocumentPageAvgOrderByAggregateInput, DocumentPageCountAggregateInputType (+103 more)

### Community 4 - "Community 4"
Cohesion: 0.02
Nodes (111): AggregateMediaAsset, BytesFieldUpdateOperationsInput, GetMediaAssetAggregateType, GetMediaAssetGroupByPayload, MediaAsset$documentsArgs, MediaAsset$platformCoverArgs, MediaAsset$postsArgs, MediaAssetAggregateArgs (+103 more)

### Community 5 - "Community 5"
Cohesion: 0.02
Nodes (104): AggregateDocument, Document$mediaArgs, Document$pagesArgs, DocumentAggregateArgs, DocumentCountAggregateInputType, DocumentCountAggregateOutputType, DocumentCountArgs, DocumentCountOrderByAggregateInput (+96 more)

### Community 6 - "Community 6"
Cohesion: 0.02
Nodes (89): AggregatePostBookmark, GetPostBookmarkAggregateType, GetPostBookmarkGroupByPayload, PostBookmarkAggregateArgs, PostBookmarkCountAggregateInputType, PostBookmarkCountAggregateOutputType, PostBookmarkCountArgs, PostBookmarkCountOrderByAggregateInput (+81 more)

### Community 7 - "Community 7"
Cohesion: 0.02
Nodes (89): AggregatePostLike, GetPostLikeAggregateType, GetPostLikeGroupByPayload, PostLikeAggregateArgs, PostLikeCountAggregateInputType, PostLikeCountAggregateOutputType, PostLikeCountArgs, PostLikeCountOrderByAggregateInput (+81 more)

### Community 8 - "Community 8"
Cohesion: 0.03
Nodes (74): AggregateRefreshToken, GetRefreshTokenAggregateType, GetRefreshTokenGroupByPayload, IntFieldUpdateOperationsInput, RefreshTokenAggregateArgs, RefreshTokenAvgAggregateInputType, RefreshTokenAvgAggregateOutputType, RefreshTokenAvgOrderByAggregateInput (+66 more)

### Community 9 - "Community 9"
Cohesion: 0.03
Nodes (73): AggregateNewsletter, GetNewsletterAggregateType, GetNewsletterGroupByPayload, NewsletterAggregateArgs, NewsletterCountAggregateInputType, NewsletterCountAggregateOutputType, NewsletterCountArgs, NewsletterCountOrderByAggregateInput (+65 more)

### Community 10 - "Community 10"
Cohesion: 0.05
Nodes (50): ArticleSidebar(), NavigationItem, ArticleTableContent(), ArticleTocRail(), buildTocTree(), TocItem, EditorSidebar(), Collapsible() (+42 more)

### Community 11 - "Community 11"
Cohesion: 0.03
Nodes (67): AggregateReadingPlatform, GetReadingPlatformAggregateType, GetReadingPlatformGroupByPayload, ReadingPlatformAggregateArgs, ReadingPlatformCountAggregateInputType, ReadingPlatformCountAggregateOutputType, ReadingPlatformCountArgs, ReadingPlatformCountOrderByAggregateInput (+59 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (38): createPost(), AccountSettingsDialog(), AccountSettingsDialogProps, platformIcons, ProfileData, SocialLink, socialPlatforms, ArticleNotFoundProps (+30 more)

### Community 13 - "Community 13"
Cohesion: 0.04
Nodes (53): AggregateTag, GetTagAggregateType, GetTagGroupByPayload, TagAggregateArgs, TagCategoryLabelCompoundUniqueInput, TagCountAggregateInputType, TagCountAggregateOutputType, TagCountArgs (+45 more)

### Community 14 - "Community 14"
Cohesion: 0.07
Nodes (38): BlogUpdateDetails(), BlogUpdateDetailsProps, CreateContentProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput(), ComboboxClear(), ComboboxContent() (+30 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (36): ChevronDownIcon, ListIcon, ListOrderedIcon, ListTodoIcon, canToggleList(), getListOption(), isListActive(), ListButton (+28 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (33): Home(), pickCuratedDocs(), EditorNotes(), formatDateLabel(), PlatformsToReadOn(), StartWritingCTA(), deriveReason(), formatDateLabel() (+25 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (22): AppError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError, adminRequired(), PrismaClient, PrismaManager (+14 more)

### Community 18 - "Community 18"
Cohesion: 0.07
Nodes (34): defaultProfileData, defaultProfileImages, EditProfileFormProps, platformIcons, ProfileData, SocialLink, socialPlatforms, SearchBox() (+26 more)

### Community 19 - "Community 19"
Cohesion: 0.07
Nodes (25): authResolved, authApi, api, setupInterceptors(), failedQueue, getServiceLabel(), maybeToastServiceUnavailable(), processQueue() (+17 more)

### Community 20 - "Community 20"
Cohesion: 0.11
Nodes (28): AdministrationPage(), DESIGNATIONS, formatDesignation(), profileSchema, SetProfileForm(), TAGS, Card(), CardAction() (+20 more)

### Community 21 - "Community 21"
Cohesion: 0.06
Nodes (35): BytesFilter, BytesWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, IntFilter, IntWithAggregatesFilter (+27 more)

### Community 22 - "Community 22"
Cohesion: 0.09
Nodes (27): BanIcon, HighlighterIcon, canToggleHighlight(), ColorHighlightButton, ColorHighlightButtonProps, HIGHLIGHT_COLORS, isColorHighlightButtonDisabled(), isHighlightActive() (+19 more)

### Community 23 - "Community 23"
Cohesion: 0.08
Nodes (22): fileToBase64(), getMediaUrl, Post, uploadMedia(), Link, Selection, nodeEqualsType(), TrailingNode (+14 more)

### Community 24 - "Community 24"
Cohesion: 0.06
Nodes (31): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, sass (+23 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (22): HeadingFiveIcon, HeadingFourIcon, HeadingIcon, HeadingOneIcon, HeadingSixIcon, HeadingThreeIcon, HeadingTwoIcon, canToggleHeading() (+14 more)

### Community 26 - "Community 26"
Cohesion: 0.06
Nodes (31): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+23 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (17): authOptional(), authRequired(), jwtHelper, createCorsMiddleware(), errorHandler(), logger, authRouter, rootRouter (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.14
Nodes (24): FeaturedCarousel(), formatDateLabel(), ProfileRoutes(), Tabs(), TabsProps, TabChips(), Tabs(), TabsProps (+16 more)

### Community 29 - "Community 29"
Cohesion: 0.10
Nodes (22): CornerDownLeftIcon, ExternalLinkIcon, LinkIcon, TrashIcon, LinkButton, LinkContent(), LinkHandlerProps, LinkMainProps (+14 more)

### Community 30 - "Community 30"
Cohesion: 0.11
Nodes (22): BlogEditor(), Post, AskWithAiDropdown(), MarkdownViewDialog(), BlogPageSkeleton(), paragraphWidths, BlogRenderPage(), estimateReadingTime() (+14 more)

### Community 31 - "Community 31"
Cohesion: 0.14
Nodes (21): emptyPlatform, groups, PlatformDraft, ReadingPlatform, AskWithAiDropdownProps, MenuItem, MenuSection, DropdownMenu() (+13 more)

### Community 32 - "Community 32"
Cohesion: 0.12
Nodes (19): BoldIcon, Code2Icon, ItalicIcon, StrikeIcon, SubscriptIcon, SuperscriptIcon, UnderlineIcon, canToggleMark() (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.13
Nodes (20): ImagePlusIcon, Redo2Icon, Undo2Icon, ImageUploadButton, ImageUploadButtonProps, insertImage(), isImageActive(), useImageUploadButton() (+12 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (21): Button, ContextType, DropdownMenu(), DropdownMenuContent, DropdownMenuContentProps, DropdownMenuContext, DropdownMenuGroup, DropdownMenuGroupProps (+13 more)

### Community 35 - "Community 35"
Cohesion: 0.11
Nodes (17): cardData, fadePanelProps, fadeTransition, Profile(), BlogCard(), tagColors, DocsProfileCard(), useProfileTab() (+9 more)

### Community 36 - "Community 36"
Cohesion: 0.13
Nodes (20): ArticleMobileToc(), ArticleMobileTocProps, MenuItem, NavbarProps, renderMobileMenuItem(), SideNavBarMenu(), Accordion(), AccordionContent() (+12 more)

### Community 37 - "Community 37"
Cohesion: 0.10
Nodes (21): emojiExtension, emoticonExtension, emoticonRegex, escapedEmoticons, handleupload(), insExtension, markExtension, Popup() (+13 more)

### Community 38 - "Community 38"
Cohesion: 0.14
Nodes (19): bookmarkPost(), unbookmarkPost(), cardData, fadePanelProps, fadeTransition, UserProfile(), VisibilityPopover(), profileCache (+11 more)

### Community 39 - "Community 39"
Cohesion: 0.16
Nodes (19): followUser(), getFollowersByHandle(), getFollowingByHandle(), unfollowUser(), Layout(), ProfileHoverTag(), platformHoverColors, platformIcons (+11 more)

### Community 40 - "Community 40"
Cohesion: 0.11
Nodes (12): Logo(), DocsHome(), DocsHomeCard, DocsHomeProps, cardData, DocsCards(), LoginForm(), onSubmit() (+4 more)

### Community 41 - "Community 41"
Cohesion: 0.13
Nodes (18): AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, canSetTextAlign(), checkTextAlignExtension(), hasSetTextAlign(), isTextAlignActive() (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.09
Nodes (21): AnyNull, DbNull, Decimal, DocumentPageScalarFieldEnum, DocumentScalarFieldEnum, JsonNull, MediaAssetScalarFieldEnum, ModelName (+13 more)

### Community 43 - "Community 43"
Cohesion: 0.21
Nodes (14): AuthBootstrap(), Docs(), RootLayout(), Layout(), tabs, OAuthCallback(), DropDownProfileMenu(), useLogout() (+6 more)

### Community 44 - "Community 44"
Cohesion: 0.13
Nodes (12): ErrorProps, ArticleNavigation(), ArticleNavigationProps, fadeUp, NavigationPage, ArticleNotFound(), DocsCard(), DocsShelf() (+4 more)

### Community 45 - "Community 45"
Cohesion: 0.15
Nodes (16): BubbleMenuEditor(), EditorContiner(), ToolBarBottom(), MainToolbarContent(), BaseProps, mergeRefs(), Toolbar, ToolbarGroup (+8 more)

### Community 46 - "Community 46"
Cohesion: 0.10
Nodes (12): CloseIcon, Commands, ImageUploadNode, ImageUploadNodeOptions, @tiptap/react, UploadFunction, FileItem, ImageUploadDragAreaProps (+4 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (15): RecentlyUpdatedDocs(), RecentlyUpdatedDocsProps, injectOverview(), docsHomeSelectors, getCoverDocs, initialState, initialType, getDocs (+7 more)

### Community 48 - "Community 48"
Cohesion: 0.18
Nodes (17): initialState, setProfileReducers, SetProfileReducersState, getProfile, profileInitialState, ProfileReducersState, AllProfileBlog, AllProfileDocs (+9 more)

### Community 50 - "Community 50"
Cohesion: 0.10
Nodes (19): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule, rootDir (+11 more)

### Community 51 - "Community 51"
Cohesion: 0.11
Nodes (19): add, embla-carousel-react, dependencies, add, embla-carousel-react, motion, @radix-ui/react-collapsible, react-markdown (+11 more)

### Community 52 - "Community 52"
Cohesion: 0.11
Nodes (19): dependencies, cookie, cookie-parser, express, jose, passport, passport-google-oauth20, pg (+11 more)

### Community 53 - "Community 53"
Cohesion: 0.11
Nodes (19): devDependencies, prisma, tsx, @types/cookie-parser, @types/express, @types/node, @types/passport, @types/passport-google-oauth20 (+11 more)

### Community 54 - "Community 54"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, store, ui, utils, iconLibrary (+10 more)

### Community 55 - "Community 55"
Cohesion: 0.15
Nodes (14): FloatingAction, FloatingActionBar(), FloatingActionBarProps, ToolTip(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+6 more)

### Community 67 - "Community 67"
Cohesion: 0.15
Nodes (6): AuthController, cookieOptions, AuthService, jwtHelper, OAuthProfile, prisma

### Community 68 - "Community 68"
Cohesion: 0.16
Nodes (14): formatShortcutKey(), MAC_SYMBOLS, parseShortcutKeys(), PlatformShortcuts, Tooltip(), TooltipContent, TooltipContentProps, TooltipContext (+6 more)

### Community 69 - "Community 69"
Cohesion: 0.15
Nodes (8): MediaController, router, MediaService, ContentSpec, html(), prisma, seed(), specs

### Community 70 - "Community 70"
Cohesion: 0.15
Nodes (8): MainToolbarContentProp, AvatarBadge(), HoverCard(), HoverCardContent(), HoverCardTrigger(), Spacer, SpacerOrientation, SpacerProps

### Community 71 - "Community 71"
Cohesion: 0.19
Nodes (13): MenuItem, Navbar1Props, NavigationMenuBar(), renderMenuItem(), NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem() (+5 more)

### Community 72 - "Community 72"
Cohesion: 0.14
Nodes (8): JwtHelper, KEYS_DIR, PRIVATE_KEY_PATH, privateKeyPem, PUBLIC_KEY_PATH, publicKeyPem, JwkController, jwtHelper

### Community 73 - "Community 73"
Cohesion: 0.14
Nodes (12): Document, DocumentPage, $Enums, MediaAsset, Newsletter, Post, PostBookmark, PostLike (+4 more)

### Community 74 - "Community 74"
Cohesion: 0.15
Nodes (12): Document, DocumentPage, $Enums, MediaAsset, Newsletter, Post, PostBookmark, PostLike (+4 more)

### Community 75 - "Community 75"
Cohesion: 0.36
Nodes (3): postId(), PostsController, userId()

### Community 77 - "Community 77"
Cohesion: 0.27
Nodes (10): getUserProfile(), updateUserProfile(), ProfileEditDialog(), ProfileEditDialogProps, ProfileFormData, socialLink, userBase, userProfile (+2 more)

### Community 79 - "Community 79"
Cohesion: 0.24
Nodes (9): BreadcrumbsArticle(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator() (+1 more)

### Community 80 - "Community 80"
Cohesion: 0.27
Nodes (9): CodeBlockIcon, canToggleCodeBlock(), CodeBlockButton, CodeBlockButtonProps, isCodeBlockActive(), isCodeBlockButtonDisabled(), shouldShowCodeBlockButton(), toggleCodeBlock() (+1 more)

### Community 82 - "Community 82"
Cohesion: 0.31
Nodes (9): BlockQuoteIcon, BlockquoteButton, BlockquoteButtonProps, canToggleBlockquote(), isBlockquoteActive(), isBlockquoteButtonDisabled(), shouldShowBlockquoteButton(), toggleBlockquote() (+1 more)

### Community 83 - "Community 83"
Cohesion: 0.22
Nodes (3): config, LogOptions, PrismaClientConstructor

### Community 84 - "Community 84"
Cohesion: 0.28
Nodes (6): CursorVisibilityOptions, TODO: Needed?, RectState, useCursorVisibility(), useWindowSize(), WindowSizeState

### Community 85 - "Community 85"
Cohesion: 0.25
Nodes (7): author, description, license, main, name, type, version

### Community 86 - "Community 86"
Cohesion: 0.25
Nodes (8): scripts, build, dev, seed:apache-kafka, seed:data-platform-content, seed:reading-platforms, start, typecheck

### Community 89 - "Community 89"
Cohesion: 0.29
Nodes (3): HttpServer, http, port

### Community 93 - "Community 93"
Cohesion: 0.38
Nodes (5): ArticleHeader(), ArticleHeaderProps, fadeUp, formatDate(), CommentsDrawer()

### Community 94 - "Community 94"
Cohesion: 0.33
Nodes (5): BambooLoader(), BambooLoaderProps, LoaderVariant, agbalumo, LogoProps

### Community 97 - "Community 97"
Cohesion: 0.53
Nodes (5): isPrivateIp(), metaContent(), Preview, router, safeUrl()

### Community 101 - "Community 101"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 102 - "Community 102"
Cohesion: 0.40
Nodes (3): containerVariants, iconVariants, itemVariants

### Community 103 - "Community 103"
Cohesion: 0.40
Nodes (3): containerVariants, iconVariants, itemVariants

### Community 104 - "Community 104"
Cohesion: 0.40
Nodes (3): config, PUBLIC_EXACT_ROUTES, PUBLIC_ROUTE_PREFIXES

### Community 107 - "Community 107"
Cohesion: 0.50
Nodes (3): ProfileTabContext, ProfileTabContextValue, ProfileTabProvider()

### Community 108 - "Community 108"
Cohesion: 0.67
Nodes (3): barWidth(), ThisWeek(), ThisWeekProps

### Community 109 - "Community 109"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

## Knowledge Gaps
- **1706 isolated node(s):** `name`, `version`, `description`, `license`, `author` (+1701 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **103 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 14` to `Community 35`, `Community 36`, `Community 38`, `Community 70`, `Community 71`, `Community 40`, `Community 10`, `Community 43`, `Community 12`, `Community 79`, `Community 18`, `Community 20`, `Community 55`, `Community 28`, `Community 31`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `DocumentDelegate` connect `Community 56` to `Community 5`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 12` to `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 70`, `Community 40`, `Community 10`, `Community 44`, `Community 45`, `Community 14`, `Community 18`, `Community 20`, `Community 55`, `Community 28`, `Community 93`, `Community 31`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _1706 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.014184397163120567 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.01639344262295082 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.017241379310344827 - nodes in this community are weakly interconnected._