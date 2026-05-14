import * as React from 'react'
import clsx from 'clsx'

import type { LoanLimitGrantedSectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'

export type LoanLimitGrantedSectionProps = {
  title?: string
  /** Header row (3 columns). */
  columnHeaders?: readonly string[]
  /** Body: row label + 2 cells (government col, private col). */
  rows?: readonly {
    rowLabel: string
    cells: readonly [React.ReactNode, React.ReactNode]
  }[]
  className?: string
  sectionId?: string
}

const DEFAULT_HEADERS: NonNullable<
  LoanLimitGrantedSectionProps['columnHeaders']
> = [
  'Borrower',
  'Government agencies and state enterprises',
  'Private sector',
] as const

const DEFAULT_ROWS: NonNullable<LoanLimitGrantedSectionProps['rows']> = [
  {
    rowLabel: 'The organization has a MOU with Krung Thai Bank',
    cells: [
      <>
        <span className="loan-limit-granted__accent">Up to 15 times</span>
        {' your monthly salary'}
      </>,
      <>
        <span className="loan-limit-granted__accent">Up to 5 times</span>
        {' your monthly salary'}
      </>,
    ],
  },
  {
    rowLabel: 'The organization does not have a MOU with Krung Thai Bank',
    cells: [
      <>
        <span className="loan-limit-granted__accent">Up to 10 times</span>
        {' your monthly salary'}
      </>,
      <>
        <span className="loan-limit-granted__accent">
          The maximum loan amount is 5 times
        </span>
        {' your monthly salary'}
      </>,
    ],
  },
]

export function LoanLimitGrantedSectionFE({
  title = 'Loan Limit Granted',
  columnHeaders = DEFAULT_HEADERS,
  rows = DEFAULT_ROWS,
  className,
  sectionId,
}: LoanLimitGrantedSectionProps) {
  const headingId = React.useId()
  const headers = columnHeaders ?? DEFAULT_HEADERS
  const bodyRows = rows ?? DEFAULT_ROWS

  return (
    <section
      id={sectionId}
      className={clsx('loan-limit-granted', className)}
      aria-labelledby={headingId}
    >
      <h2 className="loan-limit-granted__title type-heading-h3" id={headingId}>
        {title}
      </h2>

      <div className="loan-limit-granted__table-scroll">
        <table className="loan-limit-granted__table">
          <thead>
            <tr>
              {headers.map((label, i) => (
                <th
                  key={i}
                  scope="col"
                  className={clsx(
                    'loan-limit-granted__cell',
                    'loan-limit-granted__cell--head',
                    i === 0
                      ? 'loan-limit-granted__cell--corner'
                      : 'loan-limit-granted__cell--topcol'
                  )}
                >
                  <span className="loan-limit-granted__cell-text">{label}</span>
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
                    'loan-limit-granted__cell',
                    'loan-limit-granted__cell--rowhead'
                  )}
                >
                  <span className="loan-limit-granted__cell-text">
                    {row.rowLabel}
                  </span>
                </th>
                <td className="loan-limit-granted__cell">
                  <span className="loan-limit-granted__cell-inner type-body-small-regular">
                    {row.cells[0]}
                  </span>
                </td>
                <td className="loan-limit-granted__cell">
                  <span className="loan-limit-granted__cell-inner type-body-small-regular">
                    {row.cells[1]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function richHtmlToCell(html: string | null | undefined): React.ReactNode {
  const trimmed = html?.trim() ?? ''
  if (!trimmed) return null
  return (
    <span
      className="loan-limit-granted__rich"
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  )
}

type CmsLoanLimitGrantedSectionProps = Omit<
  LoanLimitGrantedSectionBlockFragmentFragment,
  '__typename'
>

export default function LoanLimitGrantedSection(
  props: CmsLoanLimitGrantedSectionProps
) {
  const columnHeaders =
    props.columnHeadersList
      ?.map((item) => {
        if (item?.__typename === 'OptionBlock') {
          return (
            item.OptionText?.trim() ||
            item.OptionValue?.trim() ||
            ''
          )
        }
        return ''
      })
      .filter((h) => h.length > 0) ?? undefined

  const rows =
    props.Rows?.map((r) => {
      if (!r || r.__typename !== 'LoanLimitGrantedTableRowBlock') return null
      const rowLabel = r.RowLabel?.trim() ?? ''
      const left = richHtmlToCell(r.GovernmentCell?.html)
      const right = richHtmlToCell(r.PrivateCell?.html)
      if (!rowLabel && !left && !right) return null
      return {
        rowLabel: rowLabel || '\u00a0',
        cells: [left, right] as [React.ReactNode, React.ReactNode],
      }
    }).filter((row): row is NonNullable<typeof row> => row != null) ?? undefined

  return (
    <LoanLimitGrantedSectionFE
      title={props.Title ?? undefined}
      columnHeaders={
        columnHeaders && columnHeaders.length >= 3
          ? columnHeaders
          : DEFAULT_HEADERS
      }
      rows={rows?.length ? rows : DEFAULT_ROWS}
    />
  )
}
