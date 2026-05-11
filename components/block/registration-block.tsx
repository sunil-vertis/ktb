'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

type RegistrationStep = 1 | 2 | 3
type CustomerType = 'individual' | 'legal_entity'

type StepOneFields = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type StepTwoFields = {
  nationalId: string
  customerType: CustomerType
  province: string
  district: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\d{10}$/

const INITIAL_STEP_ONE: StepOneFields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

const INITIAL_STEP_TWO: StepTwoFields = {
  nationalId: '',
  customerType: 'individual',
  province: '',
  district: '',
}

const PROVINCE_DISTRICT_DATA: Record<string, string[]> = {
  Bangkok: ['Silom', 'Sathon', 'Chatuchak'],
  'Chiang Mai': ['Mueang Chiang Mai', 'Nimman', 'San Sai'],
  Phuket: ['Mueang Phuket', 'Kathu', 'Thalang'],
}

function isStepOneValid(fields: StepOneFields): boolean {
  return (
    fields.firstName.trim().length > 0 &&
    fields.lastName.trim().length > 0 &&
    EMAIL_PATTERN.test(fields.email.trim()) &&
    PHONE_PATTERN.test(fields.phone.trim())
  )
}

function formatNationalId(rawDigits: string): string {
  const digits = rawDigits.replace(/\D/g, '').slice(0, 13)
  const groups = [1, 4, 5, 2, 1]
  const parts: string[] = []
  let cursor = 0

  groups.forEach((size) => {
    const part = digits.slice(cursor, cursor + size)
    if (part) parts.push(part)
    cursor += size
  })

  return parts.join(' ')
}

function isValidThaiNationalId(formattedNationalId: string): boolean {
  const digits = formattedNationalId.replace(/\D/g, '')
  return /^\d{13}$/.test(digits)
}

export default function RegistrationBlock() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [stepOne, setStepOne] = useState<StepOneFields>(INITIAL_STEP_ONE)
  const [stepTwo, setStepTwo] = useState<StepTwoFields>(INITIAL_STEP_TWO)
  const [touchedStepOne, setTouchedStepOne] = useState<Record<keyof StepOneFields, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  })
  const [touchedStepTwo, setTouchedStepTwo] = useState<Record<keyof StepTwoFields, boolean>>({
    nationalId: false,
    customerType: false,
    province: false,
    district: false,
  })
  const [isSubmittingStepTwo, setIsSubmittingStepTwo] = useState(false)

  const emailInvalid =
    touchedStepOne.email &&
    stepOne.email.trim().length > 0 &&
    !EMAIL_PATTERN.test(stepOne.email.trim())
  const phoneInvalid =
    touchedStepOne.phone &&
    stepOne.phone.trim().length > 0 &&
    !PHONE_PATTERN.test(stepOne.phone.trim())
  const canContinueStepOne = useMemo(() => isStepOneValid(stepOne), [stepOne])

  const districtOptions = stepTwo.province ? PROVINCE_DISTRICT_DATA[stepTwo.province] ?? [] : []
  const nationalIdHasValue = stepTwo.nationalId.replace(/\D/g, '').length > 0
  const nationalIdValid = isValidThaiNationalId(stepTwo.nationalId)
  const showNationalIdError = touchedStepTwo.nationalId && nationalIdHasValue && !nationalIdValid
  const showNationalIdSuccess = touchedStepTwo.nationalId && nationalIdHasValue && nationalIdValid
  const districtDisabled = !stepTwo.province
  const canSubmitStepTwo =
    nationalIdValid &&
    stepTwo.customerType.trim().length > 0 &&
    stepTwo.province.trim().length > 0 &&
    stepTwo.district.trim().length > 0

  const onContinue = () => {
    if (currentStep === 1) {
      setTouchedStepOne({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      })
      if (!canContinueStepOne) return
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      setTouchedStepTwo({
        nationalId: true,
        customerType: true,
        province: true,
        district: true,
      })
      if (!canSubmitStepTwo) return
      setIsSubmittingStepTwo(true)
      setTimeout(() => {
        setCurrentStep(3)
        setIsSubmittingStepTwo(false)
      }, 1200)
    }
  }

  const onStepClick = (step: RegistrationStep) => {
    if (step <= currentStep) setCurrentStep(step)
  }

  return (
    <section className="registration-block">
      <div className="registration-block__container">
        <nav className="registration-block__stepper" aria-label="Registration steps">
          {[1, 2, 3].map((stepNumber) => {
            const step = stepNumber as RegistrationStep
            const isCurrent = currentStep === step
            const isDone = currentStep > step
            const isConfirmationComplete = currentStep === 3 && step === 3
            const isInteractive = step <= currentStep
            const lineClass =
              currentStep > stepNumber
                ? 'registration-block__step-line--done'
                : currentStep === stepNumber
                  ? 'registration-block__step-line--current'
                  : ''

            return (
              <div key={stepNumber} className="registration-block__stepper-item">
                <button
                  type="button"
                  className={`registration-block__step-circle ${isCurrent && !isConfirmationComplete ? 'registration-block__step-circle--current' : ''} ${
                    isDone || isConfirmationComplete ? 'registration-block__step-circle--done' : ''
                  }`}
                  onClick={() => onStepClick(step)}
                  disabled={!isInteractive}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${stepNumber}`}
                >
                  {stepNumber}
                </button>
                <span
                  className={`registration-block__step-label ${isCurrent && !isConfirmationComplete ? 'registration-block__step-label--current' : ''} ${
                    isDone || isConfirmationComplete ? 'registration-block__step-label--done' : ''
                  }`}
                >
                  {stepNumber === 1
                    ? 'Personal details'
                    : stepNumber === 2
                      ? 'Identity & Location'
                      : 'Confirmation'}
                </span>
                {stepNumber < 3 ? (
                  <span className={`registration-block__step-line ${lineClass}`} />
                ) : null}
              </div>
            )
          })}
        </nav>

        <div
          className={`registration-block__card ${
            currentStep === 3 ? 'registration-block__card--plain' : ''
          }`}
        >
          {currentStep === 1 ? (
            <>
              <div className="registration-block__title-wrap">
                <h2 className="registration-block__title">Personal details</h2>
                <p className="registration-block__subtitle">*All fields are required.</p>
              </div>

              <div className="registration-block__form-fields">
                <div className="registration-block__name-row">
                  <div className="registration-block__field">
                    <label className="registration-block__label" htmlFor="firstName">
                      First name *
                    </label>
                    <input
                      id="firstName"
                      className="registration-block__input"
                      placeholder="Enter first name"
                      value={stepOne.firstName}
                      onBlur={() =>
                        setTouchedStepOne((prev) => ({ ...prev, firstName: true }))
                      }
                      onChange={(event) =>
                        setStepOne((prev) => ({ ...prev, firstName: event.target.value }))
                      }
                    />
                  </div>
                  <div className="registration-block__field">
                    <label className="registration-block__label" htmlFor="lastName">
                      Last name *
                    </label>
                    <input
                      id="lastName"
                      className="registration-block__input"
                      placeholder="Enter last name"
                      value={stepOne.lastName}
                      onBlur={() =>
                        setTouchedStepOne((prev) => ({ ...prev, lastName: true }))
                      }
                      onChange={(event) =>
                        setStepOne((prev) => ({ ...prev, lastName: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="registration-block__name-row">
                  <div className="registration-block__field">
                    <label className="registration-block__label" htmlFor="email">
                      Email address *
                    </label>
                    <input
                      id="email"
                      className={`registration-block__input ${emailInvalid ? 'registration-block__input--error' : ''}`}
                      placeholder="Enter email address"
                      value={stepOne.email}
                      onBlur={() => setTouchedStepOne((prev) => ({ ...prev, email: true }))}
                      onChange={(event) =>
                        setStepOne((prev) => ({ ...prev, email: event.target.value }))
                      }
                    />
                    <p
                      className={`registration-block__helper-text ${emailInvalid ? 'registration-block__helper-text--error' : ''}`}
                    >
                      Enter a valid email address (e.g. name@domain.com)
                    </p>
                  </div>
                  <div className="registration-block__field">
                    <label className="registration-block__label" htmlFor="phone">
                      Phone number *
                    </label>
                    <input
                      id="phone"
                      className={`registration-block__input ${phoneInvalid ? 'registration-block__input--error' : ''}`}
                      placeholder="Enter phone number"
                      value={stepOne.phone}
                      onBlur={() => setTouchedStepOne((prev) => ({ ...prev, phone: true }))}
                      onChange={(event) =>
                        setStepOne((prev) => ({
                          ...prev,
                          phone: event.target.value.replace(/\D/g, '').slice(0, 10),
                        }))
                      }
                    />
                    <p
                      className={`registration-block__helper-text ${phoneInvalid ? 'registration-block__helper-text--error' : ''}`}
                    >
                      10 digits, numeric number only
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                className="registration-block__continue-button"
                disabled={!canContinueStepOne}
                state={!canContinueStepOne ? 'disabled' : 'default'}
                onClick={onContinue}
              >
                Continue
              </Button>
            </>
          ) : currentStep === 2 ? (
            <>
              <div className="registration-block__title-wrap">
                <h2 className="registration-block__title">Identity & location</h2>
                <p className="registration-block__subtitle">*All fields are required.</p>
              </div>

              <div className="registration-block__form-fields registration-block__form-fields--step-two">
                <div className="registration-block__field">
                  <label className="registration-block__label" htmlFor="nationalId">
                    National ID number *
                  </label>
                  <input
                    id="nationalId"
                    className={`registration-block__input ${
                      showNationalIdError ? 'registration-block__input--error' : ''
                    } ${showNationalIdSuccess ? 'registration-block__input--success' : ''}`}
                    placeholder="1 2345 67890 12 3"
                    value={stepTwo.nationalId}
                    onBlur={() =>
                      setTouchedStepTwo((prev) => ({ ...prev, nationalId: true }))
                    }
                    onChange={(event) =>
                      setStepTwo((prev) => ({
                        ...prev,
                        nationalId: formatNationalId(event.target.value),
                      }))
                    }
                  />
                  <p
                    className={`registration-block__helper-text ${
                      showNationalIdError
                        ? 'registration-block__helper-text--error'
                        : showNationalIdSuccess
                          ? 'registration-block__helper-text--success'
                          : ''
                    }`}
                  >
                    {showNationalIdError
                      ? 'Invalid ID. Please check the 13 digits of your Thai national ID.'
                      : showNationalIdSuccess
                        ? 'Valid Thai national ID'
                        : '13 digits of your Thai national ID'}
                  </p>
                </div>

                <div className="registration-block__field">
                  <p className="registration-block__label">Customer type *</p>
                  <div className="registration-block__radio-group">
                    <label className="registration-block__radio-item">
                      <input
                        type="radio"
                        name="customerType"
                        checked={stepTwo.customerType === 'individual'}
                        onChange={() =>
                          setStepTwo((prev) => ({ ...prev, customerType: 'individual' }))
                        }
                      />
                      <span className="registration-block__radio-icon" />
                      <span className="registration-block__radio-label">Individual</span>
                    </label>
                    <label className="registration-block__radio-item">
                      <input
                        type="radio"
                        name="customerType"
                        checked={stepTwo.customerType === 'legal_entity'}
                        onChange={() =>
                          setStepTwo((prev) => ({ ...prev, customerType: 'legal_entity' }))
                        }
                      />
                      <span className="registration-block__radio-icon" />
                      <span className="registration-block__radio-label">Legal entity</span>
                    </label>
                  </div>
                </div>

                <div className="registration-block__field">
                  <label className="registration-block__label" htmlFor="province">
                    Province *
                  </label>
                  <div className="registration-block__select-wrap">
                    <select
                      id="province"
                      className="registration-block__select"
                      value={stepTwo.province}
                      onBlur={() =>
                        setTouchedStepTwo((prev) => ({ ...prev, province: true }))
                      }
                      onChange={(event) => {
                        const province = event.target.value
                        setStepTwo((prev) => ({
                          ...prev,
                          province,
                          district: '',
                        }))
                      }}
                    >
                      <option value="">Select province</option>
                      {Object.keys(PROVINCE_DISTRICT_DATA).map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    <span className="registration-block__select-icon" aria-hidden>
                      v
                    </span>
                  </div>
                </div>

                <div className="registration-block__field">
                  <label
                    className={`registration-block__label ${
                      districtDisabled ? 'registration-block__label--disabled' : ''
                    }`}
                    htmlFor="district"
                  >
                    District *
                  </label>
                  <div className="registration-block__select-wrap">
                    <select
                      id="district"
                      className={`registration-block__select ${
                        districtDisabled ? 'registration-block__select--disabled' : ''
                      }`}
                      value={stepTwo.district}
                      disabled={districtDisabled}
                      onBlur={() =>
                        setTouchedStepTwo((prev) => ({ ...prev, district: true }))
                      }
                      onChange={(event) =>
                        setStepTwo((prev) => ({ ...prev, district: event.target.value }))
                      }
                    >
                      <option value="">Select district</option>
                      {districtOptions.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    <span className="registration-block__select-icon" aria-hidden>
                      v
                    </span>
                  </div>
                  <p className="registration-block__helper-text">
                    Province must be selected before district.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                className="registration-block__continue-button"
                disabled={!canSubmitStepTwo || isSubmittingStepTwo}
                state={!canSubmitStepTwo || isSubmittingStepTwo ? 'disabled' : 'default'}
                onClick={onContinue}
              >
                {isSubmittingStepTwo ? (
                  <span className="registration-block__button-loader-wrap">
                    <span className="registration-block__button-loader" />
                    Submitting...
                  </span>
                ) : (
                  'Submit'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="registration-block__confirmation-card">
                <div className="registration-block__success-circle">
                  <img
                    src="/assets/registration/success-check.svg"
                    alt=""
                    aria-hidden
                    className="registration-block__success-icon"
                  />
                </div>
                <h2 className="registration-block__confirmation-title">Registration complete</h2>
                <p className="registration-block__confirmation-text">
                  Your application has been received. Our team will contact you within 1
                  business day.
                </p>
                <p className="registration-block__reference">Reference no.: KTB-2026-00412</p>
                <Button type="button" hierarchy="secondary" className="registration-block__return-home">
                  <Link href="/">Return to home page</Link>
                </Button>
              </div>

              <div className="registration-block__app-card">
                <img
                  src="/assets/registration/ktb-next-qr.png"
                  alt="Krungthai NEXT QR code"
                  className="registration-block__app-qr"
                />
                <div className="registration-block__app-content">
                  <h3 className="registration-block__app-title">
                    Track you application on Krungthai NEXT
                  </h3>
                  <p className="registration-block__app-text">
                    Get real-time notifications and manage your banking needs in one secure
                    place.
                  </p>
                  <Button type="button" className="registration-block__open-next">
                    Open Krungthai NEXT
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
