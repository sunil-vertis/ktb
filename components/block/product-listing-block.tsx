'use client'

import { useMemo } from 'react'

import { CardListingBlockFE } from '@/components/block/card-listing-block'
import { Tabs, type TabItem } from '@/components/ui/tabs'
import {
  PRODUCT_LISTING_CREDIT_CHIP_FILTERS,
  PRODUCT_LISTING_CREDIT_ITEMS,
  PRODUCT_LISTING_DEBIT_ITEMS,
  PRODUCT_LISTING_PREPAID_ITEMS,
  PRODUCT_LISTING_PROMOTIONS_ITEMS,
} from '@/lib/data/product-listing-data'

import styles from '@/styles/components/product-listing-block.module.scss'

export type ProductListingBlockProps = {
  /** Outer wrapper (below tabs strip listing panels typically white). */
  backgroundColor?: string
}

export default function ProductListingBlock({
  backgroundColor = 'transparent',
}: ProductListingBlockProps) {
  const tabItems: TabItem[] = useMemo(
    () => [
      {
        id: 'debit-cards',
        label: 'Debit Cards',
        content: (
          <CardListingBlockFE
            embedded
            title="Debit cards"
            subtitle="Choose the card that works for you."
            items={PRODUCT_LISTING_DEBIT_ITEMS}
            pageSize={6}
            backgroundColor="var(--base-white, #ffffff)"
            paginationAriaLabel="Debit cards pagination"
          />
        ),
      },
      {
        id: 'credit-cards',
        label: 'Credit Cards',
        content: (
          <CardListingBlockFE
            embedded
            title="Credit cards"
            subtitle="Choose the card that works for you."
            items={PRODUCT_LISTING_CREDIT_ITEMS}
            chipFilters={PRODUCT_LISTING_CREDIT_CHIP_FILTERS}
            allChipLabel="All Cards"
            pageSize={12}
            backgroundColor="var(--base-white, #ffffff)"
            paginationAriaLabel="Credit cards pagination"
          />
        ),
      },
      {
        id: 'prepaid-cash-cards',
        label: 'Prepaid and Cash Cards',
        content: (
          <CardListingBlockFE
            embedded
            title="Prepaid and Cash Cards"
            subtitle="Choose the card that works for you."
            items={PRODUCT_LISTING_PREPAID_ITEMS}
            pageSize={12}
            backgroundColor="var(--base-white, #ffffff)"
            paginationAriaLabel="Prepaid and cash cards pagination"
          />
        ),
      },
      {
        id: 'promotions',
        label: 'Promotions',
        content: (
          <CardListingBlockFE
            embedded
            title="Promotions"
            subtitle="Explore special discounts and cashback offers on dining, travel, and shopping."
            items={PRODUCT_LISTING_PROMOTIONS_ITEMS}
            pageSize={12}
            backgroundColor="var(--base-white, #ffffff)"
            paginationAriaLabel="Promotions pagination"
          />
        ),
      },
    ],
    []
  )

  return (
    <section className={styles.section} style={{ backgroundColor }}>
      <Tabs
        defaultActiveId="debit-cards"
        items={tabItems}
        showPanels
        listClassName={styles.tabsList}
        panelClassName={styles.tabPanel}
      />
    </section>
  )
}
