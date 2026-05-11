'use client'

import * as React from 'react'
import clsx from 'clsx'

function useTabsListPointerDrag() {
  const listRef = React.useRef<HTMLDivElement>(null)
  const suppressNextPointerClickRef = React.useRef(false)
  const dragRef = React.useRef({
    active: false,
    captureActive: false,
    pointerId: 0,
    startX: 0,
    startScrollLeft: 0,
    didDrag: false,
  })

  const onListPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!listRef.current) return
    const el = listRef.current
    dragRef.current = {
      active: true,
      captureActive: false,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      didDrag: false,
    }
  }

  const onListPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !listRef.current) return
    if (dragRef.current.pointerId !== e.pointerId) return
    const dx = e.clientX - dragRef.current.startX
    if (Math.abs(dx) > 6) {
      if (!dragRef.current.captureActive) {
        try {
          listRef.current.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
        dragRef.current.captureActive = true
      }
      dragRef.current.didDrag = true
      listRef.current.scrollLeft = dragRef.current.startScrollLeft - dx
    }
  }

  const onListPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!listRef.current) return
    if (
      dragRef.current.captureActive &&
      dragRef.current.active &&
      dragRef.current.pointerId === e.pointerId
    ) {
      try {
        listRef.current.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }
    if (dragRef.current.didDrag) {
      suppressNextPointerClickRef.current = true
      window.setTimeout(() => {
        suppressNextPointerClickRef.current = false
      }, 0)
    }
    dragRef.current.didDrag = false
    dragRef.current.captureActive = false
    dragRef.current.active = false
  }

  return {
    listRef,
    suppressNextPointerClickRef,
    onListPointerDown,
    onListPointerMove,
    onListPointerUp,
    onListPointerCancel: onListPointerUp,
  }
}

