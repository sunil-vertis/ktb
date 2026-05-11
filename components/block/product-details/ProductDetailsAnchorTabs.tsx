import clsx from 'clsx'

import { AnchorTabs, type AnchorTabItem } from '@/components/ui/tabs'

export type { AnchorTabItem }

export type ProductDetailsAnchorTabsProps = {
  items: AnchorTabItem[]
  /** Passed to `AnchorTabs` as `ariaLabel` (nav landmark). */
  ariaLabel?: string
  /** Optional class on the outer sticky wrapper (`product-details__tabs-wrap`). */
  className?: string
}

/**
 * Sticky PDP anchor tab strip: wraps {@link AnchorTabs} in the Figma layout shells.
 */
export function ProductDetailsAnchorTabs({
  items,
  ariaLabel = 'On this page',
  className,
}: ProductDetailsAnchorTabsProps) {
  return (
    <div className={clsx('product-details__tabs-wrap', className)}>
      <div className="product-details__tabs-inner">
        <AnchorTabs ariaLabel={ariaLabel} items={items} />
      </div>
    </div>
  )
}
