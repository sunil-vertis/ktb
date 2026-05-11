/**
 * Loads https://www.youtube.com/iframe_api once and resolves when `YT.Player` is ready.
 * Used to detect embed errors (e.g. owner disabled playback on other sites).
 */

declare global {
  interface Window {
    YT?: {
      Player: new (
        container: HTMLElement | string,
        options: YoutubeIframePlayerOptions
      ) => YoutubeIframePlayer
    }
    onYouTubeIframeAPIReady?: () => void
    __ktbYtIframeApiCallbacks?: Array<() => void>
  }
}

export type YoutubeIframePlayerOptions = {
  videoId?: string
  width?: string | number
  height?: string | number
  playerVars?: Record<string, string | number | undefined>
  events?: {
    onReady?: (event: unknown) => void
    onError?: (event: { data: number }) => void
  }
}

export type YoutubeIframePlayer = {
  destroy(): void
}

let loadPromise: Promise<void> | null = null

export function loadYoutubeIframeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()

  if (!loadPromise) {
    loadPromise = new Promise<void>((resolve) => {
      const win = window
      const queued = win.__ktbYtIframeApiCallbacks ?? []
      win.__ktbYtIframeApiCallbacks = queued
      queued.push(resolve)

      if (queued.length === 1) {
        const previousReady = win.onYouTubeIframeAPIReady
        win.onYouTubeIframeAPIReady = () => {
          previousReady?.()
          win.__ktbYtIframeApiCallbacks?.splice(0).forEach((cb) => cb())
          win.__ktbYtIframeApiCallbacks = []
        }

        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        tag.async = true
        document.head.appendChild(tag)
      }
    })
  }

  return loadPromise
}

/**
 * YouTube IFrame API `onError` values where in-page playback will not work.
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 */
export function isYoutubeEmbedFatalError(code: number): boolean {
  return (
    code === 100 ||
    code === 101 ||
    code === 105 ||
    code === 150 ||
    code === 153
  )
}
