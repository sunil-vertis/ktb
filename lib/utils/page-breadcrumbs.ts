import type { BreadcrumbItem } from '@/components/ui/breadcrumb'

const HOME_LABEL: Record<string, string> = {
  en: 'Home',
  th: 'หน้าหลัก',
  pl: 'Home',
  sv: 'Hem',
}

function homeLabel(locale: string): string {
  return HOME_LABEL[locale.toLowerCase()] ?? HOME_LABEL.en
}

/** Normalize CMS or route path to a pathname starting with `/`. */
function normalizePath(url: string | null | undefined): string {
  if (!url?.trim()) return ''
  const u = url.trim()
  try {
    if (u.startsWith('http://') || u.startsWith('https://')) {
      const p = new URL(u).pathname
      return p.startsWith('/') ? p : `/${p}`
    }
  } catch {
    /* ignore */
  }
  return u.startsWith('/') ? u : `/${u}`
}

function formatSegmentLabel(segment: string): string {
  const s = decodeURIComponent(segment).replace(/-/g, ' ')
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Builds breadcrumb items from the CMS page’s published URL and title.
 * Intermediate labels are derived from URL path segments; the current page uses `pageTitle` from CMS.
 * Returns `null` when there is no path beyond the locale (e.g. site home).
 */
export function buildCmsPageBreadcrumbItems(options: {
  locale: string
  pageTitle: string | null | undefined
  /** Prefer `_metadata.url.default`, then hierarchical, from CMSPage. */
  publishedPath: string | null | undefined
  /** Fallback when metadata path is missing (e.g. route slug `/${slug}`). */
  routePath?: string | null
}): BreadcrumbItem[] | null {
  const locale = options.locale.toLowerCase()
  const pathRaw =
    options.publishedPath?.trim() ||
    options.routePath?.trim() ||
    ''
  const path = normalizePath(pathRaw)
  let segments = path.split('/').filter(Boolean)
  if (segments[0]?.toLowerCase() === locale) {
    segments = segments.slice(1)
  }

  if (segments.length === 0) {
    return null
  }

  const homeHref = `/${locale}`
  const items: BreadcrumbItem[] = [{ label: homeLabel(locale), href: homeHref }]

  const title =
    options.pageTitle?.trim() ||
    formatSegmentLabel(segments[segments.length - 1] ?? 'Page')

  if (segments.length === 1) {
    items.push({ label: title, href: undefined })
    return items
  }

  let acc = ''
  for (let i = 0; i < segments.length - 1; i++) {
    acc += `/${segments[i]}`
    items.push({
      label: formatSegmentLabel(segments[i]),
      href: `${homeHref}${acc}`,
    })
  }
  items.push({ label: title, href: undefined })
  return items
}
