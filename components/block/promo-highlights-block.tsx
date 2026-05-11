'use client'

import Image from 'next/image'
import { useId } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { GlobalIcon } from '@/components/ui/global-icon'
import { TextLink } from '@/components/ui/text-link'
import type { PromoHighlightsBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import styles from '@/styles/components/promo-highlights-block.module.scss'

export type ExchangeRateItem = {
  code: string
  buy: string
  sell: string
  flagSrc: string
}

export type InterestRateItem = {
  id: string
  title: string
  description: string
  imageSrc: string
  ctaLabel?: string
  ctaHref?: string
}

export type PromoHighlightsBlockProps = {
  exchangeTitle?: string
  interestTitle?: string
  updatedAtLabel?: string
  exchangeRates?: ExchangeRateItem[]
  interestRates?: InterestRateItem[]
  exchangeViewAllLabel?: string
  exchangeViewAllHref?: string
  backgroundColor?: string
}

const DEFAULT_EXCHANGE_RATES: ExchangeRateItem[] = [
  { code: 'USD', buy: '31.56', sell: '32.35', flagSrc: '/assets/promo-highlights/flag-us.png' },
  { code: 'EUR', buy: '36.75', sell: '37.89', flagSrc: '/assets/promo-highlights/flag-eu.png' },
  { code: 'GBP', buy: '41.99', sell: '43.32', flagSrc: '/assets/promo-highlights/flag-gbp.png' },
  { code: 'JPY', buy: '0.195', sell: '0.205', flagSrc: '/assets/promo-highlights/flag-jpy.png' },
  { code: 'HKD', buy: '3.98', sell: '4.17', flagSrc: '/assets/promo-highlights/flag-hkd.png' },
]

const DEFAULT_INTEREST_RATES: InterestRateItem[] = [
  {
    id: 'loan-interest',
    title: 'Loan Interest Rates',
    description: 'Transparent and competitive rates for personal, home, and business loans.',
    imageSrc: '/assets/promo-highlights/rate-loan.png',
    ctaLabel: 'View Rates',
    ctaHref: '#',
  },
  {
    id: 'deposit-interest',
    title: 'Deposit Interest Rates',
    description: 'Compare interest rates across our range of savings and investment accounts.',
    imageSrc: '/assets/promo-highlights/rate-deposit.png',
    ctaLabel: 'View Rates',
    ctaHref: '#',
  },
]

/** Presentational promo highlights (preview / Storybook). CMS pages use the default export. */
export function PromoHighlightsBlockFE({
  exchangeTitle = 'Exchange Rates',
  interestTitle = 'Interest Rates',
  updatedAtLabel = 'April 13, 2026 12:40',
  exchangeRates = DEFAULT_EXCHANGE_RATES,
  interestRates = DEFAULT_INTEREST_RATES,
  exchangeViewAllLabel = 'View All',
  exchangeViewAllHref = '#',
  backgroundColor = 'var(--bg-bg-1, #e6f4fa)',
}: PromoHighlightsBlockProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const paginationClass = `promoHighlightsPagination-${id}`
  const prevClass = `promoHighlightsPrev-${id}`
  const nextClass = `promoHighlightsNext-${id}`
  const hasMobileInterestCarousel = interestRates.length > 1

  return (
    <section className={styles.section} style={{ backgroundColor }}>
      <div className={`${styles.inner} container mx-auto`}>
        <div className={styles.column}>
          <h2 className={styles.heading}>{exchangeTitle}</h2>
          <div className={styles.exchangeCard}>
            <div className={styles.exchangeHeader}>
              <p className={styles.exchangeBaseCol}>Currency / Baht</p>
              <p className={styles.exchangeValueCol}>Buy</p>
              <p className={styles.exchangeValueCol}>Sell</p>
            </div>
            <div className={styles.exchangeRows}>
              {exchangeRates.map((rate) => (
                <div key={rate.code} className={styles.exchangeRow}>
                  <div className={styles.currencyCol}>
                    <Image src={rate.flagSrc} alt={`${rate.code} flag`} width={24} height={24} />
                    <span className={styles.currencyCode}>{rate.code}</span>
                  </div>
                  <p className={styles.exchangeValueCol}>{rate.buy}</p>
                  <p className={styles.exchangeValueCol}>{rate.sell}</p>
                </div>
              ))}
            </div>
            <div className={styles.exchangeFooter}>
              <p className={styles.updatedAt}>{updatedAtLabel}</p>
              <TextLink
                href={exchangeViewAllHref}
                size="S"
                icon={<GlobalIcon type="arrow-right" size="S" />}
                className={styles.viewAllLink}
              >
                {exchangeViewAllLabel}
              </TextLink>
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>{interestTitle}</h2>

          <div className={styles.interestDesktopList}>
            {interestRates.map((item) => (
              <article key={item.id} className={styles.interestDesktopCard}>
                <div className={styles.interestDesktopImageWrap}>
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    sizes="278px"
                    className={styles.interestImage}
                  />
                </div>
                <div className={styles.interestDesktopBody}>
                  <h3 className={styles.interestTitle}>{item.title}</h3>
                  <p className={styles.interestDescription}>{item.description}</p>
                  {item.ctaLabel && item.ctaHref ? (
                    <TextLink
                      href={item.ctaHref}
                      size="S"
                      icon={<GlobalIcon type="arrow-right" size="S" />}
                      className={styles.interestCta}
                    >
                      {item.ctaLabel}
                    </TextLink>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <div className={styles.interestMobileWrap}>
            <Swiper
              modules={[Navigation, Pagination]}
              className={styles.mobileSwiper}
              slidesPerView={hasMobileInterestCarousel ? 1.14 : 1}
              spaceBetween={16}
              allowTouchMove={hasMobileInterestCarousel}
              navigation={
                hasMobileInterestCarousel
                  ? {
                      prevEl: `.${prevClass}`,
                      nextEl: `.${nextClass}`,
                    }
                  : false
              }
              pagination={
                hasMobileInterestCarousel
                  ? {
                      el: `.${paginationClass}`,
                      clickable: true,
                      bulletClass: styles.dot,
                      bulletActiveClass: styles.dotActive,
                    }
                  : false
              }
            >
              {interestRates.map((item) => (
                <SwiperSlide key={item.id} className={styles.mobileSlide}>
                  <article className={styles.interestMobileCard}>
                    <div className={styles.interestMobileImageWrap}>
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        sizes="282px"
                        className={styles.interestImage}
                      />
                    </div>
                    <div className={styles.interestMobileBody}>
                      <h3 className={styles.interestTitle}>{item.title}</h3>
                      <p className={styles.interestDescription}>{item.description}</p>
                      {item.ctaLabel && item.ctaHref ? (
                        <TextLink
                          href={item.ctaHref}
                          size="S"
                          icon={<GlobalIcon type="arrow-right" size="S" />}
                          className={styles.interestCta}
                        >
                          {item.ctaLabel}
                        </TextLink>
                      ) : null}
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>

            {hasMobileInterestCarousel ? (
              <div className={styles.mobileIndicatorRow}>
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
      </div>
    </section>
  )
}

// --- CMS (Optimizely) → presentational --------------------------------------

type PromoHighlightsBlockCmsProps = Omit<PromoHighlightsBlockFragmentFragment, '__typename'>

type ExchangeRateRow = Extract<
  NonNullable<NonNullable<PromoHighlightsBlockFragmentFragment['ExchangeRates']>[number]>,
  { __typename: 'PromoExchangeRateItemBlock' }
>

type InterestRateRow = Extract<
  NonNullable<NonNullable<PromoHighlightsBlockFragmentFragment['InterestRates']>[number]>,
  { __typename: 'PromoInterestRateItemBlock' }
>

function firstUrl(
  url:
    | {
        default?: string | null
        internal?: string | null
        hierarchical?: string | null
        base?: string | null
      }
    | null
    | undefined
): string {
  return (
    url?.default?.trim() ||
    url?.internal?.trim() ||
    url?.hierarchical?.trim() ||
    url?.base?.trim() ||
    ''
  )
}

function assetUrlFromCms(
  media:
    | ExchangeRateRow['Flag']
    | InterestRateRow['Image']
    | null
    | undefined
): string | undefined {
  if (!media) return undefined
  if (media.__typename === 'ImageMedia' || media.__typename === 'GenericMedia') {
    const u = media._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

function mapExchangeRates(rows: PromoHighlightsBlockCmsProps['ExchangeRates']): ExchangeRateItem[] {
  if (!rows?.length) return []
  const out: ExchangeRateItem[] = []
  for (const raw of rows) {
    if (raw?.__typename !== 'PromoExchangeRateItemBlock') continue
    const code = raw.Code?.trim()
    if (!code) continue
    const buy = raw.Buy?.trim() || ''
    const sell = raw.Sell?.trim() || ''
    const flagSrc = assetUrlFromCms(raw.Flag) ?? '/placeholder.svg'
    out.push({ code, buy, sell, flagSrc })
  }
  return out
}

function mapInterestRates(rows: PromoHighlightsBlockCmsProps['InterestRates']): InterestRateItem[] {
  if (!rows?.length) return []
  const out: InterestRateItem[] = []
  for (const raw of rows) {
    if (raw?.__typename !== 'PromoInterestRateItemBlock') continue
    const id = raw.Id?.trim() || `interest-${out.length + 1}`
    const title = raw.Title?.trim() || ''
    if (!title) continue
    const description = raw.Description?.trim() || ''
    const imageSrc = assetUrlFromCms(raw.Image) ?? '/placeholder.svg'
    const ctaLabel = raw.CtaLabel?.trim() || undefined
    const ctaHref = firstUrl(raw.CtaHref?.url ?? undefined) || undefined
    out.push({ id, title, description, imageSrc, ctaLabel, ctaHref })
  }
  return out
}

/** Optimizely `PromoHighlightsBlock` from page queries → {@link PromoHighlightsBlockFE}. */
export default function PromoHighlightsBlock(props: PromoHighlightsBlockCmsProps) {
  const {
    ExchangeTitle,
    InterestTitle,
    UpdatedAtLabel,
    ExchangeRates,
    InterestRates,
    ExchangeViewAllLabel,
    ExchangeViewAllLink,
    BackgroundColor,
  } = props

  const exchangeViewAllHrefFromCms =
    firstUrl(ExchangeViewAllLink?.url ?? undefined) || undefined

  const hasAnyLists = ExchangeRates != null || InterestRates != null
  if (!hasAnyLists) {
    return (
      <PromoHighlightsBlockFE
        exchangeTitle={ExchangeTitle ?? undefined}
        interestTitle={InterestTitle ?? undefined}
        updatedAtLabel={UpdatedAtLabel ?? undefined}
        exchangeViewAllLabel={ExchangeViewAllLabel ?? undefined}
        exchangeViewAllHref={exchangeViewAllHrefFromCms}
        backgroundColor={BackgroundColor ?? undefined}
      />
    )
  }

  return (
    <PromoHighlightsBlockFE
      exchangeTitle={ExchangeTitle ?? undefined}
      interestTitle={InterestTitle ?? undefined}
      updatedAtLabel={UpdatedAtLabel ?? undefined}
      exchangeRates={mapExchangeRates(ExchangeRates)}
      interestRates={mapInterestRates(InterestRates)}
      exchangeViewAllLabel={ExchangeViewAllLabel ?? undefined}
      exchangeViewAllHref={exchangeViewAllHrefFromCms}
      backgroundColor={BackgroundColor ?? undefined}
    />
  )
}
