'use client'

import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { trackFormStartOnce } from '@/lib/analytics/optimizely-web-events'
import { isThaiPath } from '@/lib/utils/locale-from-path'
import CompositionNodeRenderer from '@/components/forms/composition-node-renderer'
import ApplicationCardBlock from '@/components/block/application-card-block'

const decodeHtmlEntities = (value: string) => {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

const stripHtml = (value: string) => {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, '').trim())
}

const extractH2Text = (html: string) => {
  const match = html.match(/<h2[^>]*>(.*?)<\/h2>/i)
  return match ? stripHtml(match[1]) : ''
}

const getComponentType = (node: any) => {
  const component = node?.component
  const types = component?._metadata?.types || []

  return (
    types.find((type: string) => type.startsWith('OptiForms')) ||
    types.find((type: string) => type === 'ParagraphElement') ||
    component?.__typename
  )
}

const getChildNodes = (node: any) => {
  return node?.nodes || node?.rows || node?.columns || node?.elements || []
}

const hasContinueSubmit = (node: any): boolean => {
  const componentType = getComponentType(node)
  const label = node?.component?.Label || ''

  if (
    componentType === 'OptiFormsSubmitElement' &&
    label.toLowerCase() === 'continue' || label.toLowerCase() === 'ดำเนินการต่อ'
  ) {
    return true
  }

  return getChildNodes(node).some(hasContinueSubmit)
}

const splitNodesIntoSteps = (nodes: any[]) => {
  const steps: any[][] = [[]]

  nodes.forEach((node) => {
    steps[steps.length - 1].push(node)

    if (hasContinueSubmit(node)) {
      steps.push([])
    }
  })

  return steps.filter((step) => step.length > 0)
}

const getStepTitleFromStep = (stepNodes: any[]) => {
  let title = ''

  const walk = (items: any[]) => {
    for (const node of items) {
      const componentType = getComponentType(node)

      if (componentType === 'ParagraphElement') {
        const html = node?.component?.Text?.html || ''
        const h2Text = extractH2Text(html)

        if (h2Text) {
          title = h2Text
          return
        }
      }

      const children = getChildNodes(node)

      if (children.length) {
        walk(children)
        if (title) return
      }
    }
  }

  walk(stepNodes)

  return title
}

const getRegisteredRequiredFields = (stepNodes: any[]) => {
  const requiredFields: string[] = []

  const walk = (items: any[]) => {
    items.forEach((node) => {
      const component = node?.component
      const componentType = getComponentType(node)
      const fieldName = component?.Label || ''

      const isFormField =
        componentType &&
        componentType !== 'ParagraphElement' &&
        componentType !== 'OptiFormsSubmitElement'

      const isRequired = component?.Validators?.some?.((validator: any) =>
        String(validator?.type || validator?.Type || validator?.name || '')
          .toLowerCase()
          .includes('require')
      )

      if (isFormField && fieldName && isRequired) {
        requiredFields.push(fieldName)
      }

      const children = getChildNodes(node)

      if (children.length) {
        walk(children)
      }
    })
  }

  walk(stepNodes)

  return requiredFields
}

const normalizeNodesForStepSplitting = (items: any[]) => {
  let normalized = items

  while (
    normalized.length === 1 &&
    !normalized[0]?.component &&
    getChildNodes(normalized[0]).length > 0
  ) {
    normalized = getChildNodes(normalized[0])
  }

  return normalized
}

