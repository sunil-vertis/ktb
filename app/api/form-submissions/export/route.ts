import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getAllSubmissions } from '@/lib/forms/services/submissions'

const escapeCsvValue = (value: unknown) => {
  const stringValue = String(value ?? '')
  return `"${stringValue.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!process.env.FORM_EXPORT_SECRET || token !== process.env.FORM_EXPORT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const format = request.nextUrl.searchParams.get('format') || 'csv'
    const formName = request.nextUrl.searchParams.get('formName')
    const from = request.nextUrl.searchParams.get('from')
    const to = request.nextUrl.searchParams.get('to')

    const submissions = await getAllSubmissions()

    const filteredSubmissions = submissions.filter((submission) => {
      const createdAt = submission.createdAt ? new Date(submission.createdAt) : null

      if (!createdAt || Number.isNaN(createdAt.getTime())) return false

      const matchesForm = !formName || submission.formName === formName
      const matchesFrom = !from || createdAt >= new Date(`${from}T00:00:00`)
      const matchesTo = !to || createdAt <= new Date(`${to}T23:59:59`)

      return matchesForm && matchesFrom && matchesTo
    })

    if (!filteredSubmissions.length) {
      return NextResponse.json(
        {
          success: false,
          message: 'No records found for the selected filters.',
        },
        { status: 404 }
      )
    }

    const headers = Array.from(
      new Set(
        filteredSubmissions.flatMap((submission) =>
          Object.keys(submission.fields || {})
        )
      )
    )

    if (format === 'excel') {
      const excelRows = filteredSubmissions.map((submission) => {
        const row: Record<string, any> = {
          Date: submission.createdAt,
          'Form Name': submission.formName,
        }

        headers.forEach((header) => {
          row[header] = submission.fields?.[header] ?? ''
        })

        return row
      })

      const worksheet = XLSX.utils.json_to_sheet(excelRows)
      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions')

      const buffer = XLSX.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      })

      return new NextResponse(buffer, {
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="form-submissions-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx"`,
          'Cache-Control': 'no-store',
        },
      })
    }

    const rows = [
      ['Date', 'Form Name', ...headers].map(escapeCsvValue).join(','),
      ...filteredSubmissions.map((submission) =>
        [
          submission.createdAt,
          submission.formName,
          ...headers.map((header) => submission.fields?.[header] ?? ''),
        ]
          .map(escapeCsvValue)
          .join(',')
      ),
    ]

    const csv = rows.join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="form-submissions-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error: any) {
    console.error('Export submissions error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to export submissions.',
      },
      { status: 500 }
    )
  }
}