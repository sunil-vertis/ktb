import Image from 'next/image'

import type { KeyFeatureBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import styles from '@/styles/components/key-feature-block.module.scss'

type FeatureItem = {
  title: string
  description: string
  logoSrc: string
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    title: 'Security You Can See',
    description:
      'Bank with confidence. Your deposits are officially protected by the DPA, ensuring your wealth is always secure.',
    logoSrc: '/assets/key-feature/security.png',
  },
  {
    title: 'Stability for Life',
    description:
      "More than just a bank, we are a national pillar. Benefit from the long-term stability of Thailand's premier state-owned institution.",
    logoSrc: '/assets/key-feature/stability.png',
  },
  {
    title: 'One NEXT Experience',
    description:
      'Manage everything via Krungthai NEXT-a single, seamless digital ecosystem for your web and mobile banking.',
    logoSrc: '/assets/key-feature/next.png',
  },
]

export type KeyFeatureBlockProps = {
  title?: string
  items?: FeatureItem[]
}

/** Presentational key features (preview / Storybook). CMS pages use the default export. */
export function KeyFeatureBlockFE({
  title = 'Banking Built on the Standard of National Trust',
  items = FEATURE_ITEMS,
}: KeyFeatureBlockProps) {
  return (
    <section className={styles.keyFeatureSection} aria-labelledby="key-feature-title">
      <div className={`${styles.inner} container mx-auto`}>
        <h2 id="key-feature-title" className={styles.title}>
          {title}
        </h2>

        <div className={styles.grid}>
          {items.map((feature) => (
            <article key={feature.title} className={styles.card}>
              <div className={styles.logoWrap} aria-hidden>
                <Image
                  src={feature.logoSrc}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 330px, 280px"
                />
              </div>

              <div className={styles.textWrap}>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- CMS (Optimizely) → presentational --------------------------------------

type KeyFeatureBlockCmsProps = Omit<KeyFeatureBlockFragmentFragment, '__typename'>

type KeyFeatureItemRow = Extract<
  NonNullable<NonNullable<KeyFeatureBlockFragmentFragment['Items']>[number]>,
  { __typename: 'KeyFeatureItemBlock' }
>

function logoSrcFromCms(logo: KeyFeatureItemRow['Logo']): string | undefined {
  if (!logo) return undefined
  if (logo.__typename === 'ImageMedia' || logo.__typename === 'GenericMedia') {
    const u = logo._assetMetadata?.url?.trim()
    return u || undefined
  }
  return undefined
}

function mapCmsItems(rows: KeyFeatureBlockCmsProps['Items'] | undefined): FeatureItem[] {
  if (!rows?.length) return []
  const out: FeatureItem[] = []
  for (const raw of rows) {
    if (raw?.__typename !== 'KeyFeatureItemBlock') continue
    const title = raw.Title?.trim()
    if (!title) continue
    const description = raw.Description?.trim() || ''
    const logoSrc = logoSrcFromCms(raw.Logo) ?? '/placeholder.svg'
    out.push({ title, description, logoSrc })
  }
  return out
}

/** Optimizely `KeyFeatureBlock` from page queries → {@link KeyFeatureBlockFE}. */
export default function KeyFeatureBlock(props: KeyFeatureBlockCmsProps) {
  const { Title, Items } = props

  if (Items == null) {
    return <KeyFeatureBlockFE title={Title ?? undefined} />
  }

  return <KeyFeatureBlockFE title={Title ?? undefined} items={mapCmsItems(Items)} />
}
