'use client'

import { useEffect } from 'react'
import {
  isRequiredValidator,
  registerRequiredField,
} from '@/lib/forms/utils/validation'

const parseOptions = (options: any) => {
  if (Array.isArray(options)) return options

  try {
    return JSON.parse(options || '[]')
  } catch {
    return []
  }
}

export default function ChoiceElement({
  element,
  formState,
  setFormState,
  errors,
}: {
  element: any
  formState?: Record<string, any>
  setFormState?: React.Dispatch<React.SetStateAction<Record<string, any>>>
  errors?: Record<string, string>
}) {
  const options = parseOptions(element.Options)
  const fieldName = element.Label ?? ''
  const allowMultiSelect = Boolean(element.AllowMultiSelect)

  registerRequiredField({
    fieldName,
    validators: element.Validators,
    formState,
  })

  useEffect(() => {
    if (!fieldName || !setFormState) return

    const selectedOptions = options.filter((option: any) =>
      Boolean(
        option.Preselected ||
          option.PreSelected ||
          option.Selected ||
          option.selected ||
          option.preselected
      )
    )

    if (selectedOptions.length === 0) return

    setFormState((prev) => {
      if (prev[fieldName]) return prev

      const selectedValues = selectedOptions.map((option: any) => {
        const optionLabel =
          option.Label ||
          option.Text ||
          option.label ||
          option.Value ||
          option.value

        return option.Value || option.value || optionLabel
      })

      return {
        ...prev,
        [fieldName]: allowMultiSelect ? selectedValues : selectedValues[0],
      }
    })
  }, [fieldName, allowMultiSelect, setFormState, options])

  return (
    <div className="registration-block__field">
      <p className="registration-block__label">
        {fieldName}{' '}
        {isRequiredValidator(element.Validators) && (
          <span className="form-element-required">*</span>
        )}
      </p>

      <div className="registration-block__radio-group">
        {options.map((option: any, index: number) => {
          const optionLabel =
            option.Label ||
            option.Text ||
            option.label ||
            option.Value ||
            option.value

          const optionValue = option.Value || option.value || optionLabel

          const isPreSelected =
            option.Preselected ||
            option.PreSelected ||
            option.Selected ||
            option.selected ||
            option.preselected

          return (
            <label
              key={`${fieldName}-${index}`}
              className="registration-block__radio-item"
            >
              <input
                type={allowMultiSelect ? 'checkbox' : 'radio'}
                name={fieldName}
                value={optionValue}
                defaultChecked={isPreSelected}
                onChange={(event) => {
                  if (!fieldName) return

                  setFormState?.((prev) => {
                    if (allowMultiSelect) {
                      const currentValues = Array.isArray(prev[fieldName])
                        ? prev[fieldName]
                        : []

                      return {
                        ...prev,
                        [fieldName]: event.target.checked
                          ? [...currentValues, optionValue]
                          : currentValues.filter(
                              (value: string) => value !== optionValue
                            ),
                      }
                    }

                    return {
                      ...prev,
                      [fieldName]: optionValue,
                    }
                  })
                }}
              />

              <span className="registration-block__radio-icon" />
              <span className="registration-block__radio-label">
                {optionLabel}
              </span>
            </label>
          )
        })}
      </div>

      {element.Tooltip?.trim() && (
        <p className="registration-block__helper-text">{element.Tooltip}</p>
      )}

      {fieldName && errors?.[fieldName] && (
        <p className="registration-block__helper-text registration-block__helper-text--error">
          {errors[fieldName]}
        </p>
      )}
    </div>
  )
}