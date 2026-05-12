/** Canonical public URLs for brand assets (no trailing slash on origin). */
export const SITE_ORIGIN = 'https://multiservicios.app'
export const LOGO_PATH = '/logo-multiservicios.png'
export const OG_IMAGE_PATH = '/og-image.jpg'

/**
 * Intrinsic pixel dimensions of /logo-multiservicios.png after transparent
 * background removal + auto-crop (see scripts/make_logo_transparent.py).
 * Width/height ratio ~1.16 — the logo is a stacked emblem + wordmark.
 */
export const LOGO_INTRINSIC_WIDTH = 668
export const LOGO_INTRINSIC_HEIGHT = 576

/** Visible nav dimensions — keep aspect ratio of source PNG. */
export const LOGO_NAV_HEIGHT = 48
export const LOGO_NAV_WIDTH = 56 // ~48 * (668/576)
