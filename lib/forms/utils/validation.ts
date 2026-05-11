export const isRequiredValidator = (validators: any) => {
  if (!validators) return false

  if (Array.isArray(validators)) {
    return validators.some(
      (validator: any) =>
        validator?.type?.toLowerCase() === 'requirevalidator'
    )
  }

  return JSON.stringify(validators).toLowerCase().includes('require')
}

export const isEmailValidator = (validators: any) => {
  if (!validators) return false

  return JSON.stringify(validators).toLowerCase().includes('email')
}

export const getRequiredErrorMessage = (validators: any) => {
  const requiredValidator = validators?.find?.((validator: any) =>
    validator?.type?.toLowerCase().includes('require')
  )

  return (
    requiredValidator?.errorMessage ||
    requiredValidator?.message ||
    'This field is required.'
  )
}

export const getEmailErrorMessage = (validators: any) => {
  const emailValidator = validators?.find?.((validator: any) =>
    validator?.type?.toLowerCase().includes('email')
  )

  return (
    emailValidator?.errorMessage ||
    emailValidator?.message ||
    'Please enter a valid email address.'
  )
}

export const isValidEmailValue = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const getDigitLimit = (tooltip?: string) => {
  if (!tooltip) return null

  const match = tooltip.match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

export const updateFormValue = ({
  fieldName,
  value,
  formState,
}: {
  fieldName: string
  value: any
  formState?: Record<string, any>
}) => {
  if (!formState || !fieldName) return
  formState[fieldName] = value
}

export const validateFieldValue = ({
  fieldName,
  value,
  validators,
  errors,
  isEmail = false,
  digitLimit,
  digitMessage,
}: {
  fieldName: string
  value: any
  validators: any
  errors?: Record<string, string>
  isEmail?: boolean
  digitLimit?: number | null
  digitMessage?: string
}) => {
  const newErrors = { ...(errors || {}) }
  const stringValue = String(value ?? '')

  if (isRequiredValidator(validators) && !stringValue.trim()) {
    newErrors[fieldName] = getRequiredErrorMessage(validators)
  } else if (isEmail && stringValue && !isValidEmailValue(stringValue)) {
    newErrors[fieldName] = getEmailErrorMessage(validators)
  } else if (digitLimit && stringValue.length !== digitLimit) {
    newErrors[fieldName] =
      digitMessage || getRequiredErrorMessage(validators)
  } else {
    delete newErrors[fieldName]
  }

  return newErrors
}

export const registerRequiredField = ({
  fieldName,
  validators,
  formState,
}: {
  fieldName: string
  validators: any
  formState?: Record<string, any>
}) => {
  if (!formState || !fieldName || !isRequiredValidator(validators)) return

  formState.__requiredFields = formState.__requiredFields || []

  if (!formState.__requiredFields.includes(fieldName)) {
    formState.__requiredFields.push(fieldName)
  }
}