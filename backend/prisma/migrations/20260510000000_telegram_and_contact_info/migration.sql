-- AlterTable AboutContent: add contact info fields
ALTER TABLE "AboutContent" ADD COLUMN "contactEmail" TEXT;
ALTER TABLE "AboutContent" ADD COLUMN "contactPhone" TEXT;
ALTER TABLE "AboutContent" ADD COLUMN "location" TEXT;

-- AlterTable ContactSubmission: add telegramUsername, make email optional, drop phone
ALTER TABLE "ContactSubmission" ADD COLUMN "telegramUsername" TEXT;
ALTER TABLE "ContactSubmission" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "ContactSubmission" DROP COLUMN IF EXISTS "phone";
