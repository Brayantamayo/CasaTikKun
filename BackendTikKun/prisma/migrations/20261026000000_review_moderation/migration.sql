CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED');

-- Existing reviews were already visible publicly, so preserve their published state.
ALTER TABLE "reviews" ADD COLUMN "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING';
UPDATE "reviews" SET "status" = 'PUBLISHED';

-- Enforce the new public cap immediately, keeping the 15 most recent existing reviews.
DELETE FROM "reviews"
WHERE "id" IN (
    SELECT "id"
    FROM "reviews"
    WHERE "status" = 'PUBLISHED'
    ORDER BY "created_at" DESC, "id" DESC
    OFFSET 15
);

CREATE INDEX "reviews_status_created_at_idx" ON "reviews"("status", "created_at");
