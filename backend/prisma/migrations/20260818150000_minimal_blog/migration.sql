-- Reduce the collaboration/document application to a standalone blog.
-- Existing public blog rows are preserved as posts. All collaboration,
-- comments, roles, tags, follows and document data are intentionally removed.

CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "media_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "data" BYTEA NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "filename" VARCHAR(255),
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "post_likes" (
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("post_id", "user_id")
);

INSERT INTO "posts" ("id", "title", "content", "author_id", "created_at", "updated_at")
SELECT
    b."id",
    b."title",
    COALESCE(c."content", b."description", ''),
    b."author_id",
    b."created_at",
    COALESCE(b."updated_at", b."created_at")
FROM "blogs" b
LEFT JOIN "blog_content" c ON c."blog_id" = b."id"
WHERE b."visibility" = 'PUBLIC' AND b."status" = 'PUBLISHED';

CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");
CREATE INDEX "media_assets_owner_id_idx" ON "media_assets"("owner_id");
CREATE INDEX "post_likes_user_id_idx" ON "post_likes"("user_id");

ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "posts" ADD CONSTRAINT "posts_media_id_fkey"
    FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_id_fkey"
    FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_fkey"
    FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE IF EXISTS "_BlogToTag" CASCADE;
DROP TABLE IF EXISTS "_DocsToTag" CASCADE;
DROP TABLE IF EXISTS "blog_page_state" CASCADE;
DROP TABLE IF EXISTS "docs_page_state" CASCADE;
DROP TABLE IF EXISTS "docs_sidebar_state" CASCADE;
DROP TABLE IF EXISTS "canonical_sync_jobs" CASCADE;
DROP TABLE IF EXISTS "blog_roles" CASCADE;
DROP TABLE IF EXISTS "docs_roles" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "pages" CASCADE;
DROP TABLE IF EXISTS "docs" CASCADE;
DROP TABLE IF EXISTS "tags" CASCADE;
DROP TABLE IF EXISTS "bookmarks" CASCADE;
DROP TABLE IF EXISTS "followers" CASCADE;
DROP TABLE IF EXISTS "user_counts" CASCADE;
DROP TABLE IF EXISTS "blog_content" CASCADE;
DROP TABLE IF EXISTS "blogs" CASCADE;

ALTER TABLE "users" DROP COLUMN IF EXISTS "handle";
ALTER TABLE "users" DROP COLUMN IF EXISTS "description";
ALTER TABLE "users" DROP COLUMN IF EXISTS "cover_url";
ALTER TABLE "users" DROP COLUMN IF EXISTS "designation";
ALTER TABLE "users" DROP COLUMN IF EXISTS "user_profile";
