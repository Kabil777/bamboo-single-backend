CREATE TABLE "system_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "collaboration_enabled" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "system_settings" ("id", "collaboration_enabled") VALUES (1, false)
ON CONFLICT ("id") DO NOTHING;