function TabsListFrame({
  listRef,
  listClassName,
  listProps,
  onListPointerDown,
  onListPointerMove,
  onListPointerUp,
  onListPointerCancel,
  children,
}: {
  listRef: React.RefObject<HTMLDivElement | null>
  listClassName?: string
  listProps?: React.HTMLAttributes<HTMLDivElement>
  onListPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  onListPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
  onListPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void
  onListPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void
  children: React.ReactNode
}) {
  return (
    <div className="tabs__list-bleed">
      <div className="container mx-auto px-4 pr-0">
        <div
          ref={listRef}
          className={clsx('tabs__list', listClassName)}
          onPointerDown={onListPointerDown}
          onPointerMove={onListPointerMove}
          onPointerUp={onListPointerUp}
          onPointerCancel={onListPointerCancel}
          {...listProps}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export type TabItem = {
  id: string
  label: React.ReactNode
  content?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  defaultActiveId?: string
  activeId?: string
  onChange?: (id: string) => void
  className?: string
  listClassName?: string
  itemClassName?: string
  panelClassName?: string
  /** When true, renders tab panels below the list (requires `content` on items). */
  showPanels?: boolean
}

export function Tabs({
  items,
  defaultActiveId,
  activeId,
  onChange,
  className,
  listClassName,
  itemClassName,
  panelClassName,
  showPanels = false,
}: TabsProps) {
  const {
    listRef,
    suppressNextPointerClickRef,
    onListPointerDown,
    onListPointerMove,
    onListPointerUp,
    onListPointerCancel,
  } = useTabsListPointerDrag()

  const fallbackActiveId = items[0]?.id
  const [internalActiveId, setInternalActiveId] = React.useState<string | undefined>(
    defaultActiveId ?? fallbackActiveId
  )

  const resolvedActiveId = activeId ?? internalActiveId ?? fallbackActiveId

  const handleTabClick = (id: string) => {
    if (suppressNextPointerClickRef.current) {
      suppressNextPointerClickRef.current = false
      return
    }
    if (!activeId) {
      setInternalActiveId(id)
    }
    onChange?.(id)
  }

  return (
    <div className={clsx('tabs', className)}>
      <TabsListFrame
        listRef={listRef}
        listClassName={listClassName}
        listProps={{ role: 'tablist', 'aria-orientation': 'horizontal' }}
        onListPointerDown={onListPointerDown}
        onListPointerMove={onListPointerMove}
        onListPointerUp={onListPointerUp}
        onListPointerCancel={onListPointerCancel}
      >
        {items.map((item) => {
          const isSelected = item.id === resolvedActiveId

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={showPanels ? `tabpanel-${item.id}` : undefined}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              className={clsx('tabs__item', isSelected && 'is-selected', itemClassName)}
              onClick={() => handleTabClick(item.id)}
            >
              <span className="tabs__label">{item.label}</span>
            </button>
          )
        })}
      </TabsListFrame>

      {showPanels &&
        items.map((item) => {
          const isSelected = item.id === resolvedActiveId
          if (item.content == null) return null
          return (
            <div
              key={`panel-${item.id}`}
              id={`tabpanel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${item.id}`}
              hidden={!isSelected}
              className={clsx('tabs__panel', panelClassName)}
            >
              {item.content}
            </div>
          )
        })}
    </div>
  )
}

export type AnchorTabItem = {
  /** Must match the `id` of the target section in the document (used in `href="#…"`). */
  sectionId: string
  label: React.ReactNode
  disabled?: boolean
}

export interface AnchorTabsProps {
  items: AnchorTabItem[]
  /** Controlled: highlight and sync from parent. Uncontrolled: driven by hash, scroll, and clicks. */
  activeSectionId?: string
  onActiveSectionChange?: (sectionId: string) => void
  className?: string
  listClassName?: string
  itemClassName?: string
  /** `aria-label` on the wrapping `<nav>`. */
  ariaLabel?: string
  /**
   * IntersectionObserver `rootMargin` for scroll-spy (which section is treated as active).
   * Tune if you use a sticky header so the “active” band sits where readers focus.
   */
  scrollSpyRootMargin?: string
}

const defaultScrollSpyRootMargin = '-12% 0px -52% 0px'

export function AnchorTabs({
  items,
  activeSectionId: activeSectionIdProp,
  onActiveSectionChange,
  className,
  listClassName,
  itemClassName,
  ariaLabel = 'Page sections',
  scrollSpyRootMargin = defaultScrollSpyRootMargin,
}: AnchorTabsProps) {
  const {
    listRef,
    suppressNextPointerClickRef,
    onListPointerDown,
    onListPointerMove,
    onListPointerUp,
    onListPointerCancel,
  } = useTabsListPointerDrag()

  const fallbackId = items[0]?.sectionId
  const [internalActiveSectionId, setInternalActiveSectionId] = React.useState<
    string | undefined
  >(fallbackId)

  const isControlled = activeSectionIdProp !== undefined
  const resolvedActiveSectionId =
    activeSectionIdProp ?? internalActiveSectionId ?? fallbackId

  const commitActive = React.useCallback(
    (sectionId: string) => {
      if (!items.some((i) => i.sectionId === sectionId && !i.disabled)) return
      if (isControlled) {
        if (sectionId !== activeSectionIdProp) {
          onActiveSectionChange?.(sectionId)
        }
        return
      }
      setInternalActiveSectionId((prev) => {
        if (prev === sectionId) return prev
        onActiveSectionChange?.(sectionId)
        return sectionId
      })
    },
    [isControlled, activeSectionIdProp, items, onActiveSectionChange]
  )

  React.useEffect(() => {
    const readHash = () => {
      const id = window.location.hash.slice(1)
      if (!id) return
      const match = items.find((i) => i.sectionId === id)
      if (!match || match.disabled) return
      commitActive(id)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
    }
    readHash()
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [items, commitActive])

  React.useEffect(() => {
    const elements = items
      .filter((i) => !i.disabled)
      .map((i) => document.getElementById(i.sectionId))
      .filter((el): el is HTMLElement => Boolean(el))
    if (elements.length === 0) return

    const thresholds = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.35, 0.5, 0.65, 0.8, 1]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const best = visible.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b
        )
        const id = best.target.id
        commitActive(id)
      },
      { root: null, rootMargin: scrollSpyRootMargin, threshold: thresholds }
    )

    for (const el of elements) {
      observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items, scrollSpyRootMargin, commitActive])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (suppressNextPointerClickRef.current) {
      e.preventDefault()
      return
    }
    const item = items.find((i) => i.sectionId === sectionId)
    if (item?.disabled) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    const target = document.getElementById(sectionId)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const nextHash = `#${sectionId}`
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash)
    }
    commitActive(sectionId)
  }

  return (
    <nav className={clsx('tabs', className)} aria-label={ariaLabel}>
      <TabsListFrame
        listRef={listRef}
        listClassName={listClassName}
        onListPointerDown={onListPointerDown}
        onListPointerMove={onListPointerMove}
        onListPointerUp={onListPointerUp}
        onListPointerCancel={onListPointerCancel}
      >
        {items.map((item) => {
          const isSelected = item.sectionId === resolvedActiveSectionId
          const href = `#${item.sectionId}`

          return (
            <a
              key={item.sectionId}
              href={href}
              className={clsx('tabs__item', isSelected && 'is-selected', itemClassName)}
              aria-current={isSelected ? 'location' : undefined}
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled ? -1 : undefined}
              onClick={(e) => handleAnchorClick(e, item.sectionId)}
            >
              <span className="tabs__label">{item.label}</span>
            </a>
          )
        })}
      </TabsListFrame>
    </nav>
  )
}
