import clsx from 'clsx'

import type { LoanInterestGroupBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import LoanCalculationExamplesSection from './loan-calculation-examples-section'
import LoanInterestRatesSection from './loan-interest-rates-section'
import LoanLimitGrantedSection from './loan-limit-granted-section'
import LoanTermMediaGallerySection from './loan-term-media-gallery-section'
import { LoanCalculationExamplesSectionFE } from './loan-calculation-examples-section'
import { LoanInterestRatesSectionFE } from './loan-interest-rates-section'
import { LoanLimitGrantedSectionFE } from './loan-limit-granted-section'
import { LoanTermMediaGallerySectionFE } from './loan-term-media-gallery-section'

export type LoanInterestGroupBlockProps = {
  className?: string
}

/**
 * Loan interest Figma block (169:2284 / 169:4036): four sections with 60px vertical
 * rhythm between them, inside one PDP content wrapper.
 */
export function LoanInterestGroupBlockFE({
  className,
}: LoanInterestGroupBlockProps) {
  return (
    <div className={clsx('loan-interest-group', className)}>
      <LoanInterestRatesSectionFE />
      <LoanLimitGrantedSectionFE />
      <LoanCalculationExamplesSectionFE />
      <LoanTermMediaGallerySectionFE />
    </div>
  )
}

function stripTypename<T extends { __typename?: string }>(
  node: T
): Omit<T, '__typename'> {
  const { __typename: _t, ...rest } = node
  return rest
}

type CmsLoanInterestGroupProps = Omit<
  LoanInterestGroupBlockFragmentFragment,
  '__typename'
>

export default function LoanInterestGroupBlock({
  className,
  Items,
}: CmsLoanInterestGroupProps & { className?: string }) {
  return (
    <div className={clsx('loan-interest-group', className)}>
      {(Items ?? []).map((item, index) => {
        if (!item) return null
        const key = `${item.__typename}-${index}`
        switch (item.__typename) {
          case 'LoanInterestRatesSectionBlock':
            return (
              <LoanInterestRatesSection
                key={key}
                {...stripTypename(item)}
              />
            )
          case 'LoanLimitGrantedSectionBlock':
            return (
              <LoanLimitGrantedSection
                key={key}
                {...stripTypename(item)}
              />
            )
          case 'LoanCalculationExamplesSectionBlock':
            return (
              <LoanCalculationExamplesSection
                key={key}
                {...stripTypename(item)}
              />
            )
          case 'LoanTermMediaGallerySectionBlock':
            return (
              <LoanTermMediaGallerySection
                key={key}
                {...stripTypename(item)}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
