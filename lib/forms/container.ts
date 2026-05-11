import { GetFormByKeyDocument } from '@/lib/optimizely/types/generated'
import type { VisualBuilderNode } from '@/lib/optimizely/types/experience'

export async function getFormSettings(nodes: VisualBuilderNode[]) {
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

  return json?.data?.OptiFormsContainerData?.items?.[0] || null
}

export function buildFormComponent(
  node: VisualBuilderNode,
  formSettings: any
) {
  const settings =
    node.type === 'OptiFormsContainerData' ? formSettings : null

  return {
    rows: node.rows,
    nodes: node.nodes,
    elements: node.elements,
    SubmitConfirmationMessage: settings?.SubmitConfirmationMessage,
    ResetConfirmationMessage: settings?.ResetConfirmationMessage,
    ShowSummaryMessageAfterSubmission:
      settings?.ShowSummaryMessageAfterSubmission,
    SubmitUrl: settings?.SubmitUrl,
  }
}