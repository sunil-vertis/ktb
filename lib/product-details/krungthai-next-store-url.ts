/** Krungthai NEXT official store listings (mobile deep links). */
export const KRUNGTHAI_NEXT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=ktbcs.netbank&hl'

export const KRUNGTHAI_NEXT_APP_STORE_URL =
  'https://apps.apple.com/th/app/krungthai-next/id436753378'

/**
 * Resolves the appropriate store URL for the current device (client-only).
 * Android → Google Play; iPhone/iPad/iPod (incl. iPadOS “MacIntel” + touch) → App Store; otherwise Play Store as default.
 */
export function getKrungthaiNextStoreUrl(): string {
  if (typeof navigator === 'undefined') {
    return KRUNGTHAI_NEXT_PLAY_STORE_URL
  }
  const ua = navigator.userAgent
  if (/android/i.test(ua)) {
    return KRUNGTHAI_NEXT_PLAY_STORE_URL
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return KRUNGTHAI_NEXT_APP_STORE_URL
  }
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return KRUNGTHAI_NEXT_APP_STORE_URL
  }
  return KRUNGTHAI_NEXT_PLAY_STORE_URL
}

/** Matches `_product-details-block.scss`: `(max-width: 1024px)` is stacked / “mobile” layout. */
export function isPdpDesktopLayoutViewport(): boolean {
  if (typeof window === 'undefined') return true
  return window.innerWidth > 1024
}

/**
 * Phone / tablet / device-mode UA. Chrome DevTools “mobile simulation” often keeps a wide
 * viewport but sends a mobile UA — we still want the store link, not the desktop modal.
 */
export function isMobileLikeUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true
  if (/\bMobile\b/i.test(ua)) return true
  const uaData = (
    navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  ).userAgentData
  if (uaData?.mobile === true) return true
  return false
}

/** Desktop modal: wide layout on a desktop-class browser only. */
export function shouldOpenKrungthaiNextModal(): boolean {
  if (typeof window === 'undefined') return true
  if (isMobileLikeUserAgent()) return false
  return isPdpDesktopLayoutViewport()
}
