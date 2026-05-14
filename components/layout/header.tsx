'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { HeaderCmsContent, HeaderMainNavItem, HeaderMegaSide, HeaderNavLink } from '@/components/layout/header-cms'
import { SearchOverlay } from '@/components/layout/search-overlay'
import { mapPathWithoutLocale } from '@/lib/optimizely/utils/language'

function cells(labels: string[]): Array<{ label: string; href: string; openInNewTab?: boolean }> {
  return labels.map((label) => ({ label, href: '#' }))
}

const DEFAULT_UTILITY_LEFT_LABELS = ['Personal', 'SME', 'Corporate', 'Krungthai Wealth']
const DEFAULT_UTILITY_RIGHT_LABELS = [
  'Financial Partner',
  'Investor Relations',
  'NPA',
  'About Us',
]

const DEFAULT_MAIN_NAV: HeaderMainNavItem[] = [
  {
    label: 'Deposit',
    href: '#',
    menu: {
      left: {
        title: 'Products',
        columns: [
          cells([
            'Current account deposit',
            'Savings deposit',
            'Fixed deposit',
            'Tax-free deposits',
          ]),
          cells([
            'Foreign currency deposits',
            'Krungthai NEXT online deposit',
            'Paometang savings account',
          ]),
        ],
      },
      right: {
        title: 'Services',
        columns: [cells(['Krungthai payroll solution'])],
      },
    },
  },
  { label: 'Card', href: '#' },
  { label: 'Loan', href: '#' },
  { label: 'Insurance', href: '#' },
  {
    label: 'Investment',
    href: '#',
    menu: {
      left: {
        title: 'Products',
        columns: [
          cells([
            'Krungthai PromptPay',
            'Transfer money',
            'Accept payments',
            'Currency and foreign exchange',
          ]),
          cells(['Currency and foreign exchange', 'Financial guidance for studying abroad']),
        ],
      },
    },
  },
  { label: 'Services', href: '#' },
  { label: 'E-Banking', href: '#' },
]

function defaultNavLinks(labels: string[], activeFirstLeft: boolean): HeaderNavLink[] {
  return labels.map((label, i) => ({
    label,
    href: '#',
    ...(activeFirstLeft && i === 0 ? { isActive: true } : {}),
  }))
}

const DEFAULT_HEADER_CONTENT: HeaderCmsContent = {
  utilityLeft: defaultNavLinks(DEFAULT_UTILITY_LEFT_LABELS, true),
  utilityRight: defaultNavLinks(DEFAULT_UTILITY_RIGHT_LABELS, false),
  mobilePersonaSummary: 'Individual',
  mobilePersonaLinks: defaultNavLinks(
    ['SME', 'Corporate', 'Krungthai Wealth', ...DEFAULT_UTILITY_RIGHT_LABELS],
    false
  ),
  logoSrc: '/assets/logo/sitelogo.png',
  logoAlt: 'Krungthai logo',
  homeHref: '/',
  mainNav: DEFAULT_MAIN_NAV,
}

function mergeHeaderContent(cms: HeaderCmsContent | null | undefined): HeaderCmsContent {
  if (!cms) return DEFAULT_HEADER_CONTENT

  return {
    ...cms,
    utilityLeft: cms.utilityLeft.length ? cms.utilityLeft : DEFAULT_HEADER_CONTENT.utilityLeft,
    utilityRight: cms.utilityRight.length ? cms.utilityRight : DEFAULT_HEADER_CONTENT.utilityRight,
    mobilePersonaLinks: cms.mobilePersonaLinks.length
      ? cms.mobilePersonaLinks
      : DEFAULT_HEADER_CONTENT.mobilePersonaLinks,
    mainNav: cms.mainNav.length ? cms.mainNav : DEFAULT_HEADER_CONTENT.mainNav,
  }
}

