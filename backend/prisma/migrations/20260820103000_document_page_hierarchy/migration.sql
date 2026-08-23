ALTER TABLE "document_pages" ADD COLUMN "parent_id" UUID;

CREATE INDEX "document_pages_parent_id_idx" ON "document_pages"("parent_id");

ALTER TABLE "document_pages"
    ADD CONSTRAINT "document_pages_parent_id_fkey"
    FOREIGN KEY ("parent_id") REFERENCES "document_pages"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
