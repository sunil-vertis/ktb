'use client'

import TextboxElement from './elements/textbox-element'
import TextareaElement from './elements/textarea-element'
import NumberElement from './elements/number-element'
import ParagraphElement from './elements/paragraph-element'
import SubmitElement from './elements/submit-element'
import SelectionElement from './elements/selection-element'
import ChoiceElement from './elements/choice-element'

type LocationOption = {
  label: string
  value: string
  parentValue?: string
}

export default function FormFieldRenderer({
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
  const component = node?.component

  const componentTypes = component?._metadata?.types || []
  const componentType =
    componentTypes.find((type: string) => type.startsWith('OptiForms')) ||
    componentTypes.find((type: string) => type === 'ParagraphElement') ||
    component?.__typename

  switch (componentType) {
    case 'OptiFormsTextboxElement':
      return (
        <TextboxElement
          element={component}
          formState={formState}
          errors={errors}
          setErrors={setErrors}
        />
      )

    case 'OptiFormsTextareaElement':
      return (
        <TextareaElement
          element={component}
          formState={formState}
          errors={errors}
          setErrors={setErrors}
        />
      )

    case 'OptiFormsNumberElement':
      return (
        <NumberElement
          element={component}
          formState={formState}
          errors={errors}
          setErrors={setErrors}
        />
      )

    case 'ParagraphElement':
      return <ParagraphElement element={component} />

    case 'OptiFormsSubmitElement':
      return (
        <SubmitElement
          element={component}
          formState={formState}
          errors={errors}
          onSubmitSuccess={onSubmitSuccess}
          currentStepRequiredFields={currentStepRequiredFields}
          isLastFormStep={isLastFormStep}
          onNextStep={onNextStep}
        />
      )

    case 'OptiFormsSelectionElement':
      return (
        <SelectionElement
          element={component}
          formState={formState}
          setFormState={setFormState}
          locationOptions={locationOptions}
        />
      )

    case 'OptiFormsChoiceElement':
      return (
        <ChoiceElement
          element={component}
          formState={formState}
          setFormState={setFormState}
          errors={errors}
        />
      )

    default:
      return (
        <pre className="text-red-500 text-sm">
          Not implemented: {componentType || 'Unknown'}
          {JSON.stringify(component, null, 2)}
        </pre>
      )
  }
}