'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Button } from '@/components/ui/button'
import { GlobalIcon } from '@/components/ui/global-icon'

import styles from '@/styles/components/feature-product-carousel-block.module.scss'

export type FeatureProductItem = {
  id: string
  category: string
  title: string
  description: string
  imageSrc: string
  badgeLabel?: string
  badgeVariant?: 'primary' | 'highlight'
}

export type FeatureProductCarouselBlockProps = {
  title?: string
  subtitle?: string
  items: FeatureProductItem[]
  allProductsLabel?: string
  viewMoreLabel?: string
  backgroundColor?: string
}

export default function FeatureProductCarouselBlock({
  title = 'Featured products',
  subtitle = 'Explore our most popular financial solutions',
  items,
  allProductsLabel = 'All products',
  viewMoreLabel = 'View more',
  backgroundColor = 'var(--neutral-050, #f7f7f7)',
}: FeatureProductCarouselBlockProps) {
  const [activeCategory, setActiveCategory] = useState(allProductsLabel)
  const [renderCycle, setRenderCycle] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  const categories = useMemo(
    () => [allProductsLabel, ...Array.from(new Set(items.map((item) => item.category)))],
    [items, allProductsLabel]
  )

  const filteredItems = useMemo(() => {
    if (activeCategory === allProductsLabel) return items
    return items.filter((item) => item.category === activeCategory)
  }, [items, activeCategory, allProductsLabel])

  const paginationClass = `featureProductPagination-${id}`
  const prevClass = `featureProductPrev-${id}`
  const nextClass = `featureProductNext-${id}`
  const hasDesktopCarousel = filteredItems.length > 4
  const hasMobileCarousel = filteredItems.length > 1
  const shouldShowControls = isDesktop ? hasDesktopCarousel : hasMobileCarousel
  const useStaticDesktopSlides = isDesktop && !hasDesktopCarousel

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    setIsDesktop(mediaQuery.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const onSelectCategory = (category: string) => {
    setActiveCategory(category)
    setRenderCycle((prev) => prev + 1)
  }

  return (
    <section
      className={styles.section}
      style={{ backgroundColor }}
      aria-labelledby={`feature-products-title-${id}`}
    >
      <div className={`${styles.inner} container mx-auto`}>
        <header className={styles.header}>
          <h2 id={`feature-products-title-${id}`} className={styles.title}>
            {title}
          </h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </header>

        <div className={styles.chips} role="tablist" aria-label="Product categories">
          {categories.map((category) => {
            const active = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </button>
            )
          })}
        </div>

        <div className={styles.carouselWrap} key={`${activeCategory}-${renderCycle}`}>
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
            {filteredItems.map((item) => (
              <SwiperSlide key={item.id} className={styles.slide}>
                <article className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 272px, 330px"
                      className={styles.cardImage}
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
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDescription}>{item.description}</p>
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

        <div className={styles.actionRow}>
          <Button hierarchy="secondary" size="lg">
            {viewMoreLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
