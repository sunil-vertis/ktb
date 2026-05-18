import ContentAreaMapper from '@/components/content-area/mapper'
import OnPageEdit from '@/components/draft/on-page-edit'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { optimizely } from '@/lib/optimizely/fetch'
import { getValidLocale } from '@/lib/optimizely/utils/language'
import { checkDraftMode } from '@/lib/utils/draft-mode'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { buildCmsPageBreadcrumbItems } from '@/lib/utils/page-breadcrumbs'

export const revalidate = 0
export const dynamic = 'force-dynamic'

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
  const locales = getValidLocale(locale)
  const formattedSlug = `/${slug}`

  const pageResponse = await optimizely.getPreviewPageByURL(
    { locales, slug: formattedSlug, version },
    { preview: true, useDraftGraphSessionCookie: true }
  )
  const page = pageResponse.data?.CMSPage?.item

  const blocks = (page?.blocks ?? []).filter(
    (block) => block !== null && block !== undefined
  )

  const publishedPath =
    page?._metadata?.url?.default?.trim() ||
    page?._metadata?.url?.hierarchical?.trim() ||
    page?._metadata?.url?.internal?.trim() ||
    page?._metadata?.url?.base?.trim() ||
    null

  const breadcrumbItems = page
    ? buildCmsPageBreadcrumbItems({
        locale,
        pageTitle: page.title,
        publishedPath,
        routePath: formattedSlug,
      })
    : null

  const pageKey = page?._metadata?.key?.trim() || null
  const previewQuery = new URLSearchParams()
  if (sp.key) previewQuery.set('key', sp.key)
  if (sp.ver) previewQuery.set('ver', sp.ver)
  if (sp.loc) previewQuery.set('loc', sp.loc)
  if (sp.ctx) previewQuery.set('ctx', sp.ctx)
  const querySuffix = previewQuery.toString() ? `?${previewQuery.toString()}` : ''
  const currentRoute = `/${locale}/draft/${version}/${slug}${querySuffix}`

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
