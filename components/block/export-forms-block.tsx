'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { GlobalIcon } from '@/components/ui/global-icon'

const FORM_OPTIONS = [
  { value: 'all', label: 'All forms' },
  { value: 'loan', label: 'Loan application' },
  { value: 'contact', label: 'Contact request' },
  { value: 'feedback', label: 'Feedback' },
] as const

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDdMmYyyy(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function buildCalendarWeeks(
  viewYear: number,
  viewMonthIndex: number
): { date: Date; inMonth: boolean }[][] {
  const first = new Date(viewYear, viewMonthIndex, 1)
  const daysInMonth = new Date(viewYear, viewMonthIndex + 1, 0).getDate()
  const startPad = first.getDay()
  const prevMonthLastDate = new Date(viewYear, viewMonthIndex, 0).getDate()

  const cells: { date: Date; inMonth: boolean }[] = []

  for (let i = 0; i < startPad; i += 1) {
    const day = prevMonthLastDate - startPad + i + 1
    cells.push({
      date: new Date(viewYear, viewMonthIndex - 1, day),
      inMonth: false,
    })
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({
      date: new Date(viewYear, viewMonthIndex, d),
      inMonth: true,
    })
  }

  let nextDay = 1
  while (cells.length % 7 !== 0) {
    cells.push({
      date: new Date(viewYear, viewMonthIndex + 1, nextDay),
      inMonth: false,
    })
    nextDay += 1
  }

  const weeks: { date: Date; inMonth: boolean }[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

type PickerTarget = 'start' | 'end'

type CalendarPopoverProps = {
  popoverRef: RefObject<HTMLDivElement | null>
  ariaLabel: string
  monthLabel: string
  weeks: { date: Date; inMonth: boolean }[][]
  previewDate: Date | null
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDay: (date: Date) => void
  isDayDisabled: (date: Date, inMonth: boolean) => boolean
  onClear: () => void
  onContinue: () => void
}

function ExportCalendarPopover({
  popoverRef,
  ariaLabel,
  monthLabel,
  weeks,
  previewDate,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  isDayDisabled,
  onClear,
  onContinue,
}: CalendarPopoverProps) {
  return (
    <div
      ref={popoverRef}
      className="export-forms-block__calendar-popover"
      role="dialog"
      aria-label={ariaLabel}
    >
      <div className="export-forms-block__calendar-controls">
        <button
          type="button"
          className="export-forms-block__calendar-nav"
          aria-label="Previous month"
          onClick={onPrevMonth}
        >
          <GlobalIcon type="arrow-left" size="L" />
        </button>
        <p className="export-forms-block__calendar-month">{monthLabel}</p>
        <button
          type="button"
          className="export-forms-block__calendar-nav"
          aria-label="Next month"
          onClick={onNextMonth}
        >
          <GlobalIcon type="arrow-right" size="L" />
        </button>
      </div>
      <div className="export-forms-block__calendar-grid-wrap">
        <div className="export-forms-block__calendar-weekdays">
          {WEEKDAYS.map((wd) => (
            <p key={wd} className="export-forms-block__calendar-weekday">
              {wd}
            </p>
          ))}
        </div>
        <div className="export-forms-block__calendar-weeks">
          {weeks.map((week, wi) => (
            <div key={wi} className="export-forms-block__calendar-week">
              {week.map(({ date, inMonth }, di) => {
                const disabled = isDayDisabled(date, inMonth)
                const selected = previewDate !== null && isSameDay(date, previewDate)
                return (
                  <button
                    key={`${wi}-${di}`}
                    type="button"
                    disabled={disabled}
                    className={[
                      'export-forms-block__calendar-day',
                      !inMonth && 'export-forms-block__calendar-day--outside',
                      disabled && inMonth && 'export-forms-block__calendar-day--disabled',
                      selected && 'export-forms-block__calendar-day--selected',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => !disabled && onSelectDay(date)}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="export-forms-block__calendar-actions">
        <Button type="button" variant="secondary" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Button type="button" size="sm" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}

export default function ExportFormsBlock() {
  const [formName, setFormName] = useState<string>('all')
  const [startDate, setStartDate] = useState<Date | null>(
    () => new Date(2026, 5, 12)
  )
  const [endDate, setEndDate] = useState<Date | null>(null)

  const [openPicker, setOpenPicker] = useState<PickerTarget | null>(null)
  const [viewYear, setViewYear] = useState(2026)
  const [viewMonthIndex, setViewMonthIndex] = useState(5)
  const [previewDate, setPreviewDate] = useState<Date | null>(null)

  const popoverRef = useRef<HTMLDivElement>(null)
  const startFieldRef = useRef<HTMLDivElement>(null)
  const endFieldRef = useRef<HTMLDivElement>(null)

  const monthLabel = useMemo(() => {
    const d = new Date(viewYear, viewMonthIndex, 1)
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
      d
    )
  }, [viewYear, viewMonthIndex])

  const weeks = useMemo(
    () => buildCalendarWeeks(viewYear, viewMonthIndex),
    [viewYear, viewMonthIndex]
  )

  const openFor = useCallback(
    (target: PickerTarget) => {
      const current = target === 'start' ? startDate : endDate
      setPreviewDate(current)
      if (current) {
        setViewYear(current.getFullYear())
        setViewMonthIndex(current.getMonth())
      }
      setOpenPicker(target)
    },
    [startDate, endDate]
  )

  const closePicker = useCallback(() => {
    setOpenPicker(null)
  }, [])

  useEffect(() => {
    if (!openPicker) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const node = event.target as Node
      if (popoverRef.current?.contains(node)) return
      if (startFieldRef.current?.contains(node)) return
      if (endFieldRef.current?.contains(node)) return
      closePicker()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [openPicker, closePicker])

  const isDayDisabled = useCallback(
    (date: Date, inMonth: boolean): boolean => {
      if (!inMonth) return true
      if (openPicker !== 'end' || !startDate) return false
      return startOfDay(date) < startOfDay(startDate)
    },
    [openPicker, startDate]
  )

  const goPrevMonth = () => {
    if (viewMonthIndex === 0) {
      setViewMonthIndex(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonthIndex((m) => m - 1)
    }
  }

  const goNextMonth = () => {
    if (viewMonthIndex === 11) {
      setViewMonthIndex(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonthIndex((m) => m + 1)
    }
  }

  const onCalendarContinue = () => {
    if (openPicker === 'start') {
      setStartDate(previewDate)
    } else if (openPicker === 'end') {
      setEndDate(previewDate)
    }
    closePicker()
  }

  const onCalendarClear = () => {
    setPreviewDate(null)
  }

  const onDownload = (_format: 'csv' | 'excel') => {
    /* Wire to export API when available: formName, startDate, endDate, format */
  }

  const calendarProps = {
    popoverRef,
    monthLabel,
    weeks,
    previewDate,
    onPrevMonth: goPrevMonth,
    onNextMonth: goNextMonth,
    onSelectDay: setPreviewDate,
    isDayDisabled,
    onClear: onCalendarClear,
    onContinue: onCalendarContinue,
  }

  return (
    <section className="export-forms-block" aria-labelledby="export-forms-heading">
      <div className="export-forms-block__inner">
        <div className="export-forms-block__card">
          <h1 id="export-forms-heading" className="export-forms-block__title">
            Form Submissions Export
          </h1>

          <div className="export-forms-block__fields">
            <div className="export-forms-block__field">
              <label className="export-forms-block__label" htmlFor="export-form-name">
                Form name
              </label>
              <div className="export-forms-block__select-wrap">
                <select
                  id="export-form-name"
                  className="export-forms-block__select"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                >
                  {FORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="export-forms-block__select-icon" aria-hidden>
                  <GlobalIcon type="chevron-down" size="L" />
                </span>
              </div>
            </div>

            <div className="export-forms-block__row">
              <div className="export-forms-block__field" ref={startFieldRef}>
                <span className="export-forms-block__label" id="export-start-label">
                  Start date
                </span>
                <button
                  type="button"
                  className="export-forms-block__date-trigger export-forms-block__date-trigger--start"
                  aria-labelledby="export-start-label"
                  aria-expanded={openPicker === 'start'}
                  aria-haspopup="dialog"
                  onClick={() => {
                    if (openPicker === 'start') {
                      closePicker()
                    } else {
                      openFor('start')
                    }
                  }}
                >
                  <span>
                    {startDate ? formatDdMmYyyy(startDate) : 'Select start date'}
                  </span>
                  <span className="export-forms-block__date-trigger-icon" aria-hidden>
                    <GlobalIcon type="chevron-down" size="L" />
                  </span>
                </button>
                {openPicker === 'start' && (
                  <ExportCalendarPopover
                    {...calendarProps}
                    ariaLabel="Choose start date"
                  />
                )}
              </div>

              <div className="export-forms-block__field" ref={endFieldRef}>
                <span className="export-forms-block__label" id="export-end-label">
                  End date
                </span>
                <button
                  type="button"
                  className={[
                    'export-forms-block__date-trigger',
                    !endDate && 'export-forms-block__date-trigger--placeholder',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-labelledby="export-end-label"
                  aria-expanded={openPicker === 'end'}
                  aria-haspopup="dialog"
                  onClick={() => {
                    if (openPicker === 'end') {
                      closePicker()
                    } else {
                      openFor('end')
                    }
                  }}
                >
                  <span>
                    {endDate ? formatDdMmYyyy(endDate) : 'Select end date'}
                  </span>
                  <span className="export-forms-block__date-trigger-icon" aria-hidden>
                    <GlobalIcon type="chevron-down" size="L" />
                  </span>
                </button>
                {openPicker === 'end' && (
                  <ExportCalendarPopover
                    {...calendarProps}
                    ariaLabel="Choose end date"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="export-forms-block__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onDownload('csv')}
            >
              Download CSV
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onDownload('excel')}
            >
              Download Excel
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
