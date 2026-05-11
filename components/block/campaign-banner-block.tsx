import type { CampaignBannerBlockFragmentFragment } from '@/lib/optimizely/types/generated'
import { cn } from '@/lib/utils'

import styles from '@/styles/components/campaign-banner-block.module.scss'

export type CampaignBannerBlockProps = {
  badgeLabel?: string
  title?: string
  subtitle?: string
  desktopImageSrc?: string
  mobileImageSrc?: string
  titleColor?: string
  subtitleColor?: string
}

function mediaRefToUrl(
  ref:
    | { __typename?: string; _assetMetadata?: { url?: string | null } | null }
    | null
    | undefined
): string | undefined {
  if (!ref) return undefined
  if (ref.__typename === 'ImageMedia' || ref.__typename === 'GenericMedia') {
    const u = ref._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

/** Presentational / preview: props match design defaults. */
export function CampaignBannerBlockFE({
  badgeLabel = '',
  title = 'Secure Payments for Every Thai Lifestyle',
  subtitle = 'Discover a range of debit and credit cards designed to provide convenience and security wherever you go.',
  desktopImageSrc = '/assets/images/Microsite-campaign-banner-desktop.png',
  mobileImageSrc,
  titleColor = 'var(--base-black, #002533)',
  subtitleColor = 'var(--base-black, #002533)',
}: CampaignBannerBlockProps) {
  const resolvedMobileSrc = mobileImageSrc ?? desktopImageSrc

  return (
    <section className={styles.campaignBanner} aria-label="Campaign banner">
      <picture className={styles.picture}>
        <source media="(max-width: 767px)" srcSet={resolvedMobileSrc} />
        <img
          src={desktopImageSrc}
          alt=""
          aria-hidden="true"
          className={styles.image}
          loading="lazy"
          decoding="async"
        />
      </picture>

      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <div className={cn(styles.contentInner, 'container mx-auto px-4')}>
          <div className={styles.textBlock}>
            {badgeLabel ? (
              <span className={cn('type-label-small-regular', styles.badge)}>
                {badgeLabel}
              </span>
            ) : null}

            <h2
              className={cn('type-heading-display', styles.title)}
              style={{ color: titleColor }}
              data-epi-edit="title"
            >
              {title}
            </h2>

            {subtitle ? (
              <p
                className={cn('type-body-large-regular', styles.subtitle)}
                style={{ color: subtitleColor }}
                data-epi-edit="subtitle"
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

type CmsCampaignBannerProps = Omit<CampaignBannerBlockFragmentFragment, '__typename'>

/** CMS content area: maps Content Graph fields to the banner. */
export default function CampaignBannerBlock(props: CmsCampaignBannerProps) {
  const desktopImageSrc =
    mediaRefToUrl(props.DesktopImageSrc) ??
    '/assets/images/Microsite-campaign-banner-desktop.png'
  const mobileImageSrc =
    mediaRefToUrl(props.MobileImageSrc) ?? undefined

  return (
    <CampaignBannerBlockFE
      badgeLabel={props.BadgeLabel ?? undefined}
      title={props.Title ?? undefined}
      subtitle={props.Subtitle ?? undefined}
      titleColor={props.TitleColor ?? undefined}
      subtitleColor={props.SubtitleColor ?? undefined}
      desktopImageSrc={desktopImageSrc}
      mobileImageSrc={mobileImageSrc}
    />
  )
}
