'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import clsx from 'clsx'
import type { Swiper as SwiperClass } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import { GlobalIcon } from '@/components/ui/global-icon'

import type { LoanTermMediaGallerySectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'
import {
  getYoutubeThumbnailUrl,
  getYoutubeWatchUrl,
  parseYoutubeVideoId,
  type LoanTermGalleryItem,
} from '@/lib/loan-term-gallery'

import { linkToAbsoluteUrl, mediaRefToUrl } from './map-cms'
import {
  isYoutubeEmbedFatalError,
  loadYoutubeIframeApi,
  type YoutubeIframePlayer,
} from '@/lib/youtube-iframe-api-loader'

export type LoanTermMediaGallerySectionProps = {
  title?: string
  subtitle?: string
  items?: LoanTermGalleryItem[]
  className?: string
  sectionId?: string
  zoomLabel?: string
}

const DEFAULT_TITLE = 'Loan Term'
const DEFAULT_SUBTITLE =
  'The loan term is set at one year, with the contract remaining valid year after year without the need for renewal.'

export const LOAN_TERM_GALLERY_DEFAULT_ITEMS: LoanTermGalleryItem[] = [
  {
    id: 'default-slide',
    kind: 'image',
    src: '/assets/loan-interest/gallery-slide-default.png',
    alt: 'Loan term overview',
  },
  {
    id: 'product-video-youtube',
    kind: 'youtube',
    url: 'https://www.youtube.com/watch?v=KyC_mKy7Zf8',
    alt: 'Product video on YouTube',
  },
]

function YoutubeGalleryPlayer({
  videoId,
  title,
  watchUrl,
  thumbId,
  alt,
  variant,
  onEmbedBlocked,
}: {
  videoId: string
  title: string
  watchUrl: string
  thumbId: string | null
  alt: string
  variant: 'slide' | 'lightbox'
  onEmbedBlocked?: (blocked: boolean) => void
}) {
  const [blocked, setBlocked] = React.useState(false)
  const hostRef = React.useRef<HTMLDivElement>(null)
  const playerRef = React.useRef<YoutubeIframePlayer | null>(null)

  const destroyPlayer = React.useCallback(() => {
    try {
      playerRef.current?.destroy()
    } catch {
      /* noop */
    }
    playerRef.current = null
  }, [])

  React.useEffect(() => {
    onEmbedBlocked?.(blocked)
  }, [blocked, onEmbedBlocked])

  React.useEffect(() => {
    setBlocked(false)
  }, [videoId])

  React.useEffect(() => {
    if (blocked) return

    let cancelled = false

    loadYoutubeIframeApi().then(() => {
      if (cancelled || !hostRef.current) return
      try {
        destroyPlayer()
        playerRef.current = new window.YT!.Player(hostRef.current, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
          },
          events: {
            onError: (e: { data: number }) => {
              if (isYoutubeEmbedFatalError(e.data)) {
                destroyPlayer()
                setBlocked(true)
              }
            },
          },
        })
      } catch {
        destroyPlayer()
        setBlocked(true)
      }
    })

    return () => {
      cancelled = true
      destroyPlayer()
    }
  }, [videoId, blocked, destroyPlayer])

  const hostClass =
    variant === 'slide'
      ? 'loan-term-gallery__slide-youtube-iframe-host'
      : 'loan-term-gallery__iframe'

  const shellClass =
    variant === 'slide'
      ? 'loan-term-gallery__youtube-shell loan-term-gallery__youtube-shell--slide'
      : 'loan-term-gallery__youtube-shell loan-term-gallery__youtube-shell--lightbox'

  return (
    <div className={shellClass}>
      {/* Host node must stay mounted: YT.Player mutates its DOM; swapping branches breaks React reconciliation. */}
      <div
        ref={hostRef}
        className={clsx(
          hostClass,
          blocked && 'loan-term-gallery__youtube-host--blocked'
        )}
        role="region"
        aria-label={title}
        aria-hidden={blocked}
      />
      {blocked ? (
        <div className="loan-term-gallery__youtube-fallback-layer">
          <YoutubeNoEmbedFallback
            watchUrl={watchUrl}
            thumbId={thumbId}
            alt={alt}
            tone={variant === 'slide' ? 'stage' : 'modal'}
          />
        </div>
      ) : null}
    </div>
  )
}

function YoutubeNoEmbedFallback({
  watchUrl,
  thumbId,
  alt,
  tone = 'modal',
}: {
  watchUrl: string
  thumbId: string | null
  alt: string
  tone?: 'modal' | 'stage'
}) {
  const thumb =
    thumbId != null ? getYoutubeThumbnailUrl(thumbId) : null

  return (
    <div
      className={clsx(
        'loan-term-gallery__youtube-fallback-card',
        tone === 'stage' && 'loan-term-gallery__youtube-fallback-card--stage'
      )}
    >
      {thumb ? (
        <div className="loan-term-gallery__youtube-fallback-thumb">
          <Image
            src={thumb}
            alt=""
            fill
            className="loan-term-gallery__youtube-fallback-thumb-img"
            sizes="(max-width: 768px) 100vw, 820px"
            unoptimized
          />
        </div>
      ) : null}
      <p className="loan-term-gallery__youtube-fallback-msg type-body-base-regular">
        Playback on other websites is turned off for this video (or it cannot be
        shown here). Watch it on YouTube instead.
      </p>
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="loan-term-gallery__youtube-fallback-cta type-body-base-medium"
      >
        {alt}
      </a>
    </div>
  )
}

