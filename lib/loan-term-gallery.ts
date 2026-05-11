/** Types + URL helpers for Loan Term media slider / lightbox (images, YouTube, file video). */

export type LoanTermGalleryImageItem = {
  id: string
  kind: 'image'
  src: string
  alt: string
}

export type LoanTermGalleryYoutubeItem = {
  id: string
  kind: 'youtube'
  /** Watch URL, youtu.be, shorts, or embed URL */
  url: string
  alt: string
}

export type LoanTermGalleryVideoItem = {
  id: string
  kind: 'video'
  /** Direct URL to video file (mp4, webm, …) */
  src: string
  poster?: string
  alt: string
}

export type LoanTermGalleryItem =
  | LoanTermGalleryImageItem
  | LoanTermGalleryYoutubeItem
  | LoanTermGalleryVideoItem

export function parseYoutubeVideoId(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  try {
    const u = new URL(raw)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id || null
    }
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const embed = u.pathname.match(/\/embed\/([^/?]+)/)
      if (embed?.[1]) return embed[1]
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
      if (shorts?.[1]) return shorts[1]
    }
  } catch {
    return null
  }
  return null
}

const YOUTUBE_EMBED_QS = 'rel=0&playsinline=1'

export function getYoutubeEmbedUrl(input: string): string | null {
  const id = parseYoutubeVideoId(input)
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}?${YOUTUBE_EMBED_QS}`
}

/** Canonical watch URL for links when iframe/embed is unavailable or blocked. */
export function getYoutubeWatchUrl(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  const id = parseYoutubeVideoId(raw)
  if (id) return `https://www.youtube.com/watch?v=${id}`
  try {
    const u = new URL(raw)
    if (
      u.hostname.includes('youtube.com') ||
      u.hostname.includes('youtu.be')
    ) {
      return raw.split('&')[0] ?? raw
    }
  } catch {
    /* noop */
  }
  return null
}

/** Alternate embed host — useful when nocookie or policy quirks block playback. */
export function getYoutubeEmbedUrlAlternate(input: string): string | null {
  const id = parseYoutubeVideoId(input)
  if (!id) return null
  return `https://www.youtube.com/embed/${id}?${YOUTUBE_EMBED_QS}`
}

export function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}
