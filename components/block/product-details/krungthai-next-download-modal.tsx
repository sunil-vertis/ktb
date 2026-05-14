'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'

export type KrungthaiNextDownloadModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description: string
  /** Public path under `/public`, e.g. `/assets/.../krungthai-next-modal-hero.png` */
  imageSrc: string
  imageAlt: string
  imageWidth?: number
  imageHeight?: number
}

export function KrungthaiNextDownloadModal({
  open,
  onClose,
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth = 200,
  imageHeight = 200,
}: KrungthaiNextDownloadModalProps) {
  const headingId = React.useId()
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    queueMicrotask(() => {
      closeRef.current?.focus()
    })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div
      className="krungthai-next-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <button
        type="button"
        className="krungthai-next-modal__backdrop"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="krungthai-next-modal__panel">
        <button
          ref={closeRef}
          type="button"
          className="krungthai-next-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="krungthai-next-modal__close-icon" strokeWidth={2} aria-hidden />
        </button>
        <div className="krungthai-next-modal__content">
          <div className="krungthai-next-modal__figure">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="krungthai-next-modal__image"
              unoptimized
            />
          </div>
          <div className="krungthai-next-modal__copy">
            <h2 id={headingId} className="krungthai-next-modal__title type-heading-h3">
              {title}
            </h2>
            <p className="krungthai-next-modal__body type-body-base-regular">{description}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
