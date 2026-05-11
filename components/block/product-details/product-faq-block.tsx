'use client'

import * as React from 'react'
import clsx from 'clsx'

import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { GlobalIcon } from '@/components/ui/global-icon'

import type { ProductFaqBlockFragmentFragment } from '@/lib/optimizely/types/generated'

export type ProductFaqItem = {
  id: string
  question: string
  answer?: React.ReactNode
}

export type ProductFaqBlockProps = {
  title?: string
  items?: ProductFaqItem[]
  className?: string
  sectionId?: string
  showMoreLabel?: string
  initiallyVisibleCount?: number
  defaultOpenId?: string
}

const DEFAULT_ITEMS: ProductFaqItem[] = [
  {
    id: 'faq-1',
    question:
      'Through which channels can I apply for a Krungthai Thanawat personal loan?',
    answer: (
      <>
        <p>
          You can apply through Krungthai Bank branches, approved sales channels,
          and digital channels provided by the bank.
        </p>
        <p>
          Please prepare your identification documents and income evidence before
          starting the application.
        </p>
      </>
    ),
  },
  {
    id: 'faq-2',
    question: 'What is Krungthai Thanawat Loan?',
    answer: (
      <>
        <p>
          Krungthai Thanawat is a personal loan product for salaried customers
          who receive income through eligible channels with the bank.
        </p>
        <p>
          The product offers a revolving credit facility with terms, interest,
          and approval criteria based on current bank policy.
        </p>
      </>
    ),
  },
  {
    id: 'faq-3',
    question: 'Who is eligible to apply for a Krungthai Thanawat loan?',
    answer: (
      <>
        <p>
          Eligibility generally covers government employees, state enterprise
          employees, and private-sector employees who meet the bank&apos;s income and
          credit criteria.
        </p>
        <p>
          Final approval depends on document completeness, credit assessment, and
          applicable product conditions at the time of application.
        </p>
      </>
    ),
  },
  {
    id: 'faq-4',
    question:
      'What is the maximum loan amount offered by Krungthai Thanawat Personal Loan?',
    answer: (
      <>
        <p>
          Organizations that have an MOU with the bank will be able to get loan
          amounts up to 15 times their monthly salary.
        </p>
        <ul>
          <li>
            Organizations that do not have a Memorandum of Understanding (MOU)
            with the bank can receive loan amounts up to 5 times their monthly
            salary.
          </li>
          <li>
            The maximum loan amount depends on the type of organization and the
            MOU they have with the bank.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'faq-5',
    question:
      'Through which channels can I apply for a Krungthai Thanawat personal loan?',
    answer: (
      <>
        <p>
          Application channels include bank branches and designated digital
          channels. Availability may vary by customer segment and campaign period.
        </p>
        <p>
          Contact your nearest Krungthai Bank branch for the latest channel
          details and required documents.
        </p>
      </>
    ),
  },
  {
    id: 'faq-6',
    question: 'How long does loan approval usually take?',
    answer: (
      <>
        <p>
          Approval time depends on the completeness of submitted documents and
          the result of credit checks.
        </p>
        <p>
          In many cases, applications can be processed quickly once all required
          information is provided, but timing may vary by case.
        </p>
      </>
    ),
  },
]

export function ProductFaqBlockFE({
  title = 'Frequently Asked Questions',
  items = DEFAULT_ITEMS,
  className,
  sectionId,
  showMoreLabel = 'Show more questions',
  initiallyVisibleCount = 5,
  defaultOpenId,
}: ProductFaqBlockProps) {
  const [showAll, setShowAll] = React.useState(false)
  const visibleItems = showAll ? items : items.slice(0, initiallyVisibleCount)
  const openId =
    defaultOpenId ?? (visibleItems.find((item) => item.id === 'faq-1')?.id ?? visibleItems[0]?.id)

  const accordionItems = visibleItems.map((item) => ({
    id: item.id,
    title: item.question,
    content: item.answer ?? null,
  }))

  return (
    <section
      id={sectionId}
      className={clsx('product-faq', className)}
      aria-label="Frequently asked questions"
    >
      <h2 className="product-faq__title type-heading-h3">{title}</h2>

      <Accordion
        items={accordionItems}
        defaultOpenIds={openId ? [openId] : []}
        className="product-faq__list"
        itemClassName="product-faq__item"
        questionClassName="product-faq__question type-body-base-medium"
        answerClassName="product-faq__answer type-body-base-regular"
        icon={<GlobalIcon type="chevron-down" size="L" />}
      />

      {!showAll && items.length > initiallyVisibleCount ? (
        <div className="product-faq__action">
          <Button
            hierarchy="secondary"
            size="lg"
            className="product-faq__show-more-btn"
            onClick={() => setShowAll(true)}
          >
            {showMoreLabel}
          </Button>
        </div>
      ) : null}
    </section>
  )
}

type CmsProductFaqProps = Omit<ProductFaqBlockFragmentFragment, '__typename'>

export default function ProductFaqBlock(props: CmsProductFaqProps) {
  const items: ProductFaqItem[] = []
  props.Items?.forEach((it, index) => {
    if (!it || it.__typename !== 'ProductFaqItemBlock') return
    const question = it.Question?.trim() ?? ''
    const html = it.Answer?.html?.trim()
    if (!question && !html) return
    const answer: React.ReactNode = html ? (
      <div
        className="product-faq__answer-cms"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    ) : undefined
    items.push({
      id: it.Id?.trim() || `faq-${index}`,
      question: question || '\u00a0',
      answer,
    })
  })

  return (
    <ProductFaqBlockFE
      title={props.Title ?? undefined}
      showMoreLabel={props.ShowMoreLabel ?? undefined}
      initiallyVisibleCount={props.InitiallyVisibleCount ?? undefined}
      defaultOpenId={props.DefaultOpenId ?? undefined}
      items={items.length ? items : undefined}
    />
  )
}
