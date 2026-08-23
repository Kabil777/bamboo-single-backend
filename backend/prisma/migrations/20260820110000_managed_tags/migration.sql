CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" VARCHAR(80) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tags_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "tags_category_label_key" UNIQUE ("category", "label"),
    CONSTRAINT "tags_category_check" CHECK ("category" IN ('DESIGNATION', 'INTEREST'))
);

CREATE INDEX "tags_category_idx" ON "tags"("category");

INSERT INTO "tags" ("label", "category") VALUES
    ('Developer', 'DESIGNATION'), ('Designer', 'DESIGNATION'), ('Product Manager', 'DESIGNATION'),
    ('Data Scientist', 'DESIGNATION'), ('DevOps Engineer', 'DESIGNATION'), ('QA Engineer', 'DESIGNATION'),
    ('Student', 'DESIGNATION'), ('Educator', 'DESIGNATION'), ('Founder', 'DESIGNATION'),
    ('Entrepreneur', 'DESIGNATION'), ('Writer', 'DESIGNATION'), ('Creator', 'DESIGNATION'), ('Other', 'DESIGNATION'),
    ('Developer', 'INTEREST'), ('Designer', 'INTEREST'), ('Writer', 'INTEREST'), ('Photographer', 'INTEREST'),
    ('Creator', 'INTEREST'), ('Artist', 'INTEREST'), ('Engineer', 'INTEREST'), ('Entrepreneur', 'INTEREST'),
    ('Student', 'INTEREST'), ('Teacher', 'INTEREST'), ('Manager', 'INTEREST'), ('Freelancer', 'INTEREST'),
    ('Product Manager', 'INTEREST'), ('Data Scientist', 'INTEREST'), ('DevOps', 'INTEREST'), ('QA Engineer', 'INTEREST'),
    ('Backend', 'INTEREST'), ('Frontend', 'INTEREST'), ('Full Stack', 'INTEREST'), ('Mobile Dev', 'INTEREST'),
    ('UI/UX', 'INTEREST'), ('Content Creator', 'INTEREST');
