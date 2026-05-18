export type CmsPreviewParams = {
  key: string
  ver: string
  loc: string
  ctx: string | null
}

export function appendCmsPreviewParams(path: string, params: CmsPreviewParams) {
  const search = new URLSearchParams()
  search.set('key', params.key)
  search.set('ver', params.ver)
  search.set('loc', params.loc)
  if (params.ctx?.trim()) {
    search.set('ctx', params.ctx.trim())
  }
  return `${path}?${search.toString()}`
}

export function buildCmsPreviewQuerySuffix(searchParams: {
  key?: string
  ver?: string
  loc?: string
  ctx?: string
}) {
  const previewQuery = new URLSearchParams()
  if (searchParams.key) previewQuery.set('key', searchParams.key)
  if (searchParams.ver) previewQuery.set('ver', searchParams.ver)
  if (searchParams.loc) previewQuery.set('loc', searchParams.loc)
  if (searchParams.ctx) previewQuery.set('ctx', searchParams.ctx)
  const qs = previewQuery.toString()
  return qs ? `?${qs}` : ''
}

/** Routable path (no query) for CMS pages so Stores/context can resolve the iframe URL. */
export function buildPublishedPreviewPath(
  locale: string,
  content: {
    _metadata?: {
      url?: {
        default?: string | null
        hierarchical?: string | null
      } | null
    } | null
  }
): string {
  const defaultUrl = content?._metadata?.url?.default?.trim() ?? ''
  const normalized = defaultUrl.replace(/^\/+|\/+$/g, '')

  if (normalized === 'home' || normalized === '') {
    return `/${locale}`
  }

  if (normalized) {
    return `/${locale}/${normalized}`
  }

  const hierarchicalUrl = content?._metadata?.url?.hierarchical
    ?.replace(process.env.OPTIMIZELY_START_PAGE_URL ?? '', '')
    ?.replace(`/${locale}/`, '')
    ?.replace(/^\/+|\/+$/g, '')

  return hierarchicalUrl ? `/${locale}/${hierarchicalUrl}` : `/${locale}`
}