export default function OptimizelyFormRenderer(props: any) {
  const pathname = usePathname()
  const [formState, setFormState] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const rawNodes = props?.rows || props?.nodes || props?.elements || []

  const nodes = normalizeNodesForStepSplitting(rawNodes)

  const formSteps = useMemo(() => splitNodesIntoSteps(nodes), [nodes])
  const currentStepNodes = formSteps[currentStepIndex] || []

  const currentStepRequiredFields = useMemo(() => {
    return getRegisteredRequiredFields(currentStepNodes)
  }, [currentStepNodes])

  const hasMultiStep = useMemo(() => {
    return nodes.some(hasContinueSubmit)
  }, [nodes])

  const stepTitles = useMemo(() => {
    if (!hasMultiStep) return []

    const titles = formSteps.map((step, index) => {
      const title = getStepTitleFromStep(step)

      return title || `Step ${index + 1}`
    })

    return [...titles, isThaiPath(pathname) ? 'ยืนยันข้อมูล' : 'Confirmation']
  }, [hasMultiStep, formSteps, pathname])

  const rawConfirmationMessage =
    props?.SubmitConfirmationMessage ||
    props?.submitConfirmationMessage ||
    'Registration complete.'

  const [referenceNumber, setReferenceNumber] = useState('')
  const confirmationMessage = rawConfirmationMessage.replace(/\{Ref\}/g, referenceNumber)
  const isLastFormStep = currentStepIndex === formSteps.length - 1

  if (isSubmitted) {
    return (
      <section className="registration-block">
        <div className="registration-block__container">
          {props.Title && (<h2 className="personal-loan-calculator__title type-heading-h3">{props.Title}</h2>)}
          {props.Description && (<p className="personal-loan-calculator__subtitle type-body-base-regular">{props.Description}</p>)}
          <StepIndicator currentStep={stepTitles.length} steps={stepTitles} />
          <div className="registration-block__card registration-block__card--plain">
            <div className="registration-block__confirmation-card">
              <div className="registration-block__success-circle">
                  <img
                    src="/assets/registration/success-check.svg"
                    alt=""
                    aria-hidden
                    className="registration-block__success-icon"
                  />
              </div>
              <div
                className="registration-block__confirmation-text"
                dangerouslySetInnerHTML={{
                  __html: confirmationMessage.replace(/\n/g, '<br />'),
                }}
              />
            </div>
            {props?.ShowThisPromotion && props?.PromotionBlock && (
              <div className="registration-block__promotion">
                <ApplicationCardBlock {...props.PromotionBlock} />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="registration-block">
      <div className="registration-block__container">
        {props.Title && (<h2 className="personal-loan-calculator__title type-heading-h3">{props.Title}</h2>)}
        {props.Description && (<p className="personal-loan-calculator__subtitle type-body-base-regular">{props.Description}</p>)}
        <StepIndicator currentStep={currentStepIndex + 1} steps={stepTitles} />
        <div className="registration-block__card">
          <form
            className="registration-block__form-fields"
            onFocusCapture={() =>
              trackFormStartOnce({
                formId: props?.displayName || props?.key || 'optimizely-form',
              })
            }
          >
            {currentStepNodes.map((node: any, index: number) => (
              <CompositionNodeRenderer
                key={node.key || index}
                node={node}
                formState={formState}
                setFormState={setFormState}
                errors={errors}
                setErrors={setErrors}
                locationOptions={props.locationOptions}
                currentStepRequiredFields={currentStepRequiredFields}
                isLastFormStep={isLastFormStep}
                formDisplayName={props?.displayName}
                onNextStep={() => setCurrentStepIndex((prev) => prev + 1)}
                onSubmitSuccess={(ref) => {
                  setReferenceNumber(ref || '')
                  setIsSubmitted(true)
                }}
              />
            ))}
          </form>
        </div>
      </div>
    </section>
  )
}

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number
  steps: string[]
}) {
  return (
    <nav className="registration-block__stepper" aria-label="Registration steps">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isCurrent = currentStep === stepNumber
        const isDone = currentStep > stepNumber
        const isLast = stepNumber === steps.length
        const isConfirmationComplete = currentStep === steps.length && isLast

        return (
          <div key={`${label}-${stepNumber}`} className="registration-block__stepper-item">
            <button
              type="button"
              className={`registration-block__step-circle ${
                isCurrent && !isConfirmationComplete
                  ? 'registration-block__step-circle--current'
                  : ''
              } ${
                isDone || isConfirmationComplete
                  ? 'registration-block__step-circle--done'
                  : ''
              }`}
              disabled
              aria-current={isCurrent ? 'step' : undefined}
            >
              {stepNumber}
            </button>

            <span
              className={`registration-block__step-label ${
                isCurrent && !isConfirmationComplete
                  ? 'registration-block__step-label--current'
                  : ''
              } ${
                isDone || isConfirmationComplete
                  ? 'registration-block__step-label--done'
                  : ''
              }`}
            >
              {label}
            </span>

            {!isLast && (
              <span
                className={`registration-block__step-line ${
                  currentStep > stepNumber
                    ? 'registration-block__step-line--done'
                    : currentStep === stepNumber
                      ? 'registration-block__step-line--current'
                      : ''
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}