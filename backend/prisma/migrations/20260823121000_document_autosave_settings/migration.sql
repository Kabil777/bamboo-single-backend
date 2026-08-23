ALTER TABLE "system_settings"
    ADD COLUMN "document_autosave_enabled" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN "document_autosave_delay" INTEGER NOT NULL DEFAULT 700;
