'use client'

import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { GlobalIcon } from '@/components/ui/global-icon'
import { TextLink } from '@/components/ui/text-link'

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

export default function RecommendedCarouselBlock({
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
