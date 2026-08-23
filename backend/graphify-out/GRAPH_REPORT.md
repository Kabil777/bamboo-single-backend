# Graph Report - demo-ws  (2026-08-18)

## Corpus Check
- Corpus is ~15,182 words - fits in a single context window. You may not need a graph.

## Summary
- 549 nodes · 1021 edges · 56 communities (19 shown, 37 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Shared Types and Enums
- Blog HTTP Handlers
- Package Tooling
- Auth Middleware
- HTTP Server Routes
- OAuth Controllers
- Error and Save Helpers
- Document Tree Helpers
- TypeScript Build Setup
- Redis Collaboration State
- Comment WebSocket Events
- Collaboration Authentication
- JWT Token Validation
- Save Request Authorization
- Runtime Dependencies
- User Following Service
- User Profile Services
- HTTP Access Control
- Hocuspocus Persistence
- Blog Query Service
- Blog Role Management
- API Common Types
- Document Rendering
- AWS S3 Dependency
- Cookie Parser Dependency
- Dotenv Dependency
- Express Dependency
- Hocuspocus Logger Dependency
- Hocuspocus Redis Dependency
- Hocuspocus Provider Dependency
- Hocuspocus Server Dependency
- Hocuspocus Transformer Dependency
- Jose Dependency
- Multer Dependency
- Passport Dependency
- Google OAuth Dependency
- Pino Dependency
- Prisma PostgreSQL Adapter
- Prisma Client Dependency
- Redis Dependency
- Tiptap Collaboration Dependency
- Tiptap Highlight Dependency
- Tiptap Image Dependency
- Tiptap Link Dependency
- Tiptap Subscript Dependency
- Tiptap Superscript Dependency
- Tiptap Table Dependency
- Tiptap Task Item Dependency
- Tiptap Task List Dependency
- Tiptap Text Align Dependency
- Tiptap Typography Dependency
- Tiptap Underline Dependency
- Tiptap Starter Kit Dependency
- WebSocket Dependency
- Yjs Dependency

## God Nodes (most connected - your core abstractions)
1. `routeParam()` - 42 edges
2. `PrismaManager` - 24 edges
3. `optionalQuery()` - 19 edges
4. `JwtHelper` - 18 edges
5. `CollabServer` - 18 edges
6. `AuthError` - 14 edges
7. `UserCountService` - 14 edges
8. `HocuspocusHooks` - 14 edges
9. `Visibility` - 13 edges
10. `UserController` - 13 edges

## Surprising Connections (you probably didn't know these)
- `authenticateHttpRequest()` --calls--> `normalizeAuthError()`  [EXTRACTED]
  src/http/auth/accessControl.ts → src/lib/exceptions/AuthException.ts
- `BlogSaveController` --references--> `JwtHelper`  [EXTRACTED]
  src/http/controllers/blogSaveController/blogSaveController.ts → src/lib/jwt.ts
- `BlogSaveController` --references--> `BlogStateRepository`  [EXTRACTED]
  src/http/controllers/blogSaveController/blogSaveController.ts → src/repository/collab/BlogStateRepository.ts
- `DocsController` --references--> `JwtHelper`  [EXTRACTED]
  src/http/controllers/blogSaveController/docsSaveController.ts → src/lib/jwt.ts
- `DocsController` --references--> `DocsSidebarStateRepository`  [EXTRACTED]
  src/http/controllers/blogSaveController/docsSaveController.ts → src/repository/collab/DocsSideBarState.ts

## Import Cycles
- None detected.

## Communities (56 total, 37 thin omitted)

### Community 0 - "Shared Types and Enums"
Cohesion: 0.05
Nodes (30): Designation, PostStatus, Roles, SocialPlatform, Visibility, AppError, ForbiddenError, NotFoundError (+22 more)

### Community 1 - "Blog HTTP Handlers"
Cohesion: 0.05
Nodes (13): optionalQuery(), requiredQuery(), routeParam(), BlogController, BlogRoleController, CommentController, CommentCommandService, CommentQueryService (+5 more)

### Community 2 - "Package Tooling"
Cohesion: 0.06
Nodes (35): author, description, devDependencies, prisma, tsx, @types/cookie-parser, @types/express, @types/multer (+27 more)

### Community 3 - "Auth Middleware"
Cohesion: 0.10
Nodes (15): authOptional(), authRequired(), jwtHelper, createCorsMiddleware(), errorHandler(), router, router, router (+7 more)

### Community 4 - "HTTP Server Routes"
Cohesion: 0.13
Nodes (7): BlogSaveController, DocsController, HttpServer, HttpRoutes, initServer(), CollabServer, UpgradeHandler

### Community 5 - "OAuth Controllers"
Cohesion: 0.10
Nodes (12): AuthController, cookieOptions, authRouter, rootRouter, router, AuthService, jwtHelper, OAuthProfile (+4 more)

### Community 6 - "Error and Save Helpers"
Cohesion: 0.24
Nodes (9): blogSaveType, AuthError, logger, RedisClient, authError, AuthReason, BuildErrorInput, CollabDocInfo (+1 more)

### Community 7 - "Document Tree Helpers"
Cohesion: 0.14
Nodes (19): PostStatus, Visibility, buildTree(), DocsContentPayload, DocsTreeNode, extractSidebarNodes(), getPageDoc(), getSidebarDoc() (+11 more)

### Community 8 - "TypeScript Build Setup"
Cohesion: 0.10
Nodes (19): dist, node, node_modules, src/**/*.ts, compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module (+11 more)

### Community 9 - "Redis Collaboration State"
Cohesion: 0.18
Nodes (3): RedisManager, DocsSidebarStateRepository, DocsStateRepository

### Community 10 - "Comment WebSocket Events"
Cohesion: 0.15
Nodes (9): BroadcastFn, CommentEvent, DeleteMessage, MessageFormat, PublishedMessage, PublishFn, TypingMessage, WsCommentHandler (+1 more)

### Community 11 - "Collaboration Authentication"
Cohesion: 0.19
Nodes (11): buildAuthUser(), AuthContext, AuthUser, ConnectionConfig, OnAuthenticateResult, OnAuthenticationArgs, RoleInfo, OnDisconnectArgs (+3 more)

### Community 12 - "JWT Token Validation"
Cohesion: 0.17
Nodes (7): ValidatedUser, JwtHelper, KEYS_DIR, PRIVATE_KEY_PATH, privateKeyPem, PUBLIC_KEY_PATH, publicKeyPem

### Community 13 - "Save Request Authorization"
Cohesion: 0.18
Nodes (4): requireBlogAccess(), parseRequestUser(), validateToken(), BlogStateRepository

### Community 14 - "Runtime Dependencies"
Cohesion: 0.18
Nodes (11): axios, cookie, dependencies, axios, cookie, pg, @tiptap/extension-code-block-lowlight, @tiptap/static-renderer (+3 more)

### Community 17 - "HTTP Access Control"
Cohesion: 0.29
Nodes (6): AuthenticatedUser, authenticateHttpRequest(), jwtHelper, requireDocsAccess(), isAuthError(), normalizeAuthError()

### Community 18 - "Hocuspocus Persistence"
Cohesion: 0.36
Nodes (3): buildError(), parseCollabDocumentName(), HocuspocusHooks

### Community 21 - "API Common Types"
Cohesion: 0.50
Nodes (3): ApiResponse, AuthenticatedUser, CursorPaginationResult

## Knowledge Gaps
- **130 isolated node(s):** `name`, `version`, `description`, `license`, `author` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PrismaManager` connect `Shared Types and Enums` to `Blog HTTP Handlers`, `OAuth Controllers`, `Error and Save Helpers`, `Collaboration Authentication`, `Save Request Authorization`, `HTTP Access Control`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `routeParam()` connect `Blog HTTP Handlers` to `Shared Types and Enums`, `Auth Middleware`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `JwtHelper` connect `JWT Token Validation` to `Auth Middleware`, `HTTP Server Routes`, `OAuth Controllers`, `Error and Save Helpers`, `Comment WebSocket Events`, `Collaboration Authentication`, `HTTP Access Control`, `Hocuspocus Persistence`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared Types and Enums` be split into smaller, more focused modules?**
  _Cohesion score 0.05389942788316772 - nodes in this community are weakly interconnected._
- **Should `Blog HTTP Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.05110809588421529 - nodes in this community are weakly interconnected._
- **Should `Package Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._