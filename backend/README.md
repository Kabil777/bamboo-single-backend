# Minimal Blog API

An Express, TypeScript and PostgreSQL API for public blog reading, authenticated likes, and owner/admin post management. Google OAuth creates users and issues short-lived JWT access cookies plus refresh tokens.

## Setup

Set `DATABASE_URL`, Google OAuth settings, `FRONTEND_URL`, and optionally `PORT` in `.env`. Set `ADMIN_EMAIL` to the verified Google email for the initial administrator. This is bootstrap configuration only; future role provisioning should be handled through protected, audited admin APIs. Create/update the schema before starting the server:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

The new migration preserves previously published blogs as posts, then deliberately removes legacy collaboration, documents, comments, sharing roles, follows, Redis/Yjs state, tags, and upload storage tables. Back up a production database before applying it.

## Authentication

Visit `GET /api/v1/auth/login/google` to begin Google login. The callback stores `ac_token` and `rf_token` HTTP-only cookies. `POST /api/v1/auth/refresh` renews the access cookie; `POST /api/v1/auth/logout` revokes the refresh token.

Protected API requests accept the access cookie or `Authorization: Bearer <access-token>`. A post can be changed or deleted only by its creator or a user whose database `users.role` is `ADMIN`.

## Routes

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | no | Service check |
| GET | `/api/v1/posts` | no | List posts |
| GET | `/api/v1/posts/:id` | optional | Read a post; includes `viewerHasLiked` when authenticated |
| POST | `/api/v1/posts` | yes | Create `{ title, content, mediaId? }` |
| PATCH | `/api/v1/posts/:id` | owner/admin | Update any supplied `title`, `content`, `mediaId` |
| DELETE | `/api/v1/posts/:id` | owner/admin | Delete a post |
| PUT | `/api/v1/posts/:id/like` | yes | Idempotently like; returns `{ likesCount, viewerHasLiked }` |
| DELETE | `/api/v1/posts/:id/like` | yes | Idempotently unlike; returns the same shape |
| POST | `/api/v1/media` | yes | Store `{ base64, mimeType, filename? }` in PostgreSQL (max 8 MiB) |
| GET | `/api/v1/media/:id` | no | Stream stored media |

## Example

```bash
TOKEN='your-access-token'

curl http://localhost:8092/api/v1/posts

curl -X POST http://localhost:8092/api/v1/posts \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Hello","content":"My first post"}'

curl -X PUT http://localhost:8092/api/v1/posts/POST_ID/like \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:8092/api/v1/media \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"mimeType":"image/png","filename":"cover.png","base64":"iVBORw0KGgo="}'
```
