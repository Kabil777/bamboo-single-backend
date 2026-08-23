-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "handle" VARCHAR(50),
    "picture_url" VARCHAR(255),
    "description" TEXT,
    "cover_url" TEXT,
    "provider" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "designation" TEXT,
    "user_profile" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followers" (
    "id" UUID NOT NULL,
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "blog_id" UUID NOT NULL,
    "type" TEXT,
    "user_id" UUID NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("blog_id")
);

-- CreateTable
CREATE TABLE "user_counts" (
    "user_id" UUID NOT NULL,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "following_count" INTEGER NOT NULL DEFAULT 0,
    "blog_counts" JSONB NOT NULL DEFAULT '{}',
    "docs_counts" JSONB NOT NULL DEFAULT '{}',
    "other_counts" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "user_counts_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "cover_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'PRIVATE',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_content" (
    "blog_id" UUID NOT NULL,
    "content" TEXT,

    CONSTRAINT "blog_content_pkey" PRIMARY KEY ("blog_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "tag" VARCHAR(20) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_roles" (
    "id" UUID NOT NULL,
    "blog_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_name" TEXT,
    "user_handle" TEXT,
    "user_cover_url" TEXT,
    "user_email" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "blog_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "room" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "replies" JSON,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "cover_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "tree" JSONB,
    "author_id" UUID NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'PRIVATE',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "page_id" UUID NOT NULL,
    "doc_id" UUID NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "docs_roles" (
    "id" UUID NOT NULL,
    "docs_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_name" TEXT,
    "user_handle" TEXT,
    "user_cover_url" TEXT,
    "user_email" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "docs_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_BlogToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DocsToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_DocsToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_handle_key" ON "users"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "users_cover_url_key" ON "users"("cover_url");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_provider_id_key" ON "users"("email", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_user_id_key" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_refresh_token_key" ON "refresh_tokens"("refresh_token");

-- CreateIndex
CREATE INDEX "followers_follower_id_idx" ON "followers"("follower_id");

-- CreateIndex
CREATE INDEX "followers_following_id_idx" ON "followers"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "followers_follower_id_following_id_key" ON "followers"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "blogs_created_at_idx" ON "blogs"("created_at");

-- CreateIndex
CREATE INDEX "blogs_author_id_idx" ON "blogs"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_tag_key" ON "tags"("tag");

-- CreateIndex
CREATE INDEX "blog_roles_blog_id_idx" ON "blog_roles"("blog_id");

-- CreateIndex
CREATE INDEX "blog_roles_user_id_idx" ON "blog_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_roles_blog_id_user_id_key" ON "blog_roles"("blog_id", "user_id");

-- CreateIndex
CREATE INDEX "comments_room_created_at_idx" ON "comments"("room", "created_at");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "docs_author_id_idx" ON "docs"("author_id");

-- CreateIndex
CREATE INDEX "docs_created_at_idx" ON "docs"("created_at");

-- CreateIndex
CREATE INDEX "pages_doc_id_page_id_idx" ON "pages"("doc_id", "page_id");

-- CreateIndex
CREATE INDEX "docs_roles_docs_id_idx" ON "docs_roles"("docs_id");

-- CreateIndex
CREATE INDEX "docs_roles_user_id_idx" ON "docs_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "docs_roles_docs_id_user_id_key" ON "docs_roles"("docs_id", "user_id");

-- CreateIndex
CREATE INDEX "_BlogToTag_B_index" ON "_BlogToTag"("B");

-- CreateIndex
CREATE INDEX "_DocsToTag_B_index" ON "_DocsToTag"("B");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_counts" ADD CONSTRAINT "user_counts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_content" ADD CONSTRAINT "blog_content_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_roles" ADD CONSTRAINT "blog_roles_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_roles" ADD CONSTRAINT "blog_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs_roles" ADD CONSTRAINT "docs_roles_docs_id_fkey" FOREIGN KEY ("docs_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs_roles" ADD CONSTRAINT "docs_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_page_state" ADD CONSTRAINT "blog_page_state_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs_page_state" ADD CONSTRAINT "docs_page_state_docs_id_fkey" FOREIGN KEY ("docs_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs_sidebar_state" ADD CONSTRAINT "docs_sidebar_state_docs_id_fkey" FOREIGN KEY ("docs_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToTag" ADD CONSTRAINT "_BlogToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToTag" ADD CONSTRAINT "_BlogToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocsToTag" ADD CONSTRAINT "_DocsToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocsToTag" ADD CONSTRAINT "_DocsToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
