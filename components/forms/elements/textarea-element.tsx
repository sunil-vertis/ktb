'use client'

import {
  isRequiredValidator,
  registerRequiredField,
  updateFormValue,
  validateFieldValue,
  isRegexValidator,
  getRegexPattern,
} from '@/lib/forms/utils/validation'

export default function TextareaElement({
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

  registerRequiredField({
    fieldName,
    validators: element.Validators,
    formState,
  })

  const fieldError = fieldName ? errors?.[fieldName] : undefined

  return (
    <div className="registration-block__field">
      <label className="registration-block__label">
        {fieldName}{' '}
        {isRequiredValidator(element.Validators) && (
          <span className="form-element-required">*</span>
        )}
      </label>

      <textarea
        autoComplete={element.AutoComplete ? 'on' : 'off'}
        placeholder={element.Placeholder ?? ''}
        defaultValue={element.PredefinedValue ?? ''}
        className={`registration-block__input ${
          fieldError ? 'registration-block__input--error' : ''
        }`}
        onChange={(event) => {
          const value = event.target.value

          updateFormValue({ fieldName, value, formState })

          if (!fieldName) return

          setErrors?.((prevErrors) =>
            validateFieldValue({
              fieldName,
              value,
              validators: element.Validators,
              errors: prevErrors,
              isRegex: isRegexValidator(element.Validators),
              regexPattern: getRegexPattern(element.Validators),
            })
          )
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