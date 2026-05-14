import { GetFormByKeyDocument } from '@/lib/optimizely/types/generated'
import type { VisualBuilderNode } from '@/lib/optimizely/types/experience'

export async function getFormSettings(
  nodes: VisualBuilderNode[],
  locale?: string
) {
  const formNode = nodes.find(
    (node) => node.type === 'OptiFormsContainerData'
  )

  if (!formNode?.displayName) return null

  const response = await fetch(
    `${process.env.OPTIMIZELY_API_URL}?auth=${process.env.OPTIMIZELY_SINGLE_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        query: GetFormByKeyDocument.loc?.source.body,
        variables: {
          displayName: formNode.displayName,
        },
      }),
    }
  )

  const json = await response.json()
  const items = json?.data?.OptiFormsContainerData?.items || []

  const isThai = locale === 'th' || locale === 'th-TH'

  const matchedItem = items.find((item: any) => {
    const message = item?.SubmitConfirmationMessage || ''

    return isThai
      ? /[\u0E00-\u0E7F]/.test(message)
      : !/[\u0E00-\u0E7F]/.test(message)
  })

  let promotionBlock = null

  const promotionBlockKey =
    matchedItem?.PromotionBlock?.key ||
    '2176969286f54500b350e10d87d22d46'

  if (promotionBlockKey) {
    const promotionResponse = await fetch(
      `${process.env.OPTIMIZELY_API_URL}?auth=${process.env.OPTIMIZELY_SINGLE_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          query: `
            query GetPromotionBlock($guid: String) {
              ApplicationCardBlock(
                where: { _metadata: { key: { eq: $guid } } }
              ) {
                items {
                  Heading
                  Description
                  ApplicationLink {
                    url {
                      default
                    }
                    title
                    target
                  }
                  QRImage {
                    url {
                      default
                    }
                  }
                  ShowThisPromotion
                }
              }
            }
          `,
          variables: {
            guid: promotionBlockKey,
          },
        }),
      }
    )

    const promotionJson = await promotionResponse.json()

    const promotionItems =
      promotionJson?.data?.ApplicationCardBlock?.items || []

    const matchedPromotion = promotionItems.find((item: any) => {
      const heading = item?.Heading || ''

      return isThai
        ? /[\u0E00-\u0E7F]/.test(heading)
        : !/[\u0E00-\u0E7F]/.test(heading)
    })

    promotionBlock =
      matchedPromotion || promotionItems[0] || null
  }

  return {
    ...(matchedItem || items[0] || {}),
    PromotionBlockData: promotionBlock,
  }
}

export function buildFormComponent(
  node: VisualBuilderNode,
  formSettings: any
) {
  if (node.type !== 'OptiFormsContainerData') {
    return node.component || node
  }

  return {
    ...(node.component || {}),
    rows: node.rows,
    nodes: node.nodes,
    elements: node.elements,
    SubmitConfirmationMessage:
      formSettings?.SubmitConfirmationMessage,
    ResetConfirmationMessage:
      formSettings?.ResetConfirmationMessage,
    ShowSummaryMessageAfterSubmission:
      formSettings?.ShowSummaryMessageAfterSubmission,
    SubmitUrl: formSettings?.SubmitUrl,
    PromotionBlock:
      formSettings?.PromotionBlockData,
    ShowThisPromotion:
      formSettings?.PromotionBlockData?.ShowThisPromotion,
  }
}