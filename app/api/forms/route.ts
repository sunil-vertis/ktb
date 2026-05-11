import { NextRequest, NextResponse } from 'next/server'
import { GetFormsDocument } from '@/lib/optimizely/types/generated'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!process.env.FORM_EXPORT_SECRET || token !== process.env.FORM_EXPORT_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 }
    )
  }

  const response = await fetch(
    `${process.env.OPTIMIZELY_API_URL}?auth=${process.env.OPTIMIZELY_SINGLE_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        query: GetFormsDocument.loc?.source.body,
      }),
    }
  )

  const json = await response.json()

  const rawFormNames =
  json?.data?.OptiFormsContainerData?.items
    ?.map((item: any) => item?._metadata?.displayName)
    ?.filter(Boolean) || []

  const formNames = Array.from(new Set(rawFormNames)).sort()

  return NextResponse.json({
    success: true,
    formNames,
  })
}