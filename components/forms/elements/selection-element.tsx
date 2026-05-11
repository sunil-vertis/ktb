'use client'

import { GlobalIcon } from '@/components/ui/global-icon'
import {
  isRequiredValidator,
  registerRequiredField,
} from '@/lib/forms/utils/validation'

const getCmsOptions = (rawOptions: any) => {
  if (Array.isArray(rawOptions)) return rawOptions

  try {
    return JSON.parse(rawOptions || '[]')
  } catch {
    return []
  }
}

const dedupeOptions = (options: any[]) => {
  const seen = new Set<string>()

  return options.filter((option) => {
    const optionLabel =
      option.Label ||
      option.Text ||
      option.label ||
      option.Value ||
      option.value

    const optionValue = option.Value || option.value || optionLabel

    if (!optionValue || seen.has(optionValue)) return false

    seen.add(optionValue)
    return true
  })
}

export default function SelectionElement({
  element,
  formState,
  setFormState,
  locationOptions,
}: {
  element: any
  formState?: Record<string, any>
  setFormState?: React.Dispatch<React.SetStateAction<Record<string, any>>>
  locationOptions?: any[]
}) {
  const fieldName = element.Label ?? ''

  registerRequiredField({
    fieldName,
    validators: element.Validators,
    formState,
  })

  const normalizedFieldName = fieldName.toLowerCase()
  const isProvinceField =
    normalizedFieldName.includes('province') ||
    fieldName.includes('จังหวัด')

  const isDistrictField =
    normalizedFieldName.includes('district') ||
    fieldName.includes('district') ||
    fieldName.includes('เขต') ||
    fieldName.includes('อำเภอ')

  const selectedProvince =
    formState?.Province ||
    formState?.['Province'] ||
    formState?.['จังหวัด']
  const isDistrictDisabled = isDistrictField && !selectedProvince

  const locationOptionsList = locationOptions ?? []
  const normalOptions = getCmsOptions(element.Options)

  const isThaiPage = typeof window !== 'undefined' && window.location.pathname.includes('/th/')
  const isThaiText = (value?: string) => /[\u0E00-\u0E7F]/.test(value || '')
  const localizedLocationOptions = locationOptionsList.filter((option) => {
    const label = option.label || option.value || ''
    return isThaiPage ? isThaiText(label) : !isThaiText(label)
  })
  const selectedProvinceOption = locationOptionsList.find(
    (option) =>
      !option.parentKey &&
      option.value === selectedProvince
  )

  const filteredOptions = dedupeOptions(
    isDistrictField
      ? selectedProvince
        ? localizedLocationOptions.filter((option) => {
            if (selectedProvinceOption?.key) {
              return option.parentKey === selectedProvinceOption.key
            }

            return option.parentValue?.toLowerCase() === selectedProvince.toLowerCase()
          })
        : []
      : isProvinceField
        ? localizedLocationOptions.filter((option) => !option.parentKey)
        : normalOptions
  )
  
  return (
    <div className="registration-block__field">
      <label
        className={`registration-block__label ${
          isDistrictDisabled ? 'registration-block__label--disabled' : ''
        }`}
      >
        {fieldName}{' '}
        {isRequiredValidator(element.Validators) && (
          <span className="form-element-required">*</span>
        )}
      </label>

      <div className="registration-block__select-wrap">
        <select
          value={formState?.[fieldName] || ''}
          disabled={isDistrictDisabled}
          className={`registration-block__select ${
            isDistrictDisabled ? 'registration-block__select--disabled' : ''
          }`}
          onChange={(event) => {
            if (!fieldName) return

            const value = event.target.value

            setFormState?.((prev) => ({
              ...prev,
              [fieldName]: value,
              ...(isProvinceField
                ? {
                    District: '',
                    ['เขต']: '',
                    ['อำเภอ']: '',
                  }
                : {}),
            }))
          }}
        >
          <option value="" disabled>
            {isDistrictDisabled
              ? (
                  typeof window !== 'undefined' &&
                  window.location.pathname.includes('/th/')
                    ? 'กรุณาเลือกจังหวัดก่อน'
                    : 'Select province first'
                )
              : element.Placeholder ||
                (
                  typeof window !== 'undefined' &&
                  window.location.pathname.includes('/th/')
                    ? 'เลือกข้อมูล'
                    : 'Select an option'
                )}
          </option>

          {filteredOptions.map((option: any, index: number) => {
            const optionLabel =
              option.Label ||
              option.Text ||
              option.label ||
              option.Value ||
              option.value

            const optionValue = option.Value || option.value || optionLabel

            return (
              <option key={`${fieldName}-${index}`} value={optionValue}>
                {optionLabel}
              </option>
            )
          })}
        </select>

        <span className="registration-block__select-icon" aria-hidden>
          <GlobalIcon type="chevron-down" size="L" />
        </span>
      </div>

      {element.Tooltip?.trim() && (
        <p className="registration-block__helper-text">{element.Tooltip}</p>
      )}
    </div>
  )
}