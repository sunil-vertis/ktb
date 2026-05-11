import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

import styles from '@/styles/components/faq-section-block.module.scss'

export type FaqItem = {
  id: string
  question: string
  answer?: string
}

export type FaqSectionBlockProps = {
  title?: string
  items?: FaqItem[]
  showMoreLabel?: string
}

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do debit cards differ from credit cards?',
    answer:
      'While both debit and credit cards can be used to purchase goods and services, they differ significantly in their payment methods. Debit cards deduct funds immediately from the linked savings account, allowing you to spend only the amount available in your account, making it easier to control spending and avoid debt.\n\nCredit cards, on the other hand, utilize a pre-approved credit limit from the bank, payable in a later billing cycle. Incomplete payments may incur interest. Therefore, debit cards are suitable for those who prefer electronic cash payments, while credit cards are ideal for those seeking payment flexibility and additional benefits such as installment plans or reward points.',
  },
  {
    id: 'faq-2',
    question: 'What documents are required to apply for a debit card?',
  },
  {
    id: 'faq-3',
    question: 'How do I apply for a Krungthai Bank debit card and ATM card?',
  },
  {
    id: 'faq-4',
    question: 'Can debit cards be used to buy things online?',
  },
  {
    id: 'faq-5',
    question: 'Can debit cards be used abroad?',
  },
]

export default function FaqSectionBlock({
  title = 'Frequently Asked Questions',
  items = DEFAULT_FAQ_ITEMS,
  showMoreLabel = 'Show more questions',
}: FaqSectionBlockProps) {
  const accordionItems = items.map((item) => ({
    id: item.id,
    title: item.question,
    content: item.answer ? (
      item.answer.split('\n\n').map((paragraph) => <p key={`${item.id}-${paragraph}`}>{paragraph}</p>)
    ) : null,
  }))

  return (
    <section className={styles.faqSection} aria-labelledby="faq-section-title">
      <div className={`${styles.inner} container mx-auto`}>
        <h2 id="faq-section-title" className={styles.title}>
          {title}
        </h2>

        <Accordion
          items={accordionItems}
          defaultOpenIds={accordionItems.length > 0 ? [accordionItems[0].id] : []}
          className={styles.faqList}
          itemClassName={styles.faqItem}
          questionClassName={styles.questionRow}
          answerClassName={styles.answer}
        />

        <div className={styles.actionWrap}>
          <Button hierarchy="secondary" size="lg" className={styles.showMoreBtn}>
            {showMoreLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
