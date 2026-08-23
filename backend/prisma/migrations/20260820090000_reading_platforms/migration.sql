CREATE TABLE "reading_platforms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "website_url" TEXT NOT NULL,
    "cover_source_url" TEXT NOT NULL,
    "description" TEXT,
    "cover_media_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_platforms_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reading_platforms_slug_key" ON "reading_platforms"("slug");
CREATE UNIQUE INDEX "reading_platforms_cover_media_id_key" ON "reading_platforms"("cover_media_id");

ALTER TABLE "reading_platforms"
    ADD CONSTRAINT "reading_platforms_cover_media_id_fkey"
    FOREIGN KEY ("cover_media_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
