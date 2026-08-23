CREATE TABLE "post_bookmarks" (
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_bookmarks_pkey" PRIMARY KEY ("post_id", "user_id")
);

CREATE TABLE "newsletters" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "author_id" UUID NOT NULL,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "post_bookmarks_user_id_idx" ON "post_bookmarks"("user_id");
CREATE INDEX "newsletters_status_published_at_idx" ON "newsletters"("status", "published_at");
CREATE INDEX "newsletters_author_id_idx" ON "newsletters"("author_id");
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
