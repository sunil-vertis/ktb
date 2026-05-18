import { renderCmsPagePreview } from '@/lib/preview/render-cms-page-preview'
import { checkDraftMode } from '@/lib/utils/draft-mode'
import { notFound } from 'next/navigation'

export const revalidate = 0
export const dynamic = 'force-dynamic'

/** Legacy draft URL; prefer published path /en/loan?ver=… from /api/draft. */
export default async function CmsPage(props: {
  params: Promise<{ locale: string; version: string; slug?: string }>
  searchParams: Promise<{
    key?: string
    ver?: string
    loc?: string
    ctx?: string
  }>
}) {
  const isDraftModeEnabled = await checkDraftMode()
  if (!isDraftModeEnabled) {
    return notFound()
  }

  const { locale, slug = '', version } = await props.params
  const sp = await props.searchParams

  return renderCmsPagePreview({
    locale,
    slug,
    version: sp.ver?.trim() || version,
    searchParams: sp,
  })
}
