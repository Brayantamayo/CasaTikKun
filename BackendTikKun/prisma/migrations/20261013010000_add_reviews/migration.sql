CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "guest_name" VARCHAR(100) NOT NULL,
    "guest_city" VARCHAR(120) NOT NULL DEFAULT 'Medellín, Colombia',
    "email_hash" CHAR(64) NOT NULL,
    "rating" INTEGER NOT NULL,
    "cabin_id" VARCHAR(100) NOT NULL,
    "cabin_name" VARCHAR(150) NOT NULL,
    "comment" VARCHAR(2000) NOT NULL,
    "travel_type" VARCHAR(50) NOT NULL DEFAULT 'En Pareja',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reviews_email_hash_key" ON "reviews"("email_hash");
CREATE INDEX "reviews_created_at_idx" ON "reviews"("created_at");
