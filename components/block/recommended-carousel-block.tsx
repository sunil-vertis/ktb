'use client'

import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import {
  linkToAbsoluteUrl,
  richTextToPlainLines,
} from '@/components/block/product-details/map-cms'
import { GlobalIcon } from '@/components/ui/global-icon'
import { TextLink } from '@/components/ui/text-link'
import type { RecommendedCarouselBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import styles from '@/styles/components/recommended-carousel-block.module.scss'

export type RecommendedCarouselItem = {
  id: string
  title: string
  description: string
  imageSrc: string
  badgeLabel?: string
  badgeVariant?: 'primary' | 'highlight'
  ctaLabel?: string
  ctaHref?: string
}

export type RecommendedCarouselBlockProps = {
  title?: string
  items: RecommendedCarouselItem[]
  backgroundColor?: string
}

/** Presentational carousel (Storybook / sample preview). CMS pages use the default export. */
export function RecommendedCarouselView({
  title = 'Related products',
  items,
  backgroundColor = 'var(--bg-bg-1, #e6f4fa)',
}: RecommendedCarouselBlockProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  const hasDesktopCarousel = items.length > 4
  const hasMobileCarousel = items.length > 1
  const shouldShowControls = isDesktop ? hasDesktopCarousel : hasMobileCarousel
  const useStaticDesktopSlides = isDesktop && !hasDesktopCarousel

  const paginationClass = `recommendedCarouselPagination-${id}`
  const prevClass = `recommendedCarouselPrev-${id}`
  const nextClass = `recommendedCarouselNext-${id}`

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    setIsDesktop(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return (
    <section
      className={styles.section}
      style={{ backgroundColor }}
      aria-labelledby={`recommended-carousel-title-${id}`}
    >
      <div className={`${styles.inner} container mx-auto`}>
        <h2 id={`recommended-carousel-title-${id}`} className={styles.title}>
          {title}
        </h2>

        <div className={styles.carouselWrap}>
          <Swiper
            modules={[Navigation, Pagination]}
            className={`${styles.swiper} ${useStaticDesktopSlides ? styles.swiperStaticDesktop : ''}`}
            slidesPerView={hasMobileCarousel ? 1.14 : 1}
            spaceBetween={20}
            speed={420}
            allowTouchMove={hasMobileCarousel}
            breakpoints={{
              768: {
                slidesPerView: hasDesktopCarousel ? 4 : 'auto',
                spaceBetween: 24,
                allowTouchMove: hasDesktopCarousel,
              },
            }}
            navigation={
              shouldShowControls
                ? {
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                  }
                : false
            }
            pagination={
              shouldShowControls
                ? {
                    el: `.${paginationClass}`,
                    clickable: true,
                    bulletClass: styles.dot,
                    bulletActiveClass: styles.dotActive,
                  }
                : false
            }
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className={styles.slide}>
                <article className={styles.card}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 272px, 330px"
                      className={styles.image}
                      unoptimized
                      loader={({ src }) => src}
                    />
                    {item.badgeLabel ? (
                      <span
                        className={`${styles.badge} ${item.badgeVariant === 'highlight' ? styles.badgeHighlight : styles.badgePrimary}`}
                      >
                        {item.badgeLabel}
                      </span>
                    ) : null}
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.description}>{item.description}</p>
                    {item.ctaLabel && item.ctaHref ? (
                      <TextLink
                        href={item.ctaHref}
                        size="S"
                        icon={<GlobalIcon type="arrow-right" size="S" />}
                        className={styles.ctaLink}
                      >
                        {item.ctaLabel}
                      </TextLink>
                    ) : null}
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {shouldShowControls ? (
            <div className={styles.indicatorRow}>
              <div className={`${styles.dots} ${paginationClass}`} aria-hidden="true" />
              <div className={styles.navButtons}>
                <button type="button" className={`${styles.navBtn} ${prevClass}`} aria-label="Previous">
                  <GlobalIcon type="arrow-left" size="L" />
                </button>
                <button type="button" className={`${styles.navBtn} ${nextClass}`} aria-label="Next">
                  <GlobalIcon type="arrow-right" size="L" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

// --- CMS (Optimizely) -------------------------------------------------------

type RecommendedCarouselCmsProps = Omit<
  RecommendedCarouselBlockFragmentFragment,
  '__typename'
>

type CarouselItemCms = Extract<
  NonNullable<NonNullable<RecommendedCarouselBlockFragmentFragment['Items']>[number]>,
  { __typename: 'RecommendedCarouselItemBlock' }
>

function imageSrcFromCms(image: CarouselItemCms['Image']): string | undefined {
  if (!image) return undefined
  if (image.__typename === 'ImageMedia' || image.__typename === 'GenericMedia') {
    const u = image._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

function descriptionPlain(row: CarouselItemCms): string {
  const html = row.carouselDescription?.html?.trim()
  if (!html) return ''
  const lines = richTextToPlainLines(html)
  return lines?.length ? lines.join(' ') : ''
}

function badgeVariantFromCms(value: string | null | undefined): 'primary' | 'highlight' {
  const v = value?.trim().toLowerCase() ?? ''
  if (v.includes('highlight')) return 'highlight'
  return 'primary'
}

function mapCmsItems(
  rows: RecommendedCarouselCmsProps['Items'] | undefined
): RecommendedCarouselItem[] {
  if (!rows?.length) return []
  const out: RecommendedCarouselItem[] = []
  let index = 0
  for (const raw of rows) {
    if (raw?.__typename !== 'RecommendedCarouselItemBlock') continue
    const title = raw.Title?.trim()
    if (!title) continue
    const imageSrc = imageSrcFromCms(raw.Image) ?? '/placeholder.svg'
    const id = raw.Id?.trim() || `recommended-carousel-${index}`
    const description = descriptionPlain(raw)
    const badgeLabel = raw.BadgeLabel?.trim() || undefined
    const badgeVariant = raw.BadgeVariant?.trim()
      ? badgeVariantFromCms(raw.BadgeVariant)
      : undefined
    const ctaLabel = raw.CtaLabel?.trim() || undefined
    const ctaHref = linkToAbsoluteUrl(raw.CtaHref ?? undefined)?.trim() || undefined

    out.push({
      id,
      title,
      description,
      imageSrc,
      ...(badgeLabel ? { badgeLabel, badgeVariant: badgeVariant ?? 'primary' } : {}),
      ...(ctaLabel && ctaHref ? { ctaLabel, ctaHref } : {}),
    })
    index += 1
  }
  return out
}

/** Optimizely `RecommendedCarouselBlock` from page queries. */
export default function RecommendedCarouselBlock(props: RecommendedCarouselCmsProps) {
  const items = mapCmsItems(props.Items)
  if (!items.length) return null

  return (
    <RecommendedCarouselView
      title={props.Title?.trim() || undefined}
      items={items}
      backgroundColor={props.BackgroundColor?.trim() || undefined}
    />
  )
}
