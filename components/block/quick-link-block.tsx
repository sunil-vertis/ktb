import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import type { QuickLinkBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import styles from '@/styles/components/quick-link-block.module.scss'

export type QuickLinkItem = {
  label: string
  href: string
  iconSrc: string
  /** If set, mobile shows two lines (e.g. ["Student", "Loans"]) per Figma. Desktop always uses `label`. */
  mobileLabelLines?: [string, string]
}

export type QuickLinkBlockProps = {
  sectionTitle?: string
  sectionSubtitle?: string
  items?: QuickLinkItem[]
}

const DEFAULT_ITEMS: QuickLinkItem[] = [
  {
    label: 'State Welfare & Benefits',
    href: '#',
    iconSrc: '/assets/icons/benefits.png',
  },
  {
    label: 'Student Loans',
    href: '#',
    iconSrc: '/assets/icons/loans.png',
    mobileLabelLines: ['Student', 'Loans'],
  },
  {
    label: 'Government Bonds',
    href: '#',
    iconSrc: '/assets/icons/bonds.png',
  },
  {
    label: 'Public Payments & Taxes',
    href: '#',
    iconSrc: '/assets/icons/taxes.png',
  },
]

/** Presentational quick links (preview / Storybook). CMS pages use the default export. */
export function QuickLinkBlockFE({
  sectionTitle = "Supporting Every Citizen's Journey",
  sectionSubtitle = 'Fast, digital access to state financial portals.',
  items = DEFAULT_ITEMS,
}: QuickLinkBlockProps) {
  return (
    <section className={styles.quickLink} aria-labelledby="quick-link-heading">
      <div className={cn(styles.inner, 'container mx-auto')}>
        <header className={styles.header}>
          <h2 id="quick-link-heading" className={styles.sectionTitle}>
            {sectionTitle}
          </h2>
          {sectionSubtitle ? (
            <p className={cn('type-body-base-regular', styles.subtitle)}>{sectionSubtitle}</p>
          ) : null}
        </header>

        <ul className={styles.grid}>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className={styles.item}>
              <Link href={item.href} className={styles.link}>
                <span className={styles.iconWrap}>
                  <Image
                    src={item.iconSrc}
                    alt=""
                    width={80}
                    height={80}
                    className={styles.icon}
                  />
                </span>
                <span className={cn('type-heading-h4', styles.label)}>
                  <span className={styles.labelDesktop}>{item.label}</span>
                  {item.mobileLabelLines ? (
                    <span className={styles.labelMobileSplit}>
                      <span className={styles.labelMobileLine}>
                        {item.mobileLabelLines[0]}
                      </span>
                      <span className={styles.labelMobileLine}>
                        {item.mobileLabelLines[1]}
                      </span>
                    </span>
                  ) : (
                    <span className={styles.labelMobileSingle}>{item.label}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// --- CMS (Optimizely) → presentational --------------------------------------

type QuickLinkBlockCmsProps = Omit<QuickLinkBlockFragmentFragment, '__typename'>

type QuickLinkItemRow = Extract<
  NonNullable<NonNullable<QuickLinkBlockFragmentFragment['items']>[number]>,
  { __typename: 'QuickLinkItem' }
>

function firstUrl(
  url:
    | {
        default?: string | null
        internal?: string | null
        hierarchical?: string | null
        base?: string | null
      }
    | null
    | undefined
): string {
  return (
    url?.default?.trim() ||
    url?.internal?.trim() ||
    url?.hierarchical?.trim() ||
    url?.base?.trim() ||
    ''
  )
}

function iconSrcFromCms(icon: QuickLinkItemRow['icon']): string | undefined {
  if (!icon) return undefined
  if (icon.__typename === 'ImageMedia' || icon.__typename === 'GenericMedia') {
    const u = icon._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

function mapCmsItems(
  rows: QuickLinkBlockCmsProps['items'] | undefined
): QuickLinkItem[] {
  if (!rows?.length) return []
  const out: QuickLinkItem[] = []
  for (const raw of rows) {
    if (raw?.__typename !== 'QuickLinkItem') continue
    const row = raw
    const href = firstUrl(row.quickLinkLink?.url ?? undefined)
    if (!href) continue
    const label =
      row.label?.trim() ||
      row.quickLinkLink?.text?.trim() ||
      href ||
      `Link ${out.length + 1}`
    const iconSrc = iconSrcFromCms(row.icon) ?? '/placeholder.svg'
    const l1 = row.mobileLabelLine1?.trim()
    const l2 = row.mobileLabelLine2?.trim()
    const mobileLabelLines =
      l1 && l2 ? ([l1, l2] as [string, string]) : undefined
    out.push({ label, href, iconSrc, mobileLabelLines })
  }
  return out
}

/** Optimizely `QuickLinkBlock` from page queries → {@link QuickLinkBlockFE}. */
export default function QuickLinkBlock(props: QuickLinkBlockCmsProps) {
  const { sectionTitle, sectionSubtitle, items: rawItems } = props

  if (rawItems == null) {
    return (
      <QuickLinkBlockFE
        sectionTitle={sectionTitle ?? undefined}
        sectionSubtitle={sectionSubtitle ?? undefined}
      />
    )
  }

  return (
    <QuickLinkBlockFE
      sectionTitle={sectionTitle ?? undefined}
      sectionSubtitle={sectionSubtitle ?? undefined}
      items={mapCmsItems(rawItems)}
    />
  )
}
