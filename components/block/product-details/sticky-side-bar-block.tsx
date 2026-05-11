'use client'

import * as React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

import type { StickySideBarBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import { linkToAbsoluteUrl } from './map-cms'

export type StickySideBarBlockProps = {
  interestLabel?: string
  interestValue?: string
  interestUnit?: string
  footnote?: string
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaHref?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  trustLabel?: string
  complianceLabel?: string
  className?: string
}

export function StickySideBarBlockFE({
  interestLabel = 'INTEREST RATES STARTING FROM',
  interestValue = '10.345% - 15.845%*',
  interestUnit = 'per annum',
  footnote = 'As of March 2, 2026.',
  primaryCtaLabel = 'Apply for a loan',
  secondaryCtaLabel = 'Apply with Krungthai NEXT',
  primaryCtaHref,
  secondaryCtaHref,
  onPrimaryClick,
  onSecondaryClick,
  trustLabel = 'Certified Protection',
  complianceLabel = 'DPA PROTECTING YOUR DEPOSITS',
  className,
}: StickySideBarBlockProps) {
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
            <a href={primaryCtaHref}>{primaryCtaLabel}</a>
          </Button>
        ) : (
          <Button
            size="lg"
            className="sticky-side-bar__action-btn sticky-side-bar__action-btn--primary"
            onClick={onPrimaryClick}
            type="button"
          >
            {primaryCtaLabel}
          </Button>
        )}
        {secondaryCtaHref ? (
          <Button
            hierarchy="secondary"
            size="lg"
            className="sticky-side-bar__action-btn sticky-side-bar__action-btn--secondary"
            asChild
          >
            <a href={secondaryCtaHref}>{secondaryCtaLabel}</a>
          </Button>
        ) : (
          <Button
            hierarchy="secondary"
            size="lg"
            className="sticky-side-bar__action-btn sticky-side-bar__action-btn--secondary"
            onClick={onSecondaryClick}
            type="button"
          >
            {secondaryCtaLabel}
          </Button>
        )}
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
    </aside>
  )
}

type CmsStickySideBarProps = Omit<StickySideBarBlockFragmentFragment, '__typename'>

export default function StickySideBarBlock(props: CmsStickySideBarProps) {
  const primaryCtaHref = linkToAbsoluteUrl(
    props.PrimaryCtaUrl as Parameters<typeof linkToAbsoluteUrl>[0]
  )
  const secondaryCtaHref = linkToAbsoluteUrl(
    props.SecondaryCtaUrl as Parameters<typeof linkToAbsoluteUrl>[0]
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
      secondaryCtaHref={secondaryCtaHref}
      trustLabel={props.TrustLabel ?? undefined}
      complianceLabel={props.ComplianceLabel ?? undefined}
    />
  )
}
