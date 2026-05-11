'use client'

import { useEffect, useMemo, useState } from 'react'
import type { BannerStripBlock as BannerStripBlockCms } from '@/lib/optimizely/types/generated'
import styles from '@/styles/components/banner-strip-block.module.scss'

export type BannerStripBlockProps = Partial<
  Pick<
    BannerStripBlockCms,
    'message' | 'isDismissible' | 'dismissStorageKey' | 'closeAriaLabel'
  >
>

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function BannerStripBlock({
  message = 'Special Promotion 2026 - Apply for a home loan before 30 June  ·  Interest rate from 2.99% p.a.',
  isDismissible = true,
  dismissStorageKey,
  closeAriaLabel = 'Close banner strip',
}: BannerStripBlockProps) {
  const storageKey = useMemo(
    () => dismissStorageKey?.trim() || 'ktb-banner-strip-dismissed',
    [dismissStorageKey]
  )
  const [isVisible, setIsVisible] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsVisible(window.sessionStorage.getItem(storageKey) !== '1')
  }, [storageKey])

  const handleDismiss = () => {
    setIsVisible(false)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(storageKey, '1')
    }
  }

  if (!isVisible) return null

  return (
    <section className={styles.bannerStrip} aria-label="Banner strip notice">
      <div className={styles.container}>
        <p className={styles.message} data-epi-edit="message">
          {message}
        </p>
        {isDismissible ? (
          <button
            type="button"
            className={styles.closeButton}
            aria-label={closeAriaLabel ?? 'Close banner strip'}
            onClick={handleDismiss}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
    </section>
  )
}
