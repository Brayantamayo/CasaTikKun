CREATE TABLE "site_media" (
    "id" VARCHAR(16) NOT NULL DEFAULT 'main',
    "hero_images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "gallery_images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_media_pkey" PRIMARY KEY ("id")
);
