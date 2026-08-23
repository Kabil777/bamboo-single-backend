ALTER TABLE "posts" ADD COLUMN "visibility" VARCHAR(12) NOT NULL DEFAULT 'PUBLIC';
ALTER TABLE "documents" ADD COLUMN "visibility" VARCHAR(12) NOT NULL DEFAULT 'PUBLIC';
CREATE INDEX "posts_visibility_created_at_idx" ON "posts"("visibility", "created_at");
CREATE INDEX "documents_visibility_created_at_idx" ON "documents"("visibility", "created_at");
