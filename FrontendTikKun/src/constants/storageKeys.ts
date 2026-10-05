/**
 * Centralized storage keys, system limits, and API endpoints.
 * Keeps local persistence and future REST/Database integration unified.
 */

export const STORAGE_KEYS = {
  ADMIN_AUTH: 'casatikkun_admin_auth',
  ADMIN_PASS: 'casatikkun_admin_pass',
  RATES_OVERRIDES: 'casatikkun_rates_overrides',
  CUSTOM_CABINS: 'casatikkun_custom_cabins',
  MODIFIED_CABINS: 'casatikkun_modified_cabins',
  DELETED_CABINS: 'casatikkun_deleted_cabins',
  HERO_IMAGES: 'casatikkun_hero_images',
  GALLERY_IMAGES: 'casatikkun_gallery_images',
  GUEST_REVIEWS: 'casatikkun_guest_reviews_v1',
  BOOKING_INQUIRIES: 'casatikkun_booking_inquiries_v1'
} as const;

export const APP_LIMITS = {
  MAX_REVIEWS: 10,
  MAX_CABIN_PHOTOS: 10,
  MAX_IMAGE_WIDTH_PX: 1400,
  IMAGE_QUALITY: 0.82
} as const;

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  CABINS: '/api/cabins',
  REVIEWS: '/api/reviews',
  MEDIA: '/api/media',
  BOOKINGS: '/api/bookings',
  AUTH_LOGIN: '/api/auth/login'
} as const;

export const DEFAULT_ADMIN_CREDENTIALS = {
  USER: 'admin@casatikkun.com',
  SHORT_USER: 'admin',
  PASS: 'Tikkun2026*'
} as const;
