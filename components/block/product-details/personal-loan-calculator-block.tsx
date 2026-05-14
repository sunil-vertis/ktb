'use client'

import * as React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

import type { PersonalLoanCalculatorBlockFragmentFragment } from '@/lib/optimizely/types/generated'

import { mediaRefToUrl, richTextToPlainLines } from './map-cms'

/** Reducing-balance monthly installment (matches Figma sample: 100,000 @ 20% × 60 → 2,649). */
export function computeMonthlyInstallment(
  principal: number,
  annualRateDecimal: number,
  termMonths: number
): number {
  if (termMonths <= 0 || principal <= 0) return 0
  const r = annualRateDecimal / 12
  if (r === 0) return principal / termMonths
  const factor = (1 + r) ** termMonths
  return (principal * r * factor) / (factor - 1)
}

export function formatBahtAmount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

/** Matches `OptionValue` from CMS `OptionBlock`; legacy demo uses `government` | `private`. */
export type ProfessionOption = string

export type LoanCalculatorProfessionChoice = {
  label: string
  value: string
}

export type PersonalLoanCalculatorBlockProps = {
  title?: string
  subtitle?: string
  sectionId?: string
  className?: string
  /** Annual rate as decimal (0.2 = 20%). Same for all professions. */
  annualInterestRate?: number
  incomeMin?: number
  incomeMax?: number
  loanMin?: number
  loanMax?: number
  installmentMinMonths?: number
  installmentMaxMonths?: number
  validationMessage?: string
  noteLines?: readonly string[]
  monthlyIncomeTitle?: string
  selectProfessionTitle?: string
  /** From CMS `ProfessionOptions` / `OptionBlock`; falls back to two demo options when empty. */
  professionOptions?: readonly LoanCalculatorProfessionChoice[]
  loanAmountTitle?: string
  installmentPeriodTitle?: string
  calculationResultTitle?: string
  interestRateTitle?: string
  monthlyRepaymentAmountTitle?: string
  /** Figma radio assets (20×20). */
  radioOffIconSrc?: string
  radioOnIconSrc?: string
}

const DEFAULT_NOTE = [
  'Note:',
  '• The calculation results are only an initial assessment of your borrowing capacity.',
  "• Loan approval terms and conditions are subject to the bank's regulations.",
] as const

const GOVT_LABEL = 'Government & State Enterprise Employees'
const PRIVATE_LABEL = 'Private sector employees'

const DEFAULT_PROFESSION_OPTIONS: readonly LoanCalculatorProfessionChoice[] = [
  { label: GOVT_LABEL, value: 'government' },
  { label: PRIVATE_LABEL, value: 'private' },
]

const DEFAULT_RADIO_OFF = '/assets/icons/loan-calculator/radio-off.svg'
const DEFAULT_RADIO_ON = '/assets/icons/loan-calculator/radio-on.svg'

function safeDomId(id: string): string {
  return id.replace(/:/g, '')
}

function mapProfessionOptionsFromCms(
  items: PersonalLoanCalculatorBlockFragmentFragment['ProfessionOptions']
): LoanCalculatorProfessionChoice[] | undefined {
  if (!items?.length) return undefined
  const out: LoanCalculatorProfessionChoice[] = []
  for (const item of items) {
    if (item?.__typename === 'OptionBlock') {
      const label = item.OptionText?.trim()
      const value = item.OptionValue?.trim()
      if (label && value) out.push({ label, value })
    }
  }
  return out.length ? out : undefined
}

