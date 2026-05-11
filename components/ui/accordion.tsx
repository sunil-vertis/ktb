'use client'

import * as React from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { GlobalIcon } from '@/components/ui/global-icon'

type AccordionItem = {
  id: string
  title: React.ReactNode
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpenIds?: string[]
  className?: string
  itemClassName?: string
  questionClassName?: string
  answerClassName?: string
  icon?: React.ReactNode | string
  iconAlt?: string
}

export function Accordion({
  items,
  defaultOpenIds = [],
  className,
  itemClassName,
  questionClassName,
  answerClassName,
  icon,
  iconAlt = 'accordion icon',
}: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(
    defaultOpenIds[0] ?? null
  )

  return (
    <div className={clsx('accordion', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id

        const iconNode =
          typeof icon === 'string' ? (
            <Image src={icon} alt={iconAlt} width={24} height={24} />
          ) : (
            icon ?? <GlobalIcon type="chevron-down" size="L" />
          )

        return (
          <div
            key={item.id}
            className={clsx('accordion__item', isOpen && 'is-open', itemClassName)}
          >
            <button
              type="button"
              className={clsx('accordion__summary', questionClassName)}
              onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-trigger-${item.id}`}
            >
              <span className="accordion__title">{item.title}</span>
              <span className="accordion__icon" aria-hidden>
                {iconNode}
              </span>
            </button>
            <div
              className="accordion__panel"
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
            >
              <div className={clsx('accordion__content', answerClassName)}>
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

