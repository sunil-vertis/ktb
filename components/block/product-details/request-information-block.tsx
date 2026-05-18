'use client'

import * as React from 'react'
import clsx from 'clsx'

import {
  OPTIMIZELY_WEB_EVENTS,
  trackFormStartOnce,
  trackOptimizelyEvent,
} from '@/lib/analytics/optimizely-web-events'
import { Button } from '@/components/ui/button'

import type { RequestInformationBlockFragmentFragment } from '@/lib/optimizely/types/generated'

export type RequestInformationFormValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type RequestInformationBlockProps = {
  title?: string
  formTitle?: string
  formDescription?: React.ReactNode
  submitLabel?: string
  className?: string
  sectionId?: string
  onSubmit?: (values: RequestInformationFormValues) => void
}

const INITIAL_VALUES: RequestInformationFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

type FormErrors = Record<keyof RequestInformationFormValues, string>
type TouchedMap = Record<keyof RequestInformationFormValues, boolean>

const EMPTY_TOUCHED: TouchedMap = {
  firstName: false,
  lastName: false,
  email: false,
  phone: false,
}

function validate(values: RequestInformationFormValues): FormErrors {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneDigits = values.phone.replace(/\D/g, '')

  return {
    firstName: values.firstName.trim() ? '' : 'First name is required.',
    lastName: values.lastName.trim() ? '' : 'Last name is required.',
    email: !values.email.trim()
      ? 'Email address is required.'
      : emailRegex.test(values.email.trim())
        ? ''
        : 'Please enter a valid email address.',
    phone: !values.phone.trim()
      ? 'Phone number is required.'
      : phoneDigits.length === 10
        ? ''
        : 'Phone number must be exactly 10 digits.',
  }
}

export function RequestInformationBlockFE({
  title = 'Request Information',
  formTitle = 'Krungthai Thanawat Loan Inquiry',
  formDescription = 'Please fill in your information for consideration. We will contact you within 1 business day.',
  submitLabel = 'Submit inquiry',
  className,
  sectionId,
  onSubmit,
}: RequestInformationBlockProps) {
  const [values, setValues] = React.useState<RequestInformationFormValues>(INITIAL_VALUES)
  const [touched, setTouched] = React.useState<TouchedMap>(EMPTY_TOUCHED)
  const [submitted, setSubmitted] = React.useState(false)

  const errors = React.useMemo(() => validate(values), [values])
  const isFormValid = Object.values(errors).every((message) => !message)

  const handleChange =
    (field: keyof RequestInformationFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value
      const nextValue =
        field === 'phone' ? rawValue.replace(/[^\d]/g, '').slice(0, 10) : rawValue
      setValues((prev) => ({ ...prev, [field]: nextValue }))
    }

  const handleBlur = (field: keyof RequestInformationFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const showError = (field: keyof RequestInformationFormValues) =>
    (touched[field] || submitted) && !!errors[field]

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    })

    if (!isFormValid) return

    trackOptimizelyEvent(OPTIMIZELY_WEB_EVENTS.FORM_SUBMIT, {
      formId: 'request-information',
    })
    onSubmit?.(values)
  }

  return (
    <section
      id={sectionId}
      className={clsx('request-information', className)}
      aria-label="Request information form"
    >
      <h2 className="request-information__title type-heading-h3">{title}</h2>

      <div className="request-information__card">
        <div className="request-information__header">
          <p className="request-information__form-title type-body-large-regular">
            {formTitle}
          </p>
          <div className="request-information__form-desc type-body-small-regular">
            {formDescription}
          </div>
        </div>

        <form
          className="request-information__form"
          onSubmit={onFormSubmit}
          onFocusCapture={() => trackFormStartOnce({ formId: 'request-information' })}
          noValidate
        >
          <div className="request-information__grid">
            <label className="request-information__field">
              <span className="request-information__label type-label-default">
                First name *
              </span>
              <input
                className={clsx(
                  'request-information__input type-body-base-regular',
                  showError('firstName') && 'request-information__input--error'
                )}
                value={values.firstName}
                onChange={handleChange('firstName')}
                onBlur={() => handleBlur('firstName')}
                placeholder="Enter first name"
                autoComplete="given-name"
                required
              />
              {showError('firstName') ? (
                <span className="request-information__error type-body-small-regular">
                  {errors.firstName}
                </span>
              ) : null}
            </label>

            <label className="request-information__field">
              <span className="request-information__label type-label-default">
                Last name *
              </span>
              <input
                className={clsx(
                  'request-information__input type-body-base-regular',
                  showError('lastName') && 'request-information__input--error'
                )}
                value={values.lastName}
                onChange={handleChange('lastName')}
                onBlur={() => handleBlur('lastName')}
                placeholder="Enter last name"
                autoComplete="family-name"
                required
              />
              {showError('lastName') ? (
                <span className="request-information__error type-body-small-regular">
                  {errors.lastName}
                </span>
              ) : null}
            </label>

            <label className="request-information__field">
              <span className="request-information__label type-label-default">
                Email address *
              </span>
              <input
                type="email"
                className={clsx(
                  'request-information__input type-body-base-regular',
                  showError('email') && 'request-information__input--error'
                )}
                value={values.email}
                onChange={handleChange('email')}
                onBlur={() => handleBlur('email')}
                placeholder="Enter email address"
                autoComplete="email"
                required
              />
              {showError('email') ? (
                <span className="request-information__error type-body-small-regular">
                  {errors.email}
                </span>
              ) : null}
            </label>

            <label className="request-information__field">
              <span className="request-information__label type-label-default">
                Phone number *
              </span>
              <input
                inputMode="numeric"
                pattern="\d{10}"
                maxLength={10}
                className={clsx(
                  'request-information__input type-body-base-regular',
                  showError('phone') && 'request-information__input--error'
                )}
                value={values.phone}
                onChange={handleChange('phone')}
                onBlur={() => handleBlur('phone')}
                placeholder="Enter phone number"
                autoComplete="tel"
                required
              />
              {showError('phone') ? (
                <span className="request-information__error type-body-small-regular">
                  {errors.phone}
                </span>
              ) : null}
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="request-information__submit-btn"
            disabled={!isFormValid}
          >
            {submitLabel}
          </Button>
        </form>
      </div>
    </section>
  )
}

type CmsRequestInformationProps = Omit<
  RequestInformationBlockFragmentFragment,
  '__typename'
>

export default function RequestInformationBlock(
  props: CmsRequestInformationProps
) {
  const html = props.FormDescription?.html?.trim()
  const formDescription = html ? (
    <span
      className="request-information__form-desc-cms"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : undefined

  return (
    <RequestInformationBlockFE
      title={props.Title ?? undefined}
      formTitle={props.FormTitle ?? undefined}
      formDescription={formDescription}
      submitLabel={props.SubmitLabel ?? undefined}
    />
  )
}
