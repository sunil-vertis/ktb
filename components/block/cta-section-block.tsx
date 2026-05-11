import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CtaSectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import styles from '@/styles/components/cta-section-block.module.scss'

export type CtaSectionBlockProps = {
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

/** Presentational CTA section (preview / Storybook). CMS pages use the default export. */
export function CtaSectionBlockFE({
  title = 'Ready to get started?',
  subtitle = 'Visit a branch or start your application online in minutes.',
  primaryLabel = 'Find a branch',
  primaryHref = '#',
  secondaryLabel = 'Contact us',
  secondaryHref = '#',
}: CtaSectionBlockProps) {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-section-title">
      <div className={styles.patternViewport} aria-hidden>
        {/* Desktop: Figma 1440 artboard — frame centered, masked layer at x=70 / y=-136 */}
        <div className={styles.patternDesktopRoot}>
          <div className={styles.patternDesktopFrame}>
            <div className={cn(styles.patternMaskedDesktop, 'container mx-auto')}>
              <Image
                src="/assets/svg/cta-pattern-fill-desktop.svg"
                alt=""
                className={styles.patternFill}
                fill
                sizes="1280px"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Mobile: Figma — outer offset left -208.82px, masked layer dimensions + mask */}
        <div className={styles.patternMobileRoot}>
          <div className={styles.patternMaskedMobile}>
            <Image
              src="/assets/svg/cta-pattern-fill-mobile.svg"
              alt=""
              className={styles.patternFill}
              fill
              sizes="1416px"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className={cn(styles.inner, 'container mx-auto')}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h2 id="cta-section-title" className={styles.title}>
              {title}
            </h2>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </header>

          <div className={styles.actions}>
            <Button
              asChild
              hierarchy="primary"
              inverse
              size="lg"
              className={styles.actionBtn}
            >
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button
              asChild
              hierarchy="secondary"
              inverse
              size="lg"
              className={styles.actionBtn}
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- CMS (Optimizely) → presentational --------------------------------------

type CtaSectionBlockCmsProps = Omit<CtaSectionBlockFragmentFragment, '__typename'>

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

/** Optimizely `CtaSectionBlock` from page queries → {@link CtaSectionBlockFE}. */
export default function CtaSectionBlock(props: CtaSectionBlockCmsProps) {
  const {
    Title,
    Subtitle,
    PrimaryLabel,
    PrimaryHref,
    SecondaryLabel,
    SecondaryHref,
  } = props

  return (
    <CtaSectionBlockFE
      title={Title ?? undefined}
      subtitle={Subtitle ?? undefined}
      primaryLabel={PrimaryLabel ?? undefined}
      primaryHref={firstUrl(PrimaryHref?.url ?? undefined) || '#'}
      secondaryLabel={SecondaryLabel ?? undefined}
      secondaryHref={firstUrl(SecondaryHref?.url ?? undefined) || '#'}
    />
  )
}
