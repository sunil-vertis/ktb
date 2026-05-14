import * as React from 'react'
import clsx from 'clsx'
import Link from 'next/link'

export type BreadcrumbItem = {
  label: React.ReactNode
  /** When omitted, this crumb is the current page (styled as Figma “Level 2”). */
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  /** `aria-label` on the wrapping `<nav>` (defaults for i18n callers). */
  ariaLabel?: string
}

/**
 * Horizontal breadcrumb from KTB POC Figma (desktop + mobile use the same scale;
 * narrow viewports scroll horizontally without showing a scrollbar).
 */
export function Breadcrumb({ items, className, ariaLabel = 'Breadcrumb' }: BreadcrumbProps) {
  if (!items.length) return null

  return (
    <nav className={clsx('breadcrumb', className)} aria-label={ariaLabel}>
      <div className="breadcrumb__inner container mx-auto px-4">
        <ol className="breadcrumb__list type-body-small-regular">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const href = item.href
            const useAppRouterLink =
              typeof href === 'string' && href.startsWith('/') && !/^https?:\/\//i.test(href)

            return (
              <li key={index} className="breadcrumb__item">
                {isLast ? (
                  <span className="breadcrumb__current" aria-current="page">
                    {item.label}
                  </span>
                ) : useAppRouterLink ? (
                  <Link className="breadcrumb__link" href={href}>
                    {item.label}
                  </Link>
                ) : (
                  <a
                    className="breadcrumb__link"
                    href={typeof href === 'string' ? href : '#'}
                    {...(typeof href === 'string' && /^https?:\/\//i.test(href)
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
