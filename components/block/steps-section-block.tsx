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

export default function StepsSectionBlock({
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
