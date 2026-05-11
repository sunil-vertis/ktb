'use client'

import FormFieldRenderer from './form-field-renderer'

type LocationOption = {
  label: string
  value: string
  parentValue?: string
}

export default function CompositionNodeRenderer({
  node,
  formState,
  setFormState,
  errors,
  setErrors,
  locationOptions = [],
  onSubmitSuccess,
  currentStepRequiredFields = [],
  isLastFormStep,
  onNextStep,
}: {
  node: any
  formState?: Record<string, any>
  setFormState?: React.Dispatch<React.SetStateAction<Record<string, any>>>
  errors?: Record<string, string>
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>
  locationOptions?: LocationOption[]
  onSubmitSuccess?: (referenceNumber?: string) => void
  currentStepRequiredFields?: string[]
  isLastFormStep?: boolean
  onNextStep?: () => void
}) {
  if (!node) return null

  const childNodes =
    node.nodes || node.rows || node.columns || node.elements || []

  if (node.component) {
    return (
      <div data-epi-block-id={node.key}>
        <FormFieldRenderer
          node={node}
          formState={formState}
          setFormState={setFormState}
          errors={errors}
          setErrors={setErrors}
          locationOptions={locationOptions}
          onSubmitSuccess={onSubmitSuccess}
          currentStepRequiredFields={currentStepRequiredFields}
          isLastFormStep={isLastFormStep}
          onNextStep={onNextStep}
        />
      </div>
    )
  }

  const normalizedNodeType = node.nodeType || node.displayName?.toLowerCase()
  const columnCount = normalizedNodeType === 'row' ? childNodes.length : 0

  const className =
    normalizedNodeType === 'row'
      ? columnCount > 1
        ? 'registration-block__name-row'
        : 'registration-block__form-fields'
      : normalizedNodeType === 'column'
        ? 'registration-block__column'
        : 'registration-block__form-fields'

  return (
    <div className={className} data-epi-block-id={node.key}>
      {childNodes.map((childNode: any) => (
        <CompositionNodeRenderer
          key={childNode.key}
          node={childNode}
          formState={formState}
          setFormState={setFormState}
          errors={errors}
          setErrors={setErrors}
          locationOptions={locationOptions}
          onSubmitSuccess={onSubmitSuccess}
          currentStepRequiredFields={currentStepRequiredFields}
          isLastFormStep={isLastFormStep}
          onNextStep={onNextStep}
        />
      ))}
    </div>
  )
}