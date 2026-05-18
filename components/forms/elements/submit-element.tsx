'use client'

import { useState } from 'react'
import {
  OPTIMIZELY_WEB_EVENTS,
  trackOptimizelyEvent,
} from '@/lib/analytics/optimizely-web-events'
import { Button } from '@/components/ui/button'

export default function SubmitElement({
  element,
  formState,
  errors,
  onSubmitSuccess,
  currentStepRequiredFields = [],
  isLastFormStep,
  formDisplayName,
  onNextStep,
}: {
  element: any
  formState?: Record<string, any>
  errors?: Record<string, string>
  onSubmitSuccess?: (referenceNumber?: string) => void
  currentStepRequiredFields?: string[]
  isLastFormStep?: boolean
  formDisplayName?: string
  onNextStep?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitLabel = element.Label || 'Submit'
  const isContinue = submitLabel.toLowerCase() === 'continue' || submitLabel.toLowerCase() === 'ดำเนินการต่อ'

  const hasErrors = !!errors && Object.keys(errors).length > 0

  const hasMissingRequiredFields = currentStepRequiredFields.some((field) => {
    const value = formState?.[field]
    return value === undefined || value === null || String(value).trim() === ''
  })

  const isDisabled = isSubmitting || hasErrors || hasMissingRequiredFields

  const handleSubmit = async () => {
    if (isDisabled) return

    if (isContinue && !isLastFormStep) {
      onNextStep?.()
      return
    }

    try {
      setIsSubmitting(true)
      const locale = typeof window !== 'undefined' && window.location.pathname.includes('/th/') ? 'th' : 'en'

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: formDisplayName || 'Unknown Form',
          fields: formState,
          locale,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert('Form submission failed.')
        return
      }

      trackOptimizelyEvent(OPTIMIZELY_WEB_EVENTS.FORM_SUBMIT, {
        formName: formDisplayName || 'Unknown Form',
      })
      onSubmitSuccess?.(result.referenceNumber)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Form submission failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      className="registration-block__continue-button"
      disabled={isDisabled}
      state={isDisabled ? 'disabled' : 'default'}
      onClick={handleSubmit}
    >
      {isSubmitting ? (
        <span className="registration-block__button-loader-wrap">
          <span className="registration-block__button-loader" />
          {submitLabel} ...
        </span>
      ) : (
        submitLabel
      )}
    </Button>
  )
}