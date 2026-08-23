CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "media_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "documents_author_id_idx" ON "documents"("author_id");
CREATE INDEX "documents_created_at_idx" ON "documents"("created_at");

ALTER TABLE "documents"
    ADD CONSTRAINT "documents_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents"
    ADD CONSTRAINT "documents_media_id_fkey"
    FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
