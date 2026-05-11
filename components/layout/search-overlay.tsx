'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp, X } from 'lucide-react'
import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import {
  POPULAR_SEARCH_TERMS,
  rankSearchMatches,
} from '@/lib/data/site-search-corpus'

import styles from '@/styles/components/search-overlay.module.scss'

const RECENT_STORAGE_KEY = 'ktb-search-recent'
const MAX_RECENT = 5

const PLACEHOLDER_DESKTOP = 'Explore products, services, or seek help'
const PLACEHOLDER_MOBILE = 'Explore products, services, or …'

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightQueryParts(text: string, query: string, matchClass: string) {
  const raw = query.trim()
  if (!raw) return text
  const words = [...new Set(raw.toLowerCase().split(/\s+/).filter(Boolean))].sort(
    (a, b) => b.length - a.length
  )
  if (words.length === 0) return text
  const pattern = words.map(escapeRegExp).join('|')
  const re = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(re)
  return (
    <>
      {parts.map((part, i) => {
        if (part === '') return null
        const isHit = words.some((w) => part.toLowerCase() === w)
        return isHit ? (
          <strong key={i} className={matchClass}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </>
  )
}

function readRecent(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((x): x is string => typeof x === 'string')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

function writeRecent(terms: string[]) {
  try {
    window.localStorage.setItem(
      RECENT_STORAGE_KEY,
      JSON.stringify(terms.slice(0, MAX_RECENT))
    )
  } catch {
    /* ignore quota */
  }
}

function useMinWidthLg() {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(min-width: 1024px)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: 1024px)`)
    const sync = () => setMatches(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return matches
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12.75 12.75L16.5 16.5M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type SearchOverlayProps = {
  open: boolean
  onClose: () => void
  locale: string
}

export function SearchOverlay({ open, onClose, locale }: SearchOverlayProps) {
  const router = useRouter()
  const dialogLabelId = useId()
  const inputId = useId()
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const isLg = useMinWidthLg()
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<string[]>([])

  const queryTrimmed = query.trim()
  const liveMatches = useMemo(
    () => (queryTrimmed ? rankSearchMatches(queryTrimmed, 24) : []),
    [queryTrimmed]
  )

  const refreshRecent = useCallback(() => {
    setRecent(readRecent())
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    refreshRecent()
    setQuery('')
    const t = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(t)
  }, [open, refreshRecent])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const pushRecent = useCallback((term: string) => {
    const t = term.trim()
    if (!t) return
    const next = [t, ...readRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(
      0,
      MAX_RECENT
    )
    writeRecent(next)
    setRecent(next)
  }, [])

  const handlePick = useCallback(
    (term: string) => {
      const t = term.trim()
      if (!t) return
      pushRecent(t)
      onClose()
      const qs = new URLSearchParams({ q: t }).toString()
      router.push(`/${locale}/search?${qs}`)
    },
    [locale, onClose, pushRecent, router]
  )

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      handlePick(queryTrimmed)
    },
    [handlePick, queryTrimmed]
  )

  const placeholder = isLg ? PLACEHOLDER_DESKTOP : PLACEHOLDER_MOBILE

  if (!mounted || !open) return null

  const node = (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        className={styles.shell}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogLabelId}
      >
        <div className={styles.mobileNav}>
          <Link
            href={`/${locale}`}
            className={styles.mobileNavBrand}
            onClick={onClose}
          >
            <Image
              src="/assets/logo/sitelogo.png"
              alt="Krungthai logo"
              width={144}
              height={60}
              className={styles.logoMobile}
              priority
            />
          </Link>
          <span className={styles.mobileNavSpacer} aria-hidden />
          <div className={styles.mobileNavIcons}>
            <span className={styles.iconTap} aria-hidden>
              <SearchGlyph />
            </span>
            <button
              type="button"
              className={styles.iconTap}
              aria-label="Close search"
              onClick={onClose}
            >
              <X size={32} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.desktopTop}>
            <div className={styles.logoBlock}>
              <Link href={`/${locale}`} onClick={onClose}>
                <Image
                  src="/assets/logo/sitelogo.png"
                  alt="Krungthai logo"
                  width={156}
                  height={60}
                  className={styles.logoDesktop}
                  priority
                />
              </Link>
            </div>
            <button type="button" className={styles.closeLink} onClick={onClose}>
              Close
              <X size={16} strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <p id={dialogLabelId} className={styles.visuallyHidden}>
            Search the site
          </p>

          <div className={styles.inner}>
            <form className={styles.searchRow} onSubmit={handleSubmit}>
              <label htmlFor={inputId} className={styles.visuallyHidden}>
                Search
              </label>
              <div className={styles.searchInputWrap}>
                <span className={styles.searchIcon} aria-hidden>
                  <SearchGlyph />
                </span>
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  name="q"
                  inputMode="search"
                  enterKeyHint="search"
                  value={query}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-autocomplete="list"
                  aria-controls={queryTrimmed ? listboxId : undefined}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className={styles.input}
                />
              </div>
            </form>

            {queryTrimmed ? (
              <div className={styles.liveResults} aria-live="polite">
                <p className={styles.liveHeading}>Suggestions</p>
                {liveMatches.length === 0 ? (
                  <p className={styles.sectionLabel}>No matching results</p>
                ) : (
                  <ul id={listboxId} className={styles.list} aria-label="Search suggestions">
                    {liveMatches.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          className={styles.listButton}
                          onClick={() => handlePick(term)}
                        >
                          <span className={styles.listIcon} aria-hidden>
                            <SearchGlyph />
                          </span>
                          <span>
                            {highlightQueryParts(term, queryTrimmed, styles.match)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className={styles.body}>
                {recent.length > 0 ? (
                  <section className={styles.column} aria-label="Recent searches">
                    <p className={styles.sectionLabel}>Recent Searches</p>
                    <ul className={styles.list}>
                      {recent.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            className={styles.listButton}
                            onClick={() => handlePick(term)}
                          >
                            <span className={styles.listIcon} aria-hidden>
                              <SearchGlyph />
                            </span>
                            <span>{term}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {recent.length > 0 ? <div className={styles.dividerVertical} aria-hidden /> : null}
                {recent.length > 0 ? <div className={styles.columnSpacer} aria-hidden /> : null}
                {recent.length > 0 ? <div className={styles.dividerHorizontal} aria-hidden /> : null}

                <section className={styles.column} aria-label="Popular searches">
                  <p className={styles.sectionLabel}>Popular Searches</p>
                  <ul className={styles.list}>
                    {POPULAR_SEARCH_TERMS.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          className={styles.listButton}
                          onClick={() => handlePick(term)}
                        >
                          <span className={styles.listIcon} aria-hidden>
                            <TrendingUp strokeWidth={1.5} aria-hidden />
                          </span>
                          <span>{term}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
