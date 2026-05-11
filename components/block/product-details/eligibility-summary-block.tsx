import * as React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import type { EligibilitySummaryBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import { mediaRefToUrl } from './map-cms'

/** One check-icon row under a group subtitle. */
export type EligibilitySummaryBullet = {
  id?: string
  text: React.ReactNode
}

/** Subtitle (H4) followed by its bullet list. */
export type EligibilitySummaryGroup = {
  subtitle: React.ReactNode
  items: EligibilitySummaryBullet[]
}

export type EligibilitySummaryBlockProps = {
  /** Section heading (Figma: Heading/H3). */
  title?: string
  /** Each entry: subtitle, then nested bullet `items`. */
  groups: EligibilitySummaryGroup[]
  className?: string
  /** Root element `id` (e.g. anchor target). */
  sectionId?: string
  /** Icon for each bullet row; defaults to Figma asset (icon-correct-crf-cash-manage). */
  checkIconSrc?: string
}

/** PNG from KTB POC Figma (node 378:7351 / Eligibility summary) — `86285f24…` via Figma asset export. */
const DEFAULT_CHECK_SRC = '/assets/icons/icon-eligibility-check.png'

export function EligibilitySummaryBlockFE({
  title = 'Eligibility Summary',
  groups,
  className,
  sectionId,
  checkIconSrc = DEFAULT_CHECK_SRC,
}: EligibilitySummaryBlockProps) {
  const titleId = React.useId()
  const idPrefix = titleId.replace(/:/g, '')

  return (
    <section
      id={sectionId}
      className={clsx('eligibility-summary', className)}
      aria-labelledby={titleId}
    >
      <h2 className="eligibility-summary__title type-heading-h3" id={titleId}>
        {title}
      </h2>

      <div className="eligibility-summary__card">
        <div className="eligibility-summary__inner">
          {groups.map((group, groupIndex) => {
            const subtitleId = `${idPrefix}-subtitle-${groupIndex}`
            return (
              <div
                key={groupIndex}
                className="eligibility-summary__group"
                role="group"
                aria-labelledby={subtitleId}
              >
                <p
                  id={subtitleId}
                  className="eligibility-summary__subtitle type-heading-h4"
                >
                  {group.subtitle}
                </p>

                {group.items.length > 0 ? (
                  <ul className="eligibility-summary__list">
                    {group.items.map((item, index) => (
                      <li
                        key={item.id ?? `${groupIndex}-${index}`}
                        className="eligibility-summary__item"
                      >
                        <span className="eligibility-summary__icon" aria-hidden>
                          <Image
                            src={checkIconSrc}
                            alt=""
                            width={24}
                            height={24}
                            className="eligibility-summary__icon-img"
                            unoptimized
                            sizes="24px"
                          />
                        </span>
                        <p className="eligibility-summary__text type-body-base-regular">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

type CmsEligibilitySummaryProps = Omit<
  EligibilitySummaryBlockFragmentFragment,
  '__typename'
>

export default function EligibilitySummaryBlock(props: CmsEligibilitySummaryProps) {
  const groups: EligibilitySummaryGroup[] = []
  for (const g of props.Groups ?? []) {
    if (!g || g.__typename !== 'EligibilitySummaryGroupBlock') continue
    const subtitle = g.Subtitle?.trim() ?? ''
    const items: EligibilitySummaryBullet[] = []
    for (const b of g.Items ?? []) {
      if (!b || b.__typename !== 'EligibilitySummaryBulletBlock') continue
      const text = b.Text?.trim() ?? ''
      if (!text) continue
      items.push({ id: b.Id ?? undefined, text })
    }
    if (!subtitle && items.length === 0) continue
    groups.push({
      subtitle: subtitle || '\u00a0',
      items,
    })
  }

  const checkIconSrc =
    mediaRefToUrl(props.CheckIconSrc as Parameters<typeof mediaRefToUrl>[0]) ??
    DEFAULT_CHECK_SRC

  return (
    <EligibilitySummaryBlockFE
      title={props.Title ?? undefined}
      groups={groups}
      checkIconSrc={checkIconSrc}
    />
  )
}