export function PersonalLoanCalculatorBlockFE({
  title = 'Personal Loan Calculator',
  subtitle = 'Calculate your personal loan repayment amount.',
  sectionId,
  className,
  annualInterestRate = 0.2,
  incomeMin = 0,
  incomeMax = 1_500_000,
  loanMin = 10_000,
  loanMax = 1_000_000,
  installmentMinMonths = 12,
  installmentMaxMonths = 60,
  validationMessage = 'Please specify an amount with limit maximum 5 times of your monthly income',
  noteLines = DEFAULT_NOTE,
  monthlyIncomeTitle = 'Monthly income',
  selectProfessionTitle = 'Select your profession',
  professionOptions,
  loanAmountTitle = 'Loan amount',
  installmentPeriodTitle = 'Installment period',
  calculationResultTitle = 'Calculation Result',
  interestRateTitle = 'Interest rate',
  monthlyRepaymentAmountTitle = 'Monthly repayment amount',
  radioOffIconSrc = DEFAULT_RADIO_OFF,
  radioOnIconSrc = DEFAULT_RADIO_ON,
}: PersonalLoanCalculatorBlockProps) {
  const titleId = safeDomId(React.useId())
  const professionGroupTitleId = safeDomId(React.useId())
  const incomeId = safeDomId(React.useId())
  const loanId = safeDomId(React.useId())
  const monthsId = safeDomId(React.useId())

  const resolvedProfessionOptions = React.useMemo(() => {
    const fromProps =
      professionOptions?.filter((o) => o.label?.trim() && o.value?.trim()) ?? []
    return fromProps.length > 0 ? fromProps : [...DEFAULT_PROFESSION_OPTIONS]
  }, [professionOptions])

  const [income, setIncome] = React.useState(120_000)
  const [loanAmount, setLoanAmount] = React.useState(100_000)
  const [months, setMonths] = React.useState(60)
  const [profession, setProfession] = React.useState(
    () => resolvedProfessionOptions[0]?.value ?? 'government'
  )

  React.useEffect(() => {
    const first = resolvedProfessionOptions[0]?.value ?? 'government'
    setProfession((prev) =>
      resolvedProfessionOptions.some((o) => o.value === prev) ? prev : first
    )
  }, [resolvedProfessionOptions])

  const maxLoanByIncome = income * 5
  const loanExceedsLimit = loanAmount > maxLoanByIncome

  const monthlyPayment = loanExceedsLimit
    ? null
    : computeMonthlyInstallment(loanAmount, annualInterestRate, months)

  const interestPercentLabel = `${Math.round(annualInterestRate * 100)}%`

  const incomePct =
    incomeMax > incomeMin
      ? ((income - incomeMin) / (incomeMax - incomeMin)) * 100
      : 0
  const loanPct =
    loanMax > loanMin
      ? ((loanAmount - loanMin) / (loanMax - loanMin)) * 100
      : 0
  const monthsPct =
    installmentMaxMonths > installmentMinMonths
      ? ((months - installmentMinMonths) /
          (installmentMaxMonths - installmentMinMonths)) *
        100
      : 0

  return (
    <section
      id={sectionId}
      className={clsx('personal-loan-calculator', className)}
      aria-labelledby={titleId}
      data-profession={profession}
    >
      <div className="personal-loan-calculator__header">
        <h2 className="personal-loan-calculator__title type-heading-h3" id={titleId}>
          {title}
        </h2>
        <p className="personal-loan-calculator__subtitle type-body-base-regular">
          {subtitle}
        </p>
      </div>

      <div className="personal-loan-calculator__modules">
        <fieldset
          className="personal-loan-calculator__fieldset"
          aria-labelledby={professionGroupTitleId}
        >
          <p
            id={professionGroupTitleId}
            className="personal-loan-calculator__fieldset-title type-body-large-medium"
          >
            {selectProfessionTitle}
          </p>
          <div className="personal-loan-calculator__radios">
            {resolvedProfessionOptions.map((opt) => (
              <label
                key={opt.value}
                className="personal-loan-calculator__radio-label"
              >
                <input
                  type="radio"
                  className="personal-loan-calculator__radio-input"
                  name="plc-profession"
                  checked={profession === opt.value}
                  onChange={() => setProfession(opt.value)}
                />
                <span
                  className="personal-loan-calculator__radio-graphic"
                  aria-hidden
                >
                  <Image
                    className="personal-loan-calculator__radio-img"
                    src={
                      profession === opt.value ? radioOnIconSrc : radioOffIconSrc
                    }
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                    sizes="20px"
                  />
                </span>
                <span className="personal-loan-calculator__radio-text type-body-large-medium">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="personal-loan-calculator__slider-group">
          <div className="personal-loan-calculator__slider-block">
            <div className="personal-loan-calculator__slider-head">
              <span
                className="personal-loan-calculator__slider-label type-body-large-medium"
                id={`${incomeId}-label`}
              >
                {monthlyIncomeTitle}
              </span>
              <div className="personal-loan-calculator__value-field">
                <span className="personal-loan-calculator__value-num type-heading-h3">
                  {formatBahtAmount(income)}
                </span>
                <span className="personal-loan-calculator__value-unit type-body-large-regular">
                  baht
                </span>
              </div>
            </div>
            <div className="personal-loan-calculator__slider-wrap">
              <input
                id={incomeId}
                type="range"
                className="personal-loan-calculator__range"
                style={{ '--plc-pct': `${incomePct}%` } as React.CSSProperties}
                min={incomeMin}
                max={incomeMax}
                step={1000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                aria-labelledby={`${incomeId}-label`}
              />
              <div className="personal-loan-calculator__slider-ticks type-label-small-regular">
                <span>{formatBahtAmount(incomeMin)} baht</span>
                <span>{formatBahtAmount(incomeMax)} baht</span>
              </div>
            </div>
          </div>

          <div className="personal-loan-calculator__slider-block">
            <div className="personal-loan-calculator__slider-head">
              <span
                className="personal-loan-calculator__slider-label type-body-large-medium"
                id={`${loanId}-label`}
              >
                {loanAmountTitle}
              </span>
              <div className="personal-loan-calculator__value-field">
                <span className="personal-loan-calculator__value-num type-heading-h3">
                  {formatBahtAmount(loanAmount)}
                </span>
                <span className="personal-loan-calculator__value-unit type-body-large-regular">
                  baht
                </span>
              </div>
            </div>
            <div className="personal-loan-calculator__slider-wrap">
              <input
                id={loanId}
                type="range"
                className={clsx(
                  'personal-loan-calculator__range',
                  loanExceedsLimit && 'personal-loan-calculator__range--invalid'
                )}
                style={{ '--plc-pct': `${loanPct}%` } as React.CSSProperties}
                min={loanMin}
                max={loanMax}
                step={1000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                aria-labelledby={`${loanId}-label`}
                aria-invalid={loanExceedsLimit}
                aria-describedby={
                  loanExceedsLimit ? `${loanId}-error` : undefined
                }
              />
              <div className="personal-loan-calculator__slider-ticks type-label-small-regular">
                <span>{formatBahtAmount(loanMin)} baht</span>
                <span>{formatBahtAmount(loanMax)} baht</span>
              </div>
              {loanExceedsLimit ? (
                <p
                  id={`${loanId}-error`}
                  className="personal-loan-calculator__error type-label-default"
                  role="alert"
                >
                  {validationMessage}
                </p>
              ) : null}
            </div>
          </div>

          <div className="personal-loan-calculator__slider-block">
            <div className="personal-loan-calculator__slider-head">
              <span
                className="personal-loan-calculator__slider-label type-body-large-medium"
                id={`${monthsId}-label`}
              >
                {installmentPeriodTitle}
              </span>
              <div className="personal-loan-calculator__value-field">
                <span className="personal-loan-calculator__value-num type-heading-h3">
                  {months}
                </span>
                <span className="personal-loan-calculator__value-unit type-body-large-regular">
                  months
                </span>
              </div>
            </div>
            <div className="personal-loan-calculator__slider-wrap">
              <input
                id={monthsId}
                type="range"
                className="personal-loan-calculator__range"
                style={{ '--plc-pct': `${monthsPct}%` } as React.CSSProperties}
                min={installmentMinMonths}
                max={installmentMaxMonths}
                step={1}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                aria-labelledby={`${monthsId}-label`}
              />
              <div className="personal-loan-calculator__slider-ticks type-label-small-regular">
                <span>{installmentMinMonths} months</span>
                <span>{installmentMaxMonths} months</span>
              </div>
            </div>
          </div>
        </div>

        <div className="personal-loan-calculator__results">
          <p className="personal-loan-calculator__results-title type-body-large-medium">
            {calculationResultTitle}
          </p>

          <div className="personal-loan-calculator__results-grid">
            <div className="personal-loan-calculator__results-row personal-loan-calculator__results-row--pair">
              <div className="personal-loan-calculator__result-card personal-loan-calculator__result-card--muted">
                <p className="personal-loan-calculator__result-label type-body-small-regular">
                  {loanAmountTitle}
                </p>
                <div className="personal-loan-calculator__value-field">
                  <span className="personal-loan-calculator__value-num type-heading-h3">
                    {formatBahtAmount(loanAmount)}
                  </span>
                  <span className="personal-loan-calculator__value-unit type-body-large-regular">
                    baht
                  </span>
                </div>
              </div>
              <div className="personal-loan-calculator__result-card personal-loan-calculator__result-card--muted">
                <p className="personal-loan-calculator__result-label type-body-small-regular">
                  {interestRateTitle}
                </p>
                <p className="personal-loan-calculator__result-highlight type-heading-h3">
                  {interestPercentLabel}
                </p>
              </div>
            </div>

            <div className="personal-loan-calculator__result-card personal-loan-calculator__result-card--accent">
              <p className="personal-loan-calculator__result-label type-body-small-regular">
                {monthlyRepaymentAmountTitle}
              </p>
              <div className="personal-loan-calculator__value-field">
                {monthlyPayment != null ? (
                  <>
                    <span className="personal-loan-calculator__value-num type-heading-h3">
                      {formatBahtAmount(monthlyPayment)}
                    </span>
                    <span className="personal-loan-calculator__value-unit type-body-large-regular">
                      baht
                    </span>
                  </>
                ) : (
                  <span className="personal-loan-calculator__value-placeholder type-heading-h3">
                    —
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="personal-loan-calculator__notes type-label-small-regular">
            {noteLines.map((line, i) => (
              <p key={i} className="personal-loan-calculator__note-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type CmsPersonalLoanCalculatorProps = Omit<
  PersonalLoanCalculatorBlockFragmentFragment,
  '__typename'
>

export default function PersonalLoanCalculatorBlock(
  props: CmsPersonalLoanCalculatorProps
) {
  const noteLines =
    richTextToPlainLines(props.NoteLines?.html ?? undefined) ?? DEFAULT_NOTE
  let annualInterestRate = props.AnnualInterestRate ?? 0.2
  if (annualInterestRate > 1) {
    annualInterestRate = annualInterestRate / 100
  }

  const professionOptions = mapProfessionOptionsFromCms(props.ProfessionOptions)

  return (
    <PersonalLoanCalculatorBlockFE
      title={props.Title ?? undefined}
      subtitle={props.Subtitle ?? undefined}
      monthlyIncomeTitle={props.MonthlyIncomeTitle ?? undefined}
      selectProfessionTitle={props.SelectProfessionTitle ?? undefined}
      professionOptions={professionOptions}
      loanAmountTitle={props.LoanAmountTitle ?? undefined}
      installmentPeriodTitle={props.InstallmentPeriodTitle ?? undefined}
      calculationResultTitle={props.CalculationResultTitle ?? undefined}
      interestRateTitle={props.InterestRateTitle ?? undefined}
      monthlyRepaymentAmountTitle={
        props.MonthlyRepaymentAmountTitle ?? undefined
      }
      annualInterestRate={annualInterestRate}
      incomeMin={props.IncomeMin ?? undefined}
      incomeMax={props.IncomeMax ?? undefined}
      loanMin={props.LoanMin ?? undefined}
      loanMax={props.LoanMax ?? undefined}
      installmentMinMonths={props.InstallmentMinMonths ?? undefined}
      installmentMaxMonths={props.InstallmentMaxMonths ?? undefined}
      validationMessage={props.ValidationMessage ?? undefined}
      noteLines={noteLines}
      radioOffIconSrc={
        mediaRefToUrl(
          props.RadioOffIconSrc as Parameters<typeof mediaRefToUrl>[0]
        ) ?? DEFAULT_RADIO_OFF
      }
      radioOnIconSrc={
        mediaRefToUrl(
          props.RadioOnIconSrc as Parameters<typeof mediaRefToUrl>[0]
        ) ?? DEFAULT_RADIO_ON
      }
    />
  )
}
