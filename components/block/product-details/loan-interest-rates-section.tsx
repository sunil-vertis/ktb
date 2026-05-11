import * as React from 'react'
import clsx from 'clsx'

import type { LoanInterestRatesSectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'

export type LoanInterestRatesSectionProps = {
  title?: string
  introduction?: string
  /** First row: column headers (5 cells). */
  columnHeaders?: readonly string[]
  /** Body rows: row label + 4 data cells. */
  rows?: readonly { rowLabel: string; cells: readonly string[] }[]
  footnote?: string
  className?: string
  sectionId?: string
}

const DEFAULT_COLUMN_HEADERS: NonNullable<
  LoanInterestRatesSectionProps['columnHeaders']
> = [
  'Borrower qualifications',
  'Government personnel and private sector employees',
  'Government personnel',
  'Private sector employees',
  'Private sector employees',
] as const

const DEFAULT_ROWS: NonNullable<LoanInterestRatesSectionProps['rows']> = [
  {
    rowLabel: 'Guarantor',
    cells: [
      'Yes/No exceptions*',
      'Do not have',
      'Yes/No exceptions*',
      'Do not have',
    ],
  },
  {
    rowLabel: 'The agency has an MOU',
    cells: ['Yes/No', 'Yes/No', 'Have', 'Do not have'],
  },
  {
    rowLabel: 'Interest (per year)',
    cells: ['MRR +3.50%', 'MRR +5.50%', 'MRR +6.00%', 'MRR +9.00%'],
  },
]

export function LoanInterestRatesSectionFE({
  title = 'Krungthai Thanawat Personal Loan Interest Rates',
  introduction = 'Interest rates for personal loans for customers who receive their salaries through a Krungthai Bank account.',
  columnHeaders = DEFAULT_COLUMN_HEADERS,
  rows = DEFAULT_ROWS,
  footnote = "*Excluding guarantors. This applies to borrowers with income exceeding 25,000 baht per month for government personnel | and to borrowers with income exceeding 80,000 baht per month for private sector employees. Conditions are subject to the bank's regulations.",
  className,
  sectionId,
}: LoanInterestRatesSectionProps) {
  const headingId = React.useId()
  const headers = columnHeaders ?? DEFAULT_COLUMN_HEADERS
  const bodyRows = rows ?? DEFAULT_ROWS

  return (
    <section
      id={sectionId}
      className={clsx('loan-interest-rates', className)}
      aria-labelledby={headingId}
    >
      <div className="loan-interest-rates__header">
        <h2 className="loan-interest-rates__title type-heading-h3" id={headingId}>
          {title}
        </h2>
        <p className="loan-interest-rates__intro type-body-base-regular">
          {introduction}
        </p>
      </div>

      <div className="loan-interest-rates__table-scroll">
        <table className="loan-interest-rates__table">
          <thead>
            <tr>
              {headers.map((label, i) => (
                <th
                  key={i}
                  scope="col"
                  className={clsx(
                    'loan-interest-rates__cell',
                    'loan-interest-rates__cell--head',
                    i === 0
                      ? 'loan-interest-rates__cell--corner'
                      : 'loan-interest-rates__cell--topcol'
                  )}
                >
                  <span className="loan-interest-rates__cell-text">{label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri}>
                <th
                  scope="row"
                  className={clsx(
                    'loan-interest-rates__cell',
                    'loan-interest-rates__cell--rowhead'
                  )}
                >
                  <span className="loan-interest-rates__cell-text">
                    {row.rowLabel}
                  </span>
                </th>
                {row.cells.map((cell, ci) => (
                  <td key={ci} className="loan-interest-rates__cell">
                    <span className="loan-interest-rates__cell-text">{cell}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote ? (
        <p className="loan-interest-rates__footnote type-body-small-regular">
          {footnote}
        </p>
      ) : null}
    </section>
  )
}

type CmsLoanInterestRatesSectionProps = Omit<
  LoanInterestRatesSectionBlockFragmentFragment,
  '__typename'
>

export default function LoanInterestRatesSection(
  props: CmsLoanInterestRatesSectionProps
) {
  const columnHeaders =
    props.columnHeadersList?.filter(
      (h): h is string => typeof h === 'string' && h.length > 0
    ) ?? undefined

  const rows =
    props.Rows?.map((r) => {
      if (!r || r.__typename !== 'LoanInterestRatesTableRowBlock') return null
      const rowLabel = r.RowLabel?.trim() ?? ''
      const dataCells = [r.Cell1, r.Cell2, r.Cell3, r.Cell4].map(
        (c) => c?.trim() ?? ''
      )
      if (!rowLabel && !dataCells.some(Boolean)) return null
      return { rowLabel, cells: dataCells as readonly string[] }
    }).filter((row): row is NonNullable<typeof row> => row != null) ?? undefined

  return (
    <LoanInterestRatesSectionFE
      title={props.Title ?? undefined}
      introduction={props.Introduction ?? undefined}
      columnHeaders={
        columnHeaders?.length ? columnHeaders : DEFAULT_COLUMN_HEADERS
      }
      rows={rows?.length ? rows : DEFAULT_ROWS}
      footnote={props.Footnote ?? undefined}
    />
  )
}
