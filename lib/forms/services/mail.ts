import sgMail from '@sendgrid/mail'
import fs from 'fs'
import path from 'path'

export function initSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    console.error('SendGrid config missing', {
      hasApiKey: !!apiKey,
      hasFromEmail: !!fromEmail,
    })

    return {
      success: false,
      error: 'Email service not configured',
    }
  }

  sgMail.setApiKey(apiKey)

  return {
    success: true,
    fromEmail,
  }
}

const parseEmails = (value?: string) => {
  return (value || '')
    .split(/[;,]/)
    .map((email) => email.trim())
    .filter(Boolean)
}

export function buildEmailHtml({
  body,
  fields,
  referenceNumber,
  locale,
}: {
  body?: string
  fields: Record<string, any>
  referenceNumber: string
  locale?: string
}) {
  const isThai = locale === 'th' || locale === 'th-TH'

  const templatePath = path.join(
    process.cwd(),
    'lib',
    'forms',
    'templates',
    isThai ? 'base-template-th.html' : 'base-template.html'
  )

  let html = fs.readFileSync(templatePath, 'utf8')

  const emailBodyHtml = body || ''

  const fieldsHtml = `
    <tr>
    <td align="center" style="padding:0 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; max-width:560px; background-color:#f7f7f7;">
          <tr>
            <td style="padding:24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:'Prompt', Arial, Helvetica, sans-serif; font-size:20px; font-weight:500; line-height:1.3; color:#002533;">
                    ${isThai ? 'รายละเอียดที่ส่ง:' : 'Submitted details:'}
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:24px; line-height:24px; font-size:0;">&nbsp;</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:'Prompt', Arial, Helvetica, sans-serif; font-size:16px; line-height:1.6; color:#002533;">
                ${Object.entries(fields)
                .filter(([_, value]) =>
                    value !== '' &&
                    value !== null &&
                    value !== undefined
                )
                .filter(([key]) => !key.startsWith('__'))
                .map(
                  ([key, value]) => `
                    <tr>
                      <td width="200" valign="top" style="width:200px; padding:0 0 8px 0; font-weight:500; font-size:16px; line-height:1.6; color:#002533;">
                        ${key}:
                      </td>
                      <td width="20" style="width:20px; font-size:0; line-height:0;">&nbsp;</td>
                      <td valign="top" style="padding:0 0 8px 0; font-weight:400; font-size:16px; line-height:1.6; color:#002533;">
                        ${String(value ?? '')}
                      </td>
                    </tr>
                  `
                )
                .join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `

  html = html.replace(
    '{EmailBody}',
    `
      <div
        style="
          font-family:'Prompt', Arial, Helvetica, sans-serif;
          font-size:16px;
          font-weight:400;
          line-height:1.6;
          color:#002533;
        "
      >
        ${emailBodyHtml}
      </div>
    `
  )

  html = html.replace(
    '{SubmissionDetails}',
    fieldsHtml
  )

  return html
}

export async function sendEmail({
  to,
  from,
  cc,
  subject,
  html,
}: {
  to: string | string[]
  from?: string
  cc?: string
  subject: string
  html: string
}) {
  const config = initSendGrid()

  if (!config.success) {
    return config
  }

  try {
    await sgMail.send({
      to: Array.isArray(to) ? to : parseEmails(to),
      from: from || config.fromEmail!,
      cc: parseEmails(cc),
      subject,
      html,
    })

    return { success: true }
  } catch (error: any) {
    console.error('SendGrid error:', error?.response?.body || error)

    return {
      success: false,
      error: 'Failed to send email',
    }
  }
}