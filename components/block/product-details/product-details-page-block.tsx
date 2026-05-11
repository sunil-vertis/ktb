import clsx from 'clsx'
import dynamic from 'next/dynamic'

import { ProductDetailsAnchorTabs } from './ProductDetailsAnchorTabs'
import { pdpMainColumnSectionId } from './pdp-main-column-section-id'

const Block = dynamic(() => import('@/components/content-area/block'), {
  ssr: true,
})

type BlockRow = Record<string, unknown> & { __typename?: string | null }

type AnchorTabRow = {
  __typename?: string | null
  SectionId?: string | null
  Label?: string | null
}

export type ProductDetailsPageBlockCmsProps = {
  /** Content area: list of {@link ProductDetailsAnchorTabsBlock} (SectionId + Label). */
  AnchorTabItems?: AnchorTabRow[] | null
  /** Main column blocks (each wrapped in `baseContentWrapper`). */
  LeftContent?: BlockRow[] | null
  /** Sidebar blocks (e.g. sticky CTA); no `baseContentWrapper`. */
  RightContent?: BlockRow[] | null
  anchorTabsAriaLabel?: string
  preview?: boolean
}

function stripTypename<T extends { __typename?: string }>(
  node: T
): Omit<T, '__typename'> {
  const { __typename: _t, ...rest } = node
  return rest
}

/**
 * CMS layout matching {@link ProductDetailsBlockFE}: anchor tabs + two columns.
 * Requires GraphQL `ProductDetailsPageBlockFragment` once type `ProductDetailsPageBlock`
 * exists (see `lib/optimizely/queries/fragments/ProductDetailsPageBlock.graphql.example`).
 */
export default function ProductDetailsPageBlock({
  AnchorTabItems,
  LeftContent,
  RightContent,
  anchorTabsAriaLabel = 'On this page',
  preview,
}: ProductDetailsPageBlockCmsProps) {
  const tabItems = (AnchorTabItems ?? [])
    .filter(
      (t): t is AnchorTabRow =>
        t != null && t.__typename === 'ProductDetailsAnchorTabsBlock'
    )
    .map((t) => {
      const sectionId = (t.SectionId ?? '').trim()
      const label = (t.Label ?? '').trim()
      if (!sectionId || !label) return null
      return { sectionId, label }
    })
    .filter((x): x is NonNullable<typeof x> => x != null)

  const left = (LeftContent ?? []).filter(
    (b): b is BlockRow => b != null && Boolean(b.__typename)
  )
  const right = (RightContent ?? []).filter(
    (b): b is BlockRow => b != null && Boolean(b.__typename)
  )

  const usedAnchorIds = new Set<string>()

  return (
    <section className="product-details" aria-label="Product details">
      {tabItems.length > 0 ? (
        <ProductDetailsAnchorTabs
          items={tabItems}
          ariaLabel={anchorTabsAriaLabel}
        />
      ) : null}

      <div
        className={clsx('product-details__contents', 'container mx-auto px-4')}
      >
        <div
          className={clsx(
            'pdpSectionContentWrapper',
            right.length === 0 && 'pdpSectionContentWrapper--no-sidebar'
          )}
        >
          <div className="pdpSectionContentLeft">
            {left.map((block, index) => {
              const { __typename, ...props } = block
              if (!__typename) return null
              const anchorBase = pdpMainColumnSectionId(__typename)
              const wrapperId =
                anchorBase && !usedAnchorIds.has(anchorBase)
                  ? anchorBase
                  : undefined
              if (wrapperId) usedAnchorIds.add(wrapperId)

              return (
                <div
                  key={`${__typename}--${index}`}
                  id={wrapperId}
                  className="baseContentWrapper"
                >
                  <Block
                    typeName={__typename}
                    props={{
                      ...stripTypename(block),
                      isFirst: index === 0,
                      preview,
                    }}
                  />
                </div>
              )
            })}
          </div>

          {right.length > 0 ? (
            <div className="pdpSectionContentRightSticky">
              {right.map((block, index) => {
                const { __typename } = block
                if (!__typename) return null
                return (
                  <Block
                    key={`${__typename}--right--${index}`}
                    typeName={__typename}
                    props={{
                      ...stripTypename(block),
                      isFirst: false,
                      preview,
                    }}
                  />
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
