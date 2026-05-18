'use client'

import * as React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

import type { StickySideBarBlockFragmentFragment } from '@/lib/optimizely/types/generated'
import {
  OPTIMIZELY_WEB_EVENTS,
  trackOptimizelyEvent,
} from '@/lib/analytics/optimizely-web-events'
import {
  getKrungthaiNextStoreUrl,
  KRUNGTHAI_NEXT_PLAY_STORE_URL,
  shouldOpenKrungthaiNextModal,
} from '@/lib/product-details/krungthai-next-store-url'

import { KrungthaiNextDownloadModal } from './krungthai-next-download-modal'
import { linkToAbsoluteUrl } from './map-cms'

const DEFAULT_NEXT_MODAL_IMAGE = '/assets/product-details/sticky-sidebar/krungthai-next-modal-hero.png'

export type StickySideBarBlockProps = {
  interestLabel?: string
  interestValue?: string
  interestUnit?: string
  footnote?: string
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
  primaryCtaHref?: string
  /** Ignored for navigation: secondary CTA opens the NEXT modal on desktop or store links on mobile. */
  secondaryCtaHref?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  trustLabel?: string
  complianceLabel?: string
  className?: string
  /** Modal body (desktop). Title uses {@link secondaryCtaLabel}. */
  nextModalDescription?: string
  nextModalImageSrc?: string
  nextModalImageAlt?: string
}

export function StickySideBarBlockFE({
  interestLabel = 'INTEREST RATES STARTING FROM',
  interestValue = '10.345% - 15.845%*',
  interestUnit = 'per annum',
  footnote = 'As of March 2, 2026.',
  primaryCtaLabel = 'Apply for a loan',
  secondaryCtaLabel = 'Apply with Krungthai NEXT',
  primaryCtaHref,
  onPrimaryClick,
  onSecondaryClick,
  trustLabel = 'Certified Protection',
  complianceLabel = 'DPA PROTECTING YOUR DEPOSITS',
  className,
  nextModalDescription = 'Get real-time notifications and manage your banking needs in one secure place.',
  nextModalImageSrc = DEFAULT_NEXT_MODAL_IMAGE,
  nextModalImageAlt = 'Krungthai NEXT QR code',
}: StickySideBarBlockProps) {
  const [nextModalOpen, setNextModalOpen] = React.useState(false)
  const [storeHref, setStoreHref] = React.useState(KRUNGTHAI_NEXT_PLAY_STORE_URL)

  React.useLayoutEffect(() => {
    setStoreHref(getKrungthaiNextStoreUrl())
  }, [])

  const trackPrimaryCtaClick = React.useCallback(() => {
    onPrimaryClick?.()
    trackOptimizelyEvent(OPTIMIZELY_WEB_EVENTS.CTA_FORM_CLICK, {
      source: 'sticky-side-bar-primary',
    })
  }, [onPrimaryClick])

  const onSecondaryActivate = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackOptimizelyEvent(OPTIMIZELY_WEB_EVENTS.CLICK_APP_DOWNLOAD, {
        source: 'sticky-side-bar-secondary',
      })
      if (shouldOpenKrungthaiNextModal()) {
        e.preventDefault()
        onSecondaryClick?.()
        setNextModalOpen(true)
        return
      }
      onSecondaryClick?.()
      const url = getKrungthaiNextStoreUrl()
      if (url !== e.currentTarget.getAttribute('href')) {
        e.preventDefault()
        window.location.href = url
      }
    },
    [onSecondaryClick]
  )

  return (
    <aside className={clsx('sticky-side-bar', className)} aria-label="Product CTA">
      <div className="sticky-side-bar__head">
        <p className="sticky-side-bar__interest-label type-body-small-regular">
          {interestLabel}
        </p>
        <div className="sticky-side-bar__rate-wrap">
          <p className="sticky-side-bar__rate type-heading-h3">{interestValue}</p>
          <p className="sticky-side-bar__rate-unit type-label-small-medium">
            {interestUnit}
          </p>
        </div>
      </div>

      <p className="sticky-side-bar__footnote type-body-small-regular">{footnote}</p>

      <div className="sticky-side-bar__actions">
        {primaryCtaHref ? (
          <Button
            size="lg"
            className="sticky-side-bar__action-btn sticky-side-bar__action-btn--primary"
            asChild
          >
            <a href={primaryCtaHref} onClick={trackPrimaryCtaClick}>
              {primaryCtaLabel}
            </a>
          </Button>
        ) : (
          <Button
            size="lg"
            className="sticky-side-bar__action-btn sticky-side-bar__action-btn--primary"
            onClick={trackPrimaryCtaClick}
            type="button"
          >
            {primaryCtaLabel}
          </Button>
        )}
        <Button
          hierarchy="secondary"
          size="lg"
          className="sticky-side-bar__action-btn sticky-side-bar__action-btn--secondary"
          asChild
        >
          <a
            href={storeHref}
            rel="noopener noreferrer"
            onClick={onSecondaryActivate}
          >
            {secondaryCtaLabel}
          </a>
        </Button>
      </div>

      <div className="sticky-side-bar__trust-row">
        <div className="sticky-side-bar__trust">
          <Image
            src="/assets/product-details/sticky-sidebar/certified-protection.png"
            alt=""
            width={32}
            height={32}
            className="sticky-side-bar__trust-icon"
            unoptimized
          />
          <p className="sticky-side-bar__trust-label type-label-small-regular">
            {trustLabel}
          </p>
        </div>
        <Image
          src="/assets/product-details/sticky-sidebar/dpa-protection.png"
          alt={complianceLabel}
          width={110}
          height={40}
          className="sticky-side-bar__compliance"
          unoptimized
        />
      </div>

      <KrungthaiNextDownloadModal
        open={nextModalOpen}
        onClose={() => setNextModalOpen(false)}
        title={secondaryCtaLabel}
        description={nextModalDescription}
        imageSrc={nextModalImageSrc}
        imageAlt={nextModalImageAlt}
      />
    </aside>
  )
}

type CmsStickySideBarProps = Omit<StickySideBarBlockFragmentFragment, '__typename'>

export default function StickySideBarBlock(props: CmsStickySideBarProps) {
  const primaryCtaHref = linkToAbsoluteUrl(
    props.PrimaryCtaUrl as Parameters<typeof linkToAbsoluteUrl>[0]
  )

  return (
    <StickySideBarBlockFE
      interestLabel={props.InterestLabel ?? undefined}
      interestValue={props.InterestValue ?? undefined}
      interestUnit={props.InterestUnit ?? undefined}
      footnote={props.Footnote ?? undefined}
      primaryCtaLabel={props.PrimaryCtaLabel ?? undefined}
      secondaryCtaLabel={props.SecondaryCtaLabel ?? undefined}
      primaryCtaHref={primaryCtaHref}
      trustLabel={props.TrustLabel ?? undefined}
      complianceLabel={props.ComplianceLabel ?? undefined}
    />
  )
}
