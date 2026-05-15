import { richTextToPlainLines } from '@/components/block/product-details/map-cms'
import type { StepsSectionBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import styles from '@/styles/components/steps-section-block.module.scss'

export type StepsSectionItem = {
  description: string
}

export type StepsSectionBlockProps = {
  title?: string
  items?: StepsSectionItem[]
  desktopColumns?: 2 | 3 | 4
  backgroundColor?: string
}

const DEFAULT_ITEMS: StepsSectionItem[] = [
  { description: 'Visit any Krungthai Bank branch to begin your application.' },
  { description: 'Present your Thai ID or Passport and your KTB Bank Passbook.' },
  { description: 'Receive and activate your new debit card instantly on-site.' },
]

/** Presentational block (Storybook / sample preview). CMS pages use the default export. */
export function StepsSectionView({
  title = 'Debit Card Application Process',
  items = DEFAULT_ITEMS,
  desktopColumns = 3,
  backgroundColor = 'var(--bg-bg-1, #e6f4fa)',
}: StepsSectionBlockProps) {
  return (
    <section className={styles.stepsSection} style={{ backgroundColor }} aria-labelledby="steps-section-title">
      <div className={`${styles.inner} container mx-auto`}>
        <h2 id="steps-section-title" className={styles.title}>
          {title}
        </h2>

        <div className={styles.grid} data-columns={desktopColumns}>
          {items.map((item, index) => (
            <article key={`${index}-${item.description}`} className={styles.card}>
              <div className={styles.stepNumber} aria-hidden>
                <span>{index + 1}</span>
              </div>
              <p className={styles.description}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- CMS (Optimizely) -------------------------------------------------------

type StepsSectionBlockCmsProps = Omit<StepsSectionBlockFragmentFragment, '__typename'> & {
  /** Populated after `Items` exists on `StepsSectionBlock` in the schema + GraphQL fragment. */
  Items?: ReadonlyArray<
    | {
        __typename?: string
        stepDescription?: { __typename?: string; html?: string | null } | null
      }
    | null
  > | null
  /** Populated after `DesktopColumns` exists on `StepsSectionBlock` in the schema + GraphQL fragment. */
  DesktopColumns?: number | string | null
}

function desktopColumnsFromCms(value: number | string | null | undefined): 2 | 3 | 4 {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : parseInt(String(value ?? ''), 10)
  if (n === 2 || n === 3 || n === 4) return n
  return 3
}

function mapCmsItems(rows: StepsSectionBlockCmsProps['Items'] | undefined): StepsSectionItem[] {
  if (!rows?.length) return []
  const out: StepsSectionItem[] = []
  for (const raw of rows) {
    if (!raw || raw.__typename !== 'StepsSectionItemBlock') continue
    const html = raw.stepDescription?.html?.trim()
    const lines = html ? richTextToPlainLines(html) : undefined
    const description = lines?.length ? lines.join(' ') : ''
    if (!description) continue
    out.push({ description })
  }
  return out
}

/** Optimizely `StepsSectionBlock` from page queries. */
export default function StepsSectionBlock(props: StepsSectionBlockCmsProps) {
  const mapped = mapCmsItems(props.Items)
  const items = mapped.length ? mapped : DEFAULT_ITEMS

  if (
    process.env.NODE_ENV === 'development' &&
    props.Items &&
    props.Items.length > 0 &&
    !mapped.length
  ) {
    console.warn(
      '[StepsSectionBlock] CMS Items were returned but none mapped to steps — check `StepsSectionItemBlock` rows and Description (rich text).'
    )
  }

  return (
    <StepsSectionView
      title={props.Title?.trim() || undefined}
      items={items}
      desktopColumns={desktopColumnsFromCms(props.DesktopColumns)}
      backgroundColor={props.BackgroundColor?.trim() || undefined}
    />
  )
}
