'use client'

import {
  isEmailValidator,
  isRequiredValidator,
  registerRequiredField,
  updateFormValue,
  validateFieldValue,
} from '@/lib/forms/utils/validation'

export default function TextboxElement({
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

      <input
        type={isEmailValidator(element.Validators) ? 'email' : 'text'}
        autoComplete={element.AutoComplete ? 'on' : 'off'}
        placeholder={element.Placeholder ?? ''}
        defaultValue={element.PredefinedValue ?? ''}
        required={isRequiredValidator(element.Validators)}
        className={`registration-block__input ${
          fieldError ? 'registration-block__input--error' : ''
        }`}
        onChange={(event) => {
          const value = event.target.value

          updateFormValue({ fieldName, value, formState })

          if (!fieldName) return

          const newErrors = validateFieldValue({
            fieldName,
            value,
            validators: element.Validators,
            errors,
            isEmail: isEmailValidator(element.Validators),
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