'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { RefObject } from 'react'
import { GlobalIcon } from '@/components/ui/global-icon'

type ExportFormat = 'csv' | 'excel'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

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
        <button type="button" className="export-forms-block__calendar-nav" onClick={onPrevMonth}>
          <GlobalIcon type="arrow-left" size="L" />
        </button>

        <p className="export-forms-block__calendar-month">{monthLabel}</p>

        <button type="button" className="export-forms-block__calendar-nav" onClick={onNextMonth}>
          <GlobalIcon type="arrow-right" size="L" />
        </button>
      </div>

      <div className="export-forms-block__calendar-grid-wrap">
        <div className="export-forms-block__calendar-weekdays">
          {WEEKDAYS.map((day) => (
            <p key={day} className="export-forms-block__calendar-weekday">
              {day}
            </p>
          ))}
        </div>

        <div className="export-forms-block__calendar-weeks">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="export-forms-block__calendar-week">
              {week.map(({ date, inMonth }, dayIndex) => {
                const disabled = isDayDisabled(date, inMonth)
                const selected = previewDate !== null && isSameDay(date, previewDate)

                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
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

const toApiDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const buildFileName = ({
  formName,
  fromDate,
  toDate,
  format,
}: {
  formName: string
  fromDate: Date | null
  toDate: Date | null
  format: ExportFormat
}) => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const hhmm = `${pad(now.getHours())}${pad(now.getMinutes())}`
  const mmddyyhhmm = `${pad(now.getMonth() + 1)}${pad(now.getDate())}${now
    .getFullYear()
    .toString()
    .slice(-2)}${hhmm}`

  const extension = format === 'excel' ? 'xlsx' : 'csv'
  const safeFormName = (formName || 'AllForms').replace(/\s+/g, '-')

  if (fromDate || toDate) {
    const from = fromDate ? toApiDate(fromDate) : 'start'
    const to = toDate ? toApiDate(toDate) : 'end'

    return `${safeFormName}-Submissions-${from}-to-${to}.${extension}`.toLowerCase()
  }

  return `${safeFormName}-All-Submissions-${mmddyyhhmm}.${extension}`.toLowerCase()
}

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

export default function FormSubmissionsAdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [formNames, setFormNames] = useState<string[]>([])
  const [formName, setFormName] = useState('')
  const [loadingForms, setLoadingForms] = useState(true)
  const [openPicker, setOpenPicker] = useState<'start' | 'end' | null>(null)
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonthIndex, setViewMonthIndex] = useState(new Date().getMonth())
  const [previewDate, setPreviewDate] = useState<Date | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const startFieldRef = useRef<HTMLDivElement>(null)
  const endFieldRef = useRef<HTMLDivElement>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')

    setToken(tokenFromUrl)

    if (!tokenFromUrl) {
      setLoadingForms(false)
      return
    }

    fetch(`/api/forms?token=${encodeURIComponent(tokenFromUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setFormNames(data.formNames || [])
        }
      })
      .catch((err) => {
        console.error('Failed to fetch forms:', err)
      })
      .finally(() => {
        setLoadingForms(false)
      })
  }, [])

  const [downloadingFormat, setDownloadingFormat] =
  useState<ExportFormat | null>(null)

  const handleDownload = async (format: ExportFormat) => {
    if (!token) {
      alert('Missing export token')
      return
    }

    if (downloadingFormat) return

    const params = new URLSearchParams()
    params.append('token', token)
    params.append('format', format)

    if (formName) params.append('formName', formName)
    if (fromDate) params.append('from', toApiDate(fromDate))
    if (toDate) params.append('to', toApiDate(toDate))

    try {
      setDownloadingFormat(format)

      const response = await fetch(
        `/api/form-submissions/export?${params.toString()}`
      )

      if (!response.ok) {
        const result = await response.json()
        alert(result?.message || 'No records found.')
        return
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = buildFileName({
        formName,
        fromDate,
        toDate,
        format,
      })

      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error(error)
      alert('Download failed')
    } finally {
      setDownloadingFormat(null)
    }
  }

  const openFor = useCallback(
    (target: 'start' | 'end') => {
      const current = target === 'start' ? fromDate : toDate

      setPreviewDate(current)

      if (current) {
        setViewYear(current.getFullYear())
        setViewMonthIndex(current.getMonth())
      }

      setOpenPicker(target)
    },
    [fromDate, toDate]
  )

  const closePicker = useCallback(() => {
    setOpenPicker(null)
  }, [])

  const onCalendarContinue = () => {
    if (openPicker === 'start') {
      setFromDate(previewDate)
    } else if (openPicker === 'end') {
      setToDate(previewDate)
    }

    closePicker()
  }

  const onCalendarClear = () => {
    setPreviewDate(null)
  }

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

  const isDayDisabled = useCallback(
      (date: Date, inMonth: boolean): boolean => {
        if (!inMonth) return true
        if (openPicker !== 'end' || !fromDate) return false
        return startOfDay(date) < startOfDay(fromDate)
      },
      [openPicker, fromDate]
    )

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
              <label
                className="export-forms-block__label"
                htmlFor="export-form-name"
              >
                Form name
              </label>

              <div className="export-forms-block__select-wrap">
                <select
                  id="export-form-name"
                  className="export-forms-block__select"
                  value={formName}
                  disabled={loadingForms}
                  onChange={(e) => setFormName(e.target.value)}
                >
                  <option value="">
                    {loadingForms ? 'Loading forms...' : 'All forms'}
                  </option>

                  {formNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
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
                  className={[
                    'export-forms-block__date-trigger',
                    !fromDate && 'export-forms-block__date-trigger--placeholder',
                  ]
                    .filter(Boolean)
                    .join(' ')}
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
                    {fromDate ? formatDdMmYyyy(fromDate) : 'Select start date'}
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
                    !toDate && 'export-forms-block__date-trigger--placeholder',
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
                    {toDate ? formatDdMmYyyy(toDate) : 'Select end date'}
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
              disabled={!!downloadingFormat}
              onClick={() => handleDownload('csv')}
            >
              {downloadingFormat === 'csv' ? 'Downloading...' : 'Download CSV'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!!downloadingFormat}
              onClick={() => handleDownload('excel')}
            >
              {downloadingFormat === 'excel' ? 'Downloading...' : 'Download Excel'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}