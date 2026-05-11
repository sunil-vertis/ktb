import * as React from 'react'
import clsx from 'clsx'

import { AnchorTabs, type AnchorTabItem } from '@/components/ui/tabs'

import {
  EligibilitySummaryBlockFE,
  type EligibilitySummaryGroup,
} from './eligibility-summary-block'
import {
  ProductHighlightsBlockFE,
  type ProductHighlightTile,
} from './product-highlights-block'
import {
  PersonalLoanCalculatorBlockFE,
  type PersonalLoanCalculatorBlockProps,
} from './personal-loan-calculator-block'
import { LoanInterestGroupBlockFE } from './loan-interest-group-block'
import { ProductDetailsConditionsBlockFE } from './product-details-conditions-block'
import {
  DownloadSectionBlockFE,
  type DownloadResourceItem,
} from './download-section-block'
import { ProductFaqBlockFE, type ProductFaqItem } from './product-faq-block'
import {
  RequestInformationBlockFE,
  type RequestInformationFormValues,
} from './request-information-block'
import {
  StickySideBarBlockFE,
  type StickySideBarBlockProps,
} from './sticky-side-bar-block'

export type ProductDetailsAnchorSection = {
  sectionId: string
  label: React.ReactNode
  title: React.ReactNode
  body: React.ReactNode
}

export type ProductDetailsEligibilitySummaryInput = {
  title?: string
  groups?: EligibilitySummaryGroup[]
}

export type ProductDetailsProductHighlightsInput = {
  title?: string
  tiles?: ProductHighlightTile[]
}

export type ProductDetailsLoanCalculatorInput = Omit<
  PersonalLoanCalculatorBlockProps,
  'className' | 'sectionId'
>

export type ProductDetailsConditionsInput = {
  title?: string
  defaultOpen?: boolean
  content?: React.ReactNode
}

export type ProductDetailsDownloadSectionInput = {
  title?: string
  sortLabel?: string
  items?: DownloadResourceItem[]
}

export type ProductDetailsFaqInput = {
  title?: string
  items?: ProductFaqItem[]
  showMoreLabel?: string
  initiallyVisibleCount?: number
  defaultOpenId?: string
}

export type ProductDetailsRequestInformationInput = {
  title?: string
  formTitle?: string
  formDescription?: React.ReactNode
  submitLabel?: string
  onSubmit?: (values: RequestInformationFormValues) => void
}

export type ProductDetailsStickySideBarInput = Omit<
  StickySideBarBlockProps,
  'className'
>

export type ProductDetailsBlockProps = {
  sections?: ProductDetailsAnchorSection[]
  /** Content for the eligibility summary block; omit `groups` to use sample defaults. */
  eligibilitySummary?: ProductDetailsEligibilitySummaryInput
  /** Product highlights tiles; omit `tiles` to use sample defaults from Figma copy. */
  productHighlights?: ProductDetailsProductHighlightsInput
  /** Personal loan calculator (client-side sliders + amortization). */
  loanCalculator?: ProductDetailsLoanCalculatorInput
  /** Product details and conditions accordion content. */
  productDetailsConditions?: ProductDetailsConditionsInput
  /** Downloadable resources section content. */
  downloadSection?: ProductDetailsDownloadSectionInput
  /** Product FAQ section content. */
  productFaq?: ProductDetailsFaqInput
  /** Request information form content and submit callback. */
  requestInformation?: ProductDetailsRequestInformationInput
  /** Sticky side bar CTA card content. */
  stickySideBar?: ProductDetailsStickySideBarInput
  /** Merged onto the root `.product-details` element. */
  className?: string
  /** `aria-label` on the outer product details region. */
  ariaLabel?: string
  /** Passed through to `AnchorTabs`. */
  anchorTabsAriaLabel?: string
}

const DEFAULT_PRODUCT_HIGHLIGHTS_TILES: ProductHighlightTile[] = [
  {
    id: 'low-interest',
    row: 'featured',
    iconPreset: 'featured',
    title: 'Low-interest personal loans',
    description:
      'Interest rates start at 10.345% - 15.845% per annum* (as of March 2, 2026). Loans are available with or without a guarantor.',
  },
  {
    id: 'interest-used',
    row: 'grid',
    iconPreset: 'interest',
    title: 'Interest is calculated based on the actual amount used',
    description: "If you don't use it, you won't have to pay interest.",
  },
  {
    id: 'easy-peasy',
    row: 'grid',
    iconPreset: 'krungthai',
    title: 'Krungthai, easy peasy.',
    description: (
      <>
        <span>0% installment plan available for up to 10 months. </span>
        <a href="#" className="product-highlights__learn-more">
          Learn more.
        </a>
      </>
    ),
  },
]

const DEFAULT_ELIGIBILITY_GROUPS: EligibilitySummaryGroup[] = [
  {
    subtitle:
      'Personal loan eligible for customers who receive their salary through a Krungthai Bank account.',
    items: [
      {
        id: 'salary-threshold',
        text: 'Loan applications are open to both government officials/state enterprise employees and private company employees with salary from 13,000 baht and up.',
      },
      {
        id: 'loan-limit',
        text: "Maximum personal loan limit up to 15 times your monthly salary* (depending on the MOU between the client's organization and the bank).",
      },
    ],
  },
]