function LightboxYoutubePanel({
  className,
  alt,
  watchUrl,
  videoId,
}: {
  className?: string
  alt: string
  watchUrl: string
  videoId: string
}) {
  const [embedBlocked, setEmbedBlocked] = React.useState(false)

  return (
    <div className={clsx('loan-term-gallery__youtube-lightbox', className)}>
      <div className="loan-term-gallery__youtube-player-area">
        <div
          className={clsx(
            'loan-term-gallery__lightbox-frame',
            'loan-term-gallery__lightbox-frame--video'
          )}
        >
          <YoutubeGalleryPlayer
            videoId={videoId}
            title={alt}
            watchUrl={watchUrl}
            thumbId={videoId}
            alt={alt}
            variant="lightbox"
            onEmbedBlocked={setEmbedBlocked}
          />
        </div>
      </div>
      {watchUrl && !embedBlocked ? (
        <p className="loan-term-gallery__youtube-external type-body-small-regular">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="loan-term-gallery__youtube-external-link"
          >
            Watch on YouTube
          </a>
          <span className="loan-term-gallery__youtube-external-hint">
            {' '}
            if the player does not load or embedding is disabled.
          </span>
        </p>
      ) : null}
    </div>
  )
}

function SlideVisual({
  item,
  fillClassName,
}: {
  item: LoanTermGalleryItem
  fillClassName: string
}) {
  if (item.kind === 'image') {
    return (
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className={fillClassName}
        sizes="(max-width: 768px) 100vw, 820px"
        priority
      />
    )
  }

  if (item.kind === 'youtube') {
    const id = parseYoutubeVideoId(item.url)
    const watchUrl = getYoutubeWatchUrl(item.url)
    const thumbFallback =
      id != null
        ? getYoutubeThumbnailUrl(id)
        : '/assets/loan-interest/gallery-slide-default.png'

    if (id && watchUrl) {
      return (
        <div className="loan-term-gallery__slide-youtube-wrap">
          <YoutubeGalleryPlayer
            videoId={id}
            title={item.alt}
            watchUrl={watchUrl}
            thumbId={id}
            alt={item.alt}
            variant="slide"
          />
        </div>
      )
    }

    return (
      <Image
        src={thumbFallback}
        alt={item.alt}
        fill
        className={fillClassName}
        sizes="(max-width: 768px) 100vw, 820px"
        unoptimized
      />
    )
  }

  return (
    <video
      className={clsx(fillClassName, 'loan-term-gallery__slide-video')}
      src={item.src}
      poster={item.poster}
      muted
      playsInline
      preload="metadata"
      aria-label={item.alt}
    />
  )
}

function LightboxContent({
  item,
  className,
}: {
  item: LoanTermGalleryItem
  className?: string
}) {
  if (item.kind === 'image') {
    return (
      <div className={clsx('loan-term-gallery__lightbox-media', className)}>
        <div className="loan-term-gallery__lightbox-img-wrap">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="loan-term-gallery__lightbox-img"
            sizes="100vw"
          />
        </div>
      </div>
    )
  }

  if (item.kind === 'youtube') {
    const watchUrl = getYoutubeWatchUrl(item.url)
    const videoId = parseYoutubeVideoId(item.url)

    if (!watchUrl || !videoId) {
      return (
        <p className="loan-term-gallery__lightbox-fallback type-body-base-regular">
          Invalid YouTube URL.
        </p>
      )
    }

    return (
      <LightboxYoutubePanel
        className={className}
        alt={item.alt}
        watchUrl={watchUrl}
        videoId={videoId}
      />
    )
  }

  return (
    <div
      className={clsx(
        'loan-term-gallery__lightbox-frame',
        'loan-term-gallery__lightbox-frame--video',
        className
      )}
    >
      <video
        className="loan-term-gallery__lightbox-video"
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        preload="metadata"
      >
        <track kind="captions" />
      </video>
    </div>
  )
}

