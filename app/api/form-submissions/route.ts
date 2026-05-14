import { NextRequest, NextResponse } from 'next/server'
import {
    buildEmailHtml,
    sendEmail,
} from '@/lib/forms/services/mail'
import {
    getEmailTemplates,
    saveSubmission,
} from '@/lib/forms/services/submissions'
import { generateReferenceNumber } from '@/lib/forms/utils/reference'

const getCustomerEmail = (fields: Record<string, any>) => {
  return (
    fields['Email address'] ||
    fields['Email'] ||
    fields['email'] ||
    fields['EmailAddress'] ||
    fields['emailAddress'] ||
    fields['ที่อยู่อีเมล'] ||
    ''
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formName, fields, locale } = body

    if (!formName || !fields) {
      return NextResponse.json(
        { success: false, message: 'Invalid form submission.' },
        { status: 400 }
      )
    }

    const referenceNumber = generateReferenceNumber()

    const submissionRecord = {
      formName,
      referenceNumber,
      fields: {
        ...fields,
        ReferenceNumber: referenceNumber,
      },
      createdAt: new Date().toISOString(),
    }

    const blobName = await saveSubmission(submissionRecord)
    const templates = await getEmailTemplates(formName, locale)

    const emailResults = []

    if (templates.customer) {
      const customerEmail = getCustomerEmail(fields)
      const fname = fields['First name'] ||
                    fields['FirstName'] ||
                    fields['firstname'] ||
                    fields['name'] ||
                    fields['Name'] ||
                    fields['ชื่อจริง'] ||
                    'Customer'

      let customerEmailBody = templates.customer.EmailBody?.html || ''

      customerEmailBody = customerEmailBody
        .replace(/\{Ref\}/g, referenceNumber)
        .replace(/\{Firstname\}/g, fname)

      if (customerEmail) {
        emailResults.push(
          await sendEmail({
            to: customerEmail,
            from: templates.customer.FromEmail,
            cc: templates.customer.CcEmail,
            subject: templates.customer.Subject || formName,
            html: buildEmailHtml({
              body: customerEmailBody,
              fields,
              referenceNumber,
              locale,
            }),
          })
        )
      }
    }

    let staffEmailBody = templates.staff.EmailBody?.html || ''

    staffEmailBody = staffEmailBody.replace(/\{Ref\}/g, referenceNumber)

    emailResults.push(
      await sendEmail({
        to: templates.staff.ToEmail,
        from: templates.staff.FromEmail,
        cc: templates.staff.CcEmail,
        subject: templates.staff.Subject || formName,
        html: buildEmailHtml({
          body: staffEmailBody,
          fields,
          referenceNumber,
          locale,
        }),
      })
    )

    const hasEmailFailure = emailResults.some((result) => !result.success)

    if (hasEmailFailure) {
      return NextResponse.json(
        {
          success: false,
          message: 'Submission saved, but one or more emails failed.',
          blobName,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
    success: true,
    message: 'Form submitted successfully.',
    blobName,
    referenceNumber,
    emailsSent: emailResults.length,
  })
  } catch (error: any) {
    console.error('Form submission error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Form submission failed.',
        error: error?.response?.body || error?.message,
      },
      { status: 500 }
    )
  }
}