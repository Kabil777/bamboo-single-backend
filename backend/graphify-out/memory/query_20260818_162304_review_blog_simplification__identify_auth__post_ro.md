---
type: "query"
date: "2026-08-18T16:23:04.943631+00:00"
question: "review blog simplification: identify auth, post routes, collaboration Yjs Redis S3 filesystem or storage dependencies"
contributor: "graphify"
outcome: "useful"
source_nodes: ["PostsService", "MediaService", "HocuspocusHooks.ts"]
---

# Q: review blog simplification: identify auth, post routes, collaboration Yjs Redis S3 filesystem or storage dependencies

## Answer

Expanded from original query via vocab: [auth, collaboration, comment, document, follow, post, redis, storage, yjs]. Current source implements public posts, authenticated likes, owner-or-DB-ADMIN update/delete and PostgreSQL BYTEA media. Relevant legacy collaboration remains in historical migration files. Creation is authenticated but not ADMIN-restricted.

## Outcome

- Signal: useful

## Source Nodes

- PostsService
- MediaService
- HocuspocusHooks.ts