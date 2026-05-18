import ContentAreaMapper from '@/components/content-area/mapper'
import OnPageEdit from '@/components/draft/on-page-edit'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { optimizely } from '@/lib/optimizely/fetch'
import { getValidLocale } from '@/lib/optimizely/utils/language'
import { buildCmsPreviewQuerySuffix } from '@/lib/preview/cms-preview-params'
import { buildCmsPageBreadcrumbItems } from '@/lib/utils/page-breadcrumbs'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export async function renderCmsPagePreview({
  locale,
  slug,
  version,
  searchParams,
}: {
  locale: string
  slug: string
  version: string
  searchParams: {
    key?: string
    ver?: string
    loc?: string
    ctx?: string
  }
}) {
  const locales = getValidLocale(locale)
  const formattedSlug = `/${slug}`

  const pageResponse = await optimizely.getPreviewPageByURL(
    { locales, slug: formattedSlug, version },
    { preview: true, useDraftGraphSessionCookie: true }
  )
  const page = pageResponse.data?.CMSPage?.item

  if (!page) {
    return notFound()
  }

  const blocks = (page.blocks ?? []).filter(
    (block) => block !== null && block !== undefined
  )

  const publishedPath =
    page._metadata?.url?.default?.trim() ||
    page._metadata?.url?.hierarchical?.trim() ||
    page._metadata?.url?.internal?.trim() ||
    page._metadata?.url?.base?.trim() ||
    null

  const breadcrumbItems = buildCmsPageBreadcrumbItems({
    locale,
    pageTitle: page.title,
    publishedPath,
    routePath: formattedSlug,
  })

  const pageKey = page._metadata?.key?.trim() || null
  const querySuffix = buildCmsPreviewQuerySuffix(searchParams)
  const currentRoute = `/${locale}/${slug}${querySuffix}`

  return (
    <div
      className="container py-10"
      data-epi-edit="blocks"
      {...(pageKey ? { 'data-epi-block-id': pageKey } : {})}
    >
      <OnPageEdit version={version} currentRoute={currentRoute} />
      {breadcrumbItems ? <Breadcrumb items={breadcrumbItems} /> : null}
      <Suspense>
        <ContentAreaMapper blocks={blocks} preview />
      </Suspense>
    </div>
  )
}