function renderMegaSection(side: HeaderMegaSide, panelClassName: string) {
  return (
    <section className={`site-header__mega-panel ${panelClassName}`}>
      <h3 className="site-header__mega-title">{side.title}</h3>
      <div className="site-header__mega-columns">
        {side.columns.filter((column) => column.length > 0).map((column, i) => (
          <div key={i} className="site-header__mega-column">
            <div className="site-header__mega-category-links">
              {column.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="site-header__mega-link"
                  role="menuitem"
                  {...(link.openInNewTab || link.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2.25 4.5L6 8.25L9.75 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12.75 12.75L16.5 16.5M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 5H17M3 10H17M3 15H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden
    >
      <path
        d="M18.6667 1.88L16.7867 0L9.33333 7.45333L1.88 0L0 1.88L7.45333 9.33333L0 16.7867L1.88 18.6667L9.33333 11.2133L16.7867 18.6667L18.6667 16.7867L11.2133 9.33333L18.6667 1.88Z"
        fill="white"
      />
    </svg>
  )
}

export function Header({
  locale,
  content,
}: {
  locale: string
  content?: HeaderCmsContent | null
}) {
  const data = mergeHeaderContent(content)
  const router = useRouter()
  const pathname = usePathname()
  const initialLocale = (locale || 'en').toUpperCase()
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialLocale === 'TH' ? 'TH' : 'EN'
  )
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null)
  const [mobileOpenMegaMenu, setMobileOpenMegaMenu] = useState<string | null>(null)
  const [isLargeFont, setIsLargeFont] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const desktopNavRef = useRef<HTMLElement | null>(null)
  const desktopLangRef = useRef<HTMLDetailsElement | null>(null)
  const mobileLangRef = useRef<HTMLDetailsElement | null>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!desktopNavRef.current) return
      const target = event.target as Node
      if (!desktopNavRef.current.contains(target)) {
        setOpenMegaMenu(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    const savedScale = window.localStorage.getItem('ktb-font-scale')
    const hasLargeScale = savedScale === 'large'
    setIsLargeFont(hasLargeScale)
    document.documentElement.style.setProperty(
      '--font-scale-factor',
      hasLargeScale ? '1.125' : '1'
    )
  }, [])

  const setFontScale = (large: boolean) => {
    setIsLargeFont(large)
    const scale = large ? '1.125' : '1'
    document.documentElement.style.setProperty('--font-scale-factor', scale)
    window.localStorage.setItem('ktb-font-scale', large ? 'large' : 'default')
  }

  const handleLanguageSelect = (lang: 'EN' | 'TH') => {
    setSelectedLanguage(lang)
    if (desktopLangRef.current) {
      desktopLangRef.current.open = false
    }
    if (mobileLangRef.current) {
      mobileLangRef.current.open = false
    }

    const nextLocale = lang === 'TH' ? 'th' : 'en'
    const rest = mapPathWithoutLocale(pathname ?? '')
    const nextPath = rest ? `/${nextLocale}/${rest}` : `/${nextLocale}`
    router.push(nextPath)
  }

  return (
    <header className="site-header">
      <div className="site-header__utility">
        <div className="site-header__utility-inner container mx-auto px-4">
          <div className="site-header__utility-left">
            {data.utilityLeft.map((link, i) => {
              const activeIndex = data.utilityLeft.findIndex((l) => l.isActive)
              const isActive = activeIndex >= 0 ? i === activeIndex : i === 0
              return (
                <Link
                  key={`${link.label}-${i}`}
                  href={link.href}
                  className={`site-header__utility-link${isActive ? ' is-active' : ''}`}
                  {...(link.openInNewTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
          <div className="site-header__utility-right">
            {data.utilityRight.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="site-header__utility-link"
                {...(link.openInNewTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </Link>
            ))}
            <span className="site-header__utility-separator" aria-hidden>
              |
            </span>
            <button
              type="button"
              className="site-header__icon-button"
              aria-label="Search"
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <details ref={desktopLangRef} className="site-header__lang-dropdown">
              <summary className="site-header__utility-lang">
                {selectedLanguage}
                <ChevronDownIcon />
              </summary>
              <div className="site-header__lang-menu">
                <button
                  type="button"
                  className={`site-header__lang-option${selectedLanguage === 'EN' ? ' is-active' : ''}`}
                  onClick={() => handleLanguageSelect('EN')}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`site-header__lang-option${selectedLanguage === 'TH' ? ' is-active' : ''}`}
                  onClick={() => handleLanguageSelect('TH')}
                >
                  TH
                </button>
              </div>
            </details>
            <div className="site-header__utility-font-controls" aria-label="Font size controls">
              <button
                type="button"
                className={`site-header__utility-font${!isLargeFont ? ' is-active-small' : ''}`}
                aria-label="Default font size"
                aria-pressed={!isLargeFont}
                onClick={() => setFontScale(false)}
              >
                A
              </button>
              <button
                type="button"
                className={`site-header__utility-font${isLargeFont ? ' is-active-large' : ''}`}
                aria-label="Increase font size"
                aria-pressed={isLargeFont}
                onClick={() => setFontScale(true)}
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="site-header__main container mx-auto px-0 lg:px-4">
        <div className="site-header__main-inner">
          <details className="site-header__mobile-menu">
            <summary className="site-header__mobile-summary">
              <Link
                href={data.homeHref}
                className="site-header__brand"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={data.logoSrc}
                  alt={data.logoAlt}
                  width={144}
                  height={60}
                  className="site-header__brand-image"
                  unoptimized={data.logoSrc.startsWith('http')}
                />
              </Link>
              <span className="site-header__mobile-actions">
                <button
                  type="button"
                  className="site-header__icon-button site-header__icon-display"
                  aria-label="Search"
                  aria-expanded={searchOpen}
                  aria-haspopup="dialog"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSearchOpen(true)
                  }}
                >
                  <SearchIcon />
                </button>
                <span className="site-header__icon-display site-header__mobile-menu-icon site-header__mobile-menu-icon--hamburger" aria-hidden>
                  <HamburgerIcon />
                </span>
                <span className="site-header__icon-display site-header__mobile-menu-icon site-header__mobile-menu-icon--close" aria-hidden>
                  <CloseIcon />
                </span>
              </span>
            </summary>
            <div className="site-header__mobile-panel">
              <details className="site-header__mobile-persona">
                <summary className="site-header__mobile-persona-summary">
                  {data.mobilePersonaSummary}
                  <ChevronDownIcon />
                </summary>
                <div className="site-header__mobile-persona-list">
                  {data.mobilePersonaLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="site-header__mobile-persona-item"
                      {...(item.openInNewTab
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>

              <nav className="site-header__mobile-nav" aria-label="Main navigation mobile">
                {data.mainNav.map((item) =>
                  item.menu ? (
                    <div key={item.label} className="site-header__mobile-nav-group">
                      <button
                        type="button"
                        className={`site-header__mobile-nav-trigger${mobileOpenMegaMenu === item.label ? ' is-active' : ''}`}
                        onClick={() =>
                          setMobileOpenMegaMenu((prev) => (prev === item.label ? null : item.label))
                        }
                      >
                        {item.label}
                      </button>
                      {mobileOpenMegaMenu === item.label ? (
                        <div className="site-header__mobile-nav-submenu">
                          {[...item.menu.left.columns, ...(item.menu.right?.columns ?? [])]
                            .flat()
                            .map((submenuItem) => (
                              <Link
                                key={`${submenuItem.label}-${submenuItem.href}`}
                                href={submenuItem.href}
                                className="site-header__mobile-submenu-link"
                                {...(submenuItem.openInNewTab || submenuItem.href.startsWith('http')
                                  ? { target: '_blank', rel: 'noopener noreferrer' }
                                  : {})}
                              >
                                {submenuItem.label}
                              </Link>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="site-header__mobile-nav-link"
                      {...(item.openInNewTab
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
              <details ref={mobileLangRef} className="site-header__mobile-lang">
                <summary className="site-header__mobile-lang-summary">
                  {selectedLanguage}
                  <ChevronDownIcon />
                </summary>
                <div className="site-header__mobile-lang-options">
                  <button
                    type="button"
                    className={`site-header__mobile-lang-option${selectedLanguage === 'EN' ? ' is-active' : ''}`}
                    onClick={() => handleLanguageSelect('EN')}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    className={`site-header__mobile-lang-option${selectedLanguage === 'TH' ? ' is-active' : ''}`}
                    onClick={() => handleLanguageSelect('TH')}
                  >
                    TH
                  </button>
                </div>
              </details>

              <div className="site-header__mobile-font-controls">
                <button
                  type="button"
                  className={`site-header__mobile-font-control is-small${!isLargeFont ? ' is-active' : ''}`}
                  aria-label="Default font size"
                  aria-pressed={!isLargeFont}
                  onClick={() => setFontScale(false)}
                >
                  A
                </button>
                <button
                  type="button"
                  className={`site-header__mobile-font-control is-large${isLargeFont ? ' is-active' : ''}`}
                  aria-label="Increase font size"
                  aria-pressed={isLargeFont}
                  onClick={() => setFontScale(true)}
                >
                  A
                </button>
              </div>
            </div>
          </details>

          <div className="site-header__desktop-row">
            <Link
              href={data.homeHref}
              className="site-header__brand site-header__brand--desktop"
              aria-label="Krungthai home"
            >
              <Image
                src={data.logoSrc}
                alt={data.logoAlt}
                width={156}
                height={60}
                className="site-header__brand-image"
                unoptimized={data.logoSrc.startsWith('http')}
              />
            </Link>

            <nav ref={desktopNavRef} className="site-header__main-nav" aria-label="Main navigation desktop">
              {data.mainNav.map((item) =>
                item.menu ? (
                  <div
                    key={item.label}
                    className={`site-header__main-item site-header__main-item--has-panel${openMegaMenu === item.label ? ' is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="site-header__main-link site-header__main-link--summary"
                      aria-expanded={openMegaMenu === item.label}
                      onClick={() =>
                        setOpenMegaMenu((prev) => (prev === item.label ? null : item.label))
                      }
                    >
                      {item.label}
                    </button>
                    <div className="site-header__mega-menu" role="menu">
                      <div
                        className={`site-header__mega-menu-inner mx-auto ${item.menu.right?.columns?.length ? ' has-right-panel' : ''}`}
                      >
                        {renderMegaSection(item.menu.left, 'site-header__mega-panel--left')}
                        {item.menu.right?.columns?.length
                          ? renderMegaSection(item.menu.right, 'site-header__mega-panel--right')
                          : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="site-header__main-link"
                    onClick={() => setOpenMegaMenu(null)}
                    {...(item.openInNewTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={closeSearch} locale={locale} />
    </header>
  )
}