export function LoanTermMediaGallerySectionFE({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  items,
  className,
  sectionId,
  zoomLabel = '⤢ Zoom',
}: LoanTermMediaGallerySectionProps) {
  const headingId = React.useId()
  const [swiper, setSwiper] = React.useState<SwiperClass | null>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxOpen])

  const list =
    items && items.length > 0 ? items : LOAN_TERM_GALLERY_DEFAULT_ITEMS
  const current = list[Math.min(activeIndex, list.length - 1)]!

  const goPrev = React.useCallback(() => {
    swiper?.slidePrev()
  }, [swiper])

  const goNext = React.useCallback(() => {
    swiper?.slideNext()
  }, [swiper])

  const openLightbox = React.useCallback(() => setLightboxOpen(true), [])

  const dotClick = React.useCallback(
    (index: number) => {
      swiper?.slideTo(index)
    },
    [swiper]
  )

  const modal =
    mounted && lightboxOpen
      ? createPortal(
          <div
            className="loan-term-gallery__modal-root"
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
          >
            <button
              type="button"
              className="loan-term-gallery__modal-backdrop"
              aria-label="Close dialog"
              onClick={() => setLightboxOpen(false)}
            />
            <div className="loan-term-gallery__modal-panel">
              <button
                type="button"
                className="loan-term-gallery__modal-close type-body-base-medium"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <LightboxContent item={current} />
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <section
      id={sectionId}
      className={clsx('loan-term-gallery', className)}
      aria-labelledby={headingId}
    >
      <div className="loan-term-gallery__header">
        <h2 className="loan-term-gallery__title type-heading-h3" id={headingId}>
          {title}
        </h2>
        <p className="loan-term-gallery__subtitle type-body-base-regular">
          {subtitle}
        </p>
      </div>

      <div className="loan-term-gallery__stage">
        <Swiper
          className="loan-term-gallery__swiper"
          slidesPerView={1}
          spaceBetween={0}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        >
          {list.map((item) => (
            <SwiperSlide
              key={item.id}
              className={clsx(
                'loan-term-gallery__slide',
                item.kind === 'youtube' && 'swiper-no-swiping'
              )}
            >
              <div className="loan-term-gallery__slide-inner">
                <SlideVisual
                  item={item}
                  fillClassName="loan-term-gallery__slide-img"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="loan-term-gallery__zoom type-label-default"
          onClick={openLightbox}
        >
          {zoomLabel}
        </button>

        <div className="loan-term-gallery__arrows">
          <button
            type="button"
            className="loan-term-gallery__arrow"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <GlobalIcon type="arrow-left" size="L" />
          </button>
          <button
            type="button"
            className="loan-term-gallery__arrow"
            onClick={goNext}
            aria-label="Next slide"
          >
            <GlobalIcon type="arrow-right" size="L" />
          </button>
        </div>
      </div>

      <div className="loan-term-gallery__dots" role="group" aria-label="Slides">
        {list.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-current={i === activeIndex ? 'true' : undefined}
            className={clsx(
              'loan-term-gallery__dot',
              i === activeIndex && 'loan-term-gallery__dot--active'
            )}
            onClick={() => dotClick(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {modal}
    </section>
  )
}

function mapCmsGalleryItems(
  items: LoanTermMediaGallerySectionBlockFragmentFragment['Items']
): LoanTermGalleryItem[] {
  const out: LoanTermGalleryItem[] = []
  for (const raw of items ?? []) {
    if (!raw) continue
    if (raw.__typename === 'LoanTermGalleryImageBlock') {
      const src = mediaRefToUrl(
        raw.Image as Parameters<typeof mediaRefToUrl>[0]
      )
      if (!src) continue
      out.push({
        id: raw.Id ?? `img-${out.length}`,
        kind: 'image',
        src,
        alt: raw.Alt?.trim() || 'Gallery image',
      })
    } else if (raw.__typename === 'LoanTermGalleryYoutubeBlock') {
      const url = raw.Url?.trim()
      if (!url) continue
      out.push({
        id: raw.Id ?? `yt-${out.length}`,
        kind: 'youtube',
        url,
        alt: raw.Alt?.trim() || 'YouTube video',
      })
    } else if (raw.__typename === 'LoanTermGalleryVideoBlock') {
      const fromLink = raw.Video
        ? linkToAbsoluteUrl(raw.Video as Parameters<typeof linkToAbsoluteUrl>[0])
        : undefined
      const fromItem = raw.Video?.item
        ? mediaRefToUrl(
            raw.Video.item as Parameters<typeof mediaRefToUrl>[0]
          )
        : undefined
      const src = fromLink ?? fromItem
      if (!src) continue
      const poster = mediaRefToUrl(
        raw.Poster as Parameters<typeof mediaRefToUrl>[0]
      )
      out.push({
        id: raw.Id ?? `vid-${out.length}`,
        kind: 'video',
        src,
        poster,
        alt: raw.Alt?.trim() || 'Video',
      })
    }
  }
  return out
}

type CmsLoanTermGalleryProps = Omit<
  LoanTermMediaGallerySectionBlockFragmentFragment,
  '__typename'
>

export default function LoanTermMediaGallerySection(
  props: CmsLoanTermGalleryProps
) {
  const items = mapCmsGalleryItems(props.Items)

  return (
    <LoanTermMediaGallerySectionFE
      title={props.Title ?? undefined}
      subtitle={props.Subtitle ?? undefined}
      zoomLabel={props.ZoomLabel ?? undefined}
      items={items.length ? items : undefined}
    />
  )
}