const DEFAULT_SECTIONS: ProductDetailsAnchorSection[] = [
  {
    sectionId: 'pdp-highlights',
    label: 'Highlights',
    title: 'Highlights',
    body: (
      <p className="type-body-base-regular max-w-prose text-neutral-600">
        Overview of this product: key benefits, eligibility, and how to get
        started in a few steps.
      </p>
    ),
  },
  {
    sectionId: 'pdp-loan-calculator',
    label: 'Loan Calculator',
    title: 'Loan Calculator',
    body: (
      <p className="type-body-base-regular max-w-prose text-neutral-600">
        Estimate monthly payments by adjusting amount, term, and rate. Results
        are illustrative only.
      </p>
    ),
  },
  {
    sectionId: 'pdp-interest-rates',
    label: 'Interest Rates',
    title: 'Interest Rates',
    body: (
      <p className="type-body-base-regular max-w-prose text-neutral-600">
        Published reference rates and how they apply to this product. Rates may
        change without notice.
      </p>
    ),
  },
  {
    sectionId: 'pdp-protection-agreement',
    label: 'Protection Agreement',
    title: 'Protection Agreement',
    body: (
      <p className="type-body-base-regular max-w-prose text-neutral-600">
        Summary of optional protection coverage, exclusions, and how to file a
        claim.
      </p>
    ),
  },
  {
    sectionId: 'pdp-download-resources',
    label: 'Download Resources',
    title: 'Download Resources',
    body: (
      <p className="type-body-base-regular max-w-prose text-neutral-600">
        PDFs and forms related to this product, including terms and disclosure
        schedules.
      </p>
    ),
  },
  {
    sectionId: 'pdp-faq',
    label: 'FAQ',
    title: 'FAQ',
    body: (
      <p className="type-body-base-regular max-w-prose text-neutral-600">
        Common questions about fees, limits, and account servicing for this
        product line.
      </p>
    ),
  },
]

/** Sticky tab targets for CMS-driven PDP pages (same order as the composed preview). */
export const PRODUCT_DETAILS_ANCHOR_TAB_ITEMS: AnchorTabItem[] =
  DEFAULT_SECTIONS.map((s) => ({
    sectionId: s.sectionId,
    label: s.label,
  }))

export default function ProductDetailsBlock({
  sections = DEFAULT_SECTIONS,
  eligibilitySummary,
  productHighlights,
  loanCalculator,
  productDetailsConditions,
  downloadSection,
  productFaq,
  requestInformation,
  stickySideBar,
  className,
  ariaLabel = 'Product details',
  anchorTabsAriaLabel = 'On this page',
}: ProductDetailsBlockProps) {
  const anchorItems = sections.map((s) => ({
    sectionId: s.sectionId,
    label: s.label,
  }))

  return (
    <section
      className={clsx('product-details', className)}
      aria-label={ariaLabel}
    >
      <div className="product-details__tabs-wrap">
        <div className="product-details__tabs-inner">
          <AnchorTabs ariaLabel={anchorTabsAriaLabel} items={anchorItems} />
        </div>
      </div>

      <div
        className={clsx('product-details__contents', 'container mx-auto px-4')}
      >
        <div className="pdpSectionContentWrapper">
          <div className="pdpSectionContentLeft">
            <div className="baseContentWrapper">
              <EligibilitySummaryBlockFE
                title={eligibilitySummary?.title ?? 'Eligibility Summary'}
                groups={eligibilitySummary?.groups ?? DEFAULT_ELIGIBILITY_GROUPS}
              />
            </div>

            {/* highlights section */}
            <div id="pdp-highlights" className="baseContentWrapper">
              <ProductHighlightsBlockFE
                title={productHighlights?.title ?? 'Product Highlights'}
                tiles={
                  productHighlights?.tiles ?? DEFAULT_PRODUCT_HIGHLIGHTS_TILES
                }
              />
            </div>

            {/* loan calculator section */}
            <div id="pdp-loan-calculator" className="baseContentWrapper">
              <PersonalLoanCalculatorBlockFE {...loanCalculator} />
            </div>

            {/* Interest Rates section */}
            <div id="pdp-interest-rates" className="baseContentWrapper">
              <LoanInterestGroupBlockFE />
            </div>

            {/* Protection Agreement section */}
            <div id="pdp-protection-agreement" className="baseContentWrapper">
              <ProductDetailsConditionsBlockFE
                title={productDetailsConditions?.title}
                defaultOpen={productDetailsConditions?.defaultOpen}
              >
                {productDetailsConditions?.content}
              </ProductDetailsConditionsBlockFE>
            </div>

            {/* Download Resources section */}
            <div id="pdp-download-resources" className="baseContentWrapper">
              <DownloadSectionBlockFE
                title={downloadSection?.title}
                sortLabel={downloadSection?.sortLabel}
                items={downloadSection?.items}
              />
            </div>

            {/* FAQ section */}
            <div id="pdp-faq" className="baseContentWrapper">
              <ProductFaqBlockFE
                title={productFaq?.title}
                items={productFaq?.items}
                showMoreLabel={productFaq?.showMoreLabel}
                initiallyVisibleCount={productFaq?.initiallyVisibleCount}
                defaultOpenId={productFaq?.defaultOpenId}
              />
            </div>
            <div className="baseContentWrapper">
              <RequestInformationBlockFE
                title={requestInformation?.title}
                formTitle={requestInformation?.formTitle}
                formDescription={requestInformation?.formDescription}
                submitLabel={requestInformation?.submitLabel}
                onSubmit={requestInformation?.onSubmit}
              />
            </div>
          </div>
          <div className="pdpSectionContentRightSticky">
            <StickySideBarBlockFE {...stickySideBar} />
          </div>
        </div>
      </div>
    </section>
  )
}
