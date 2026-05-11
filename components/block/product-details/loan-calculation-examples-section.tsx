'use client'

import * as React from 'react'
import clsx from 'clsx'

import { Accordion } from '@/components/ui/accordion'

import type { LoanCalculationExamplesSectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'

/** Figma accordion chevron (node 208:4269 — filled path, base black). */
function LoanCalculationAccordionChevron() {
  return (
    <span className="loan-calculation-examples__accordion-icon" aria-hidden>
      <svg
        width={14}
        height={8}
        viewBox="0 0 15 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="var(--base-black, #002533)"
          d="M13.3612 0.263368C13.7358 -0.0877892 14.3304 -0.0877893 14.705 0.263368C15.0976 0.631792 15.0978 1.24275 14.705 1.61104L8.17171 7.73611L8.13558 7.76736L8.06234 7.82303L8.02034 7.8533C7.65369 8.08029 7.15788 8.04517 6.82795 7.73611L0.294688 1.61104C-0.0982495 1.24267 -0.0982091 0.631766 0.294688 0.263368C0.669265 -0.0877892 1.26387 -0.0877893 1.63845 0.263368L7.49983 5.75855L13.3612 0.263368Z"
        />
      </svg>
    </span>
  )
}

export type LoanCalculationExamplesSectionProps = {
  className?: string
  sectionId?: string
  accordionTitle?: string
  /** Single accordion panel body (Figma long-form copy). */
  children?: React.ReactNode
}

export function LoanCalculationExamplesSectionFE({
  className,
  sectionId,
  accordionTitle = 'See example of loan calculation and installment payments',
  children,
}: LoanCalculationExamplesSectionProps) {
  const defaultContent = (
    <div className="loan-calculation-examples__body">
      <p className="loan-calculation-examples__lead type-body-small-medium">
        Example of a hypothetical calculation of interest on a loan:
      </p>
      <p className="type-body-base-regular">
        The formula for calculating interest on a regular loan is: (Outstanding
        Principal x Regular Annual Interest Rate x Number of Days in the Period)
        / 365 or 366 (depending on the case).
      </p>
      <p className="loan-calculation-examples__lead type-body-small-medium">
        Example of how to calculate installment payments:
      </p>
      <p className="type-body-base-regular">
        Revolving credit line of 10,000 baht, starting interest rate of 2.83 baht
        per day.
      </p>
      <p className="type-body-base-regular">
        Calculation based on a revolving credit line usage of 10,000 baht, an
        interest rate of 10.345% per annum,
      </p>
      <p className="type-body-base-regular">
        total interest of 85 baht, and a disbursement period of 30 days. The
        principal and interest, totaling 10,085 baht, must be repaid within the
        specified disbursement period. Reference interest rate: MRR = 6.845% per
        annum (as of March 2, 2026).
      </p>
      <p className="type-body-base-regular">
        Note: *Interest rates range from MRR +3.50% per annum to MRR +9.00% per
        annum | Reference interest rate MRR = 6.845% per annum (as of March 2,
        2026) | Floating interest rates are subject to change, increasing or
        decreasing | Maximum loan amount is 15 times your monthly salary for
        cases where the employing organization has a Memorandum of Understanding
        (MOU) with the bank | Loan approval terms and conditions are subject to
        the bank&apos;s regulations.
      </p>
      <p className="loan-calculation-examples__tagline type-body-small-medium">
        Borrow only what is necessary and what you can afford to repay.
      </p>
    </div>
  )

  return (
    <section
      id={sectionId}
      className={clsx('loan-calculation-examples', className)}
    >
      <Accordion
        className="loan-calculation-examples__accordion"
        items={[
          {
            id: 'loan-calculation-example',
            title: accordionTitle,
            content: children ?? defaultContent,
          },
        ]}
        defaultOpenIds={['loan-calculation-example']}
        icon={<LoanCalculationAccordionChevron />}
      />
    </section>
  )
}

type CmsLoanCalculationExamplesProps = Omit<
  LoanCalculationExamplesSectionBlockFragmentFragment,
  '__typename'
>

export default function LoanCalculationExamplesSection(
  props: CmsLoanCalculationExamplesProps
) {
  const html = props.Body?.html?.trim()
  const children = html ? (
    <div
      className="loan-calculation-examples__body loan-calculation-examples__body--cms"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : undefined

  return (
    <LoanCalculationExamplesSectionFE
      accordionTitle={props.AccordionTitle ?? undefined}
    >
      {children}
    </LoanCalculationExamplesSectionFE>
  )
}
