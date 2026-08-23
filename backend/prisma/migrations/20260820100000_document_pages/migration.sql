CREATE TABLE "document_pages" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_pages_document_id_position_key" ON "document_pages"("document_id", "position");
CREATE INDEX "document_pages_document_id_idx" ON "document_pages"("document_id");

ALTER TABLE "document_pages"
    ADD CONSTRAINT "document_pages_document_id_fkey"
    FOREIGN KEY ("document_id") REFERENCES "documents"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
