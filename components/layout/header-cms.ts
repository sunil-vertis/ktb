import type { SiteHeaderBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import { linkToAbsoluteUrl } from '@/components/block/product-details/map-cms'
import { optimizely } from '@/lib/optimizely/fetch'
import { getValidLocale } from '@/lib/optimizely/utils/language'

/** One link row (utility, mega link, mobile persona). */
export type HeaderNavLink = {
  label: string
  href: string
  openInNewTab?: boolean
  isActive?: boolean
}

export type HeaderMegaSide = {
  title: string
  columns: Array<Array<{ label: string; href: string; openInNewTab?: boolean }>>
}

export type HeaderMainNavItem = {
  label: string
  href: string
  openInNewTab?: boolean
  menu?: {
    left: HeaderMegaSide
    right?: HeaderMegaSide
  }
}

export type HeaderCmsContent = {
  utilityLeft: HeaderNavLink[]
  utilityRight: HeaderNavLink[]
  mobilePersonaSummary: string
  mobilePersonaLinks: HeaderNavLink[]
  logoSrc: string
  logoAlt: string
  homeHref: string
  mainNav: HeaderMainNavItem[]
}

function hrefFromLink(
  link:
    | {
        url?: {
          default?: string | null
          base?: string | null
          hierarchical?: string | null
          internal?: string | null
        } | null
      }
    | null
    | undefined
): string | undefined {
  return linkToAbsoluteUrl(link as Parameters<typeof linkToAbsoluteUrl>[0])
}

function linkOpensInNewTab(
  link:
    | {
        target?: string | null
        url?: {
          default?: string | null
          base?: string | null
          hierarchical?: string | null
          internal?: string | null
        } | null
      }
    | null
    | undefined
): boolean {
  if (!link) return false
  const t = link.target?.trim().toLowerCase()
  if (t === '_blank') return true
  const href = hrefFromLink(link)
  return !!href && /^https?:\/\//i.test(href)
}

function mapHeaderLinkBlock(
  row:
    | {
        __typename?: string
        Label?: string | null
        OpenInNewTab?: boolean | null
        IsActive?: boolean | null
        Url?: Parameters<typeof linkToAbsoluteUrl>[0] | null
      }
    | null
    | undefined
): HeaderNavLink | null {
  if (!row || row.__typename !== 'HeaderLinkBlock') return null
  const label = row.Label?.trim() ?? ''
  const href = hrefFromLink(row.Url ?? undefined) ?? '#'
  if (!label) return null
  return {
    label,
    href,
    openInNewTab: row.OpenInNewTab ?? undefined,
    isActive: row.IsActive ?? undefined,
  }
}

function mapMegaSide(
  side:
    | { __typename?: string; Title?: string | null; Columns?: unknown }
    | null
    | undefined
): HeaderMegaSide | null {
  if (!side || side.__typename !== 'HeaderMegaSideBlock') return null
  const title = side.Title?.trim() ?? ''
  const columnsRaw = side.Columns
  if (!Array.isArray(columnsRaw)) return null

  const columns: Array<Array<{ label: string; href: string }>> = []
  for (const col of columnsRaw) {
    if (!col || (col as { __typename?: string }).__typename !== 'HeaderMegaColumnBlock')
      continue
    const linksRaw = (col as { Links?: unknown }).Links
    if (!Array.isArray(linksRaw)) continue
    const cells: Array<{ label: string; href: string }> = []
    for (const linkRow of linksRaw) {
      const mapped = mapHeaderLinkBlock(
        linkRow as Parameters<typeof mapHeaderLinkBlock>[0]
      )
      if (mapped) {
        cells.push({
          label: mapped.label,
          href: mapped.href,
          ...(mapped.openInNewTab ? { openInNewTab: true } : {}),
        })
      }
    }
    if (cells.length) columns.push(cells)
  }
  if (!title && columns.length === 0) return null
  return { title: title || '\u00a0', columns }
}

function firstMegaSide(
  area: ReadonlyArray<unknown> | null | undefined
): HeaderMegaSide | null {
  if (!area?.length) return null
  const first = area[0]
  return mapMegaSide(first as Parameters<typeof mapMegaSide>[0])
}

function mapMainNavItem(
  item:
    | {
        __typename?: string
        Label?: string | null
        TopLevelUrl?: Parameters<typeof linkToAbsoluteUrl>[0] | null
        MegaLeft?: unknown
        MegaRight?: unknown
      }
    | null
    | undefined
): HeaderMainNavItem | null {
  if (!item || item.__typename !== 'HeaderMainNavItemBlock') return null
  const label = item.Label?.trim() ?? ''
  if (!label) return null

  const topHref = hrefFromLink(item.TopLevelUrl ?? undefined)
  const topOpenInNewTab = linkOpensInNewTab(item.TopLevelUrl ?? undefined)
  const megaL = firstMegaSide(item.MegaLeft as ReadonlyArray<unknown> | null)
  const megaR = firstMegaSide(item.MegaRight as ReadonlyArray<unknown> | null)

  if (megaL) {
    return {
      label,
      href: topHref ?? '#',
      menu: {
        left: megaL,
        ...(megaR ? { right: megaR } : {}),
      },
    }
  }

  return {
    label,
    href: topHref ?? '#',
    ...(topOpenInNewTab ? { openInNewTab: true } : {}),
  }
}

function logoUrlFromSiteHeader(
  logo: SiteHeaderBlockFragmentFragment['Logo']
): string | undefined {
  if (!logo) return undefined
  if (logo.__typename === 'ImageMedia' || logo.__typename === 'GenericMedia') {
    const u = logo._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

export function mapSiteHeaderFragment(
  item: SiteHeaderBlockFragmentFragment | null | undefined
): HeaderCmsContent | null {
  if (!item) return null

  const utilityLeft =
    item.UtilityLeft?.map((x) => mapHeaderLinkBlock(x as never)).filter(
      (x): x is HeaderNavLink => x != null
    ) ?? []
  const utilityRight =
    item.UtilityRight?.map((x) => mapHeaderLinkBlock(x as never)).filter(
      (x): x is HeaderNavLink => x != null
    ) ?? []
  const mobilePersonaLinks =
    item.MobilePersonaLinks?.map((x) => mapHeaderLinkBlock(x as never)).filter(
      (x): x is HeaderNavLink => x != null
    ) ?? []

  const mainNav =
    item.MainNavigation?.map((x) => mapMainNavItem(x as never)).filter(
      (x): x is HeaderMainNavItem => x != null
    ) ?? []

  const logoSrc = logoUrlFromSiteHeader(item.Logo) ?? '/assets/logo/sitelogo.png'
  const logoAlt = item.LogoAlt?.trim() || 'Krungthai logo'
  const homeHref = hrefFromLink(item.HomeUrl ?? undefined) ?? '/'

  return {
    utilityLeft,
    utilityRight,
    mobilePersonaSummary: item.MobilePersonaSummary?.trim() || 'Individual',
    mobilePersonaLinks,
    logoSrc,
    logoAlt,
    homeHref,
    mainNav,
  }
}

export async function fetchSiteHeaderCms(
  locale: string
): Promise<HeaderCmsContent | null> {
  try {
    const { data, errors } = await optimizely.getSiteHeader(
      { locales: [getValidLocale(locale)] },
      { cacheTag: 'optimizely-header' }
    )
    if (errors?.length) {
      console.error('[getSiteHeader]', errors)
    }
    const raw = data?.SiteHeaderBlock?.item
    return mapSiteHeaderFragment(raw ?? undefined)
  } catch (e) {
    console.error('[fetchSiteHeaderCms]', e)
    return null
  }
}
