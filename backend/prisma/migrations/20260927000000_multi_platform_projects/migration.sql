-- Allow a single project to target web, mobile, and desktop simultaneously.
ALTER TABLE "Project" ADD COLUMN "categories" "Category"[] NOT NULL DEFAULT ARRAY[]::"Category"[];
UPDATE "Project" SET "categories" = ARRAY["category"]::"Category"[];
