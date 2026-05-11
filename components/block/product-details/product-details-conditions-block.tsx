'use client'

import * as React from 'react'
import clsx from 'clsx'

import { GlobalIcon } from '@/components/ui/global-icon'

import type { ProductDetailsConditionsBlockFragmentFragment } from '@/lib/optimizely/types/generated'

export type ProductDetailsConditionsBlockProps = {
  title?: string
  className?: string
  sectionId?: string
  children?: React.ReactNode
  defaultOpen?: boolean
}

export function ProductDetailsConditionsBlockFE({
  title = 'Product Details & Conditions',
  className,
  sectionId,
  children,
  defaultOpen = false,
}: ProductDetailsConditionsBlockProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const panelId = React.useId()
  const content = children ?? (
    <div className="product-details-conditions__body">
      <p className="type-body-base-regular">
        Interest rates are floating and may change according to the bank&apos;s
        announcement. Repayment terms, fees, and eligibility are subject to the
        latest product conditions.
      </p>
      <p className="type-body-base-regular">
        Please review the loan agreement, product fact sheet, and all supporting
        documents before applying. Final approval is based on the bank&apos;s credit
        assessment criteria.
      </p>
      <p className="type-body-small-regular">
        Borrow only what is necessary and within your repayment ability.
      </p>
    </div>
  )

  return (
    <section
      id={sectionId}
      className={clsx('product-details-conditions', className)}
      aria-label="Product details and conditions"
    >
      <button
        type="button"
        className="product-details-conditions__header"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <h2 className="product-details-conditions__title type-heading-h3">{title}</h2>
        <span
          className={clsx(
            'product-details-conditions__icon',
            isOpen && 'product-details-conditions__icon--open'
          )}
          aria-hidden
        >
          <GlobalIcon type="chevron-down" size="L" />
        </span>
      </button>
      <div
        id={panelId}
        className={clsx(
          'product-details-conditions__panel',
          isOpen && 'product-details-conditions__panel--open'
        )}
      >
        {content}
      </div>
    </section>
  )
}

type CmsProductDetailsConditionsProps = Omit<
  ProductDetailsConditionsBlockFragmentFragment,
  '__typename'
>

export default function ProductDetailsConditionsBlock(
  props: CmsProductDetailsConditionsProps
) {
  const html = props.Body?.html?.trim()
  const children = html ? (
    <div
      className="product-details-conditions__body product-details-conditions__body--cms"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : undefined

  return (
    <ProductDetailsConditionsBlockFE
      title={props.Title ?? undefined}
      defaultOpen={props.DefaultOpen ?? undefined}
    >
      {children}
    </ProductDetailsConditionsBlockFE>
  )
}
