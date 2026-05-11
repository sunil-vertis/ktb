'use client'

import {
  isRequiredValidator,
  registerRequiredField,
  updateFormValue,
  validateFieldValue,
} from '@/lib/forms/utils/validation'

const getDigitLimit = (tooltip?: string) => {
  if (!tooltip) return null
  const match = tooltip.match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

export default function NumberElement({
  element,
  formState,
  errors,
  setErrors,
}: {
  element: any
  formState?: Record<string, any>
  errors?: Record<string, string>
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const fieldName = element.Label ?? ''
  const fieldError = fieldName ? errors?.[fieldName] : undefined
  const digitLimit = getDigitLimit(element.Tooltip)

  registerRequiredField({
    fieldName,
    validators: element.Validators,
    formState,
  })

  return (
    <div className="registration-block__field">
      <label className="registration-block__label">
        {fieldName}{' '}
        {isRequiredValidator(element.Validators) && (
          <span className="form-element-required">*</span>
        )}
      </label>

      <input
        type="text"
        inputMode="numeric"
        pattern={digitLimit ? `[0-9]{${digitLimit}}` : '[0-9]*'}
        maxLength={digitLimit || undefined}
        placeholder={element.Placeholder ?? ''}
        defaultValue={element.PredefinedValue ?? ''}
        className={`registration-block__input ${
          fieldError ? 'registration-block__input--error' : ''
        }`}
        onChange={(event) => {
          const value = event.target.value.replace(/\D/g, '')
          event.target.value = value

          updateFormValue({ fieldName, value, formState })

          if (!fieldName) return

          const newErrors = validateFieldValue({
            fieldName,
            value,
            validators: element.Validators,
            errors,
            digitLimit,
            digitMessage: element.Tooltip?.trim(),
          })

          setErrors?.(newErrors)
        }}
      />

      {fieldError ? (
        <p className="registration-block__helper-text registration-block__helper-text--error">
          {fieldError}
        </p>
      ) : (
        element.Tooltip?.trim() && (
          <p className="registration-block__helper-text">{element.Tooltip}</p>
        )
      )}
    </div>
  )
}