import { optimizely } from '@/lib/optimizely/fetch'
import { getValidLocale, LOCALES } from '@/lib/optimizely/utils/language'
import { NextRequest, NextResponse } from 'next/server'

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  const locale = request.nextUrl.searchParams.get('locale')?.trim() ?? 'en'

  if (!q) {
    return NextResponse.json({ suggestions: [] })
  }
  if (!LOCALES.includes(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  try {
    const { data, errors } = await optimizely.AutoComplete({
      searchText: q,
      language: [getValidLocale(locale)],
    })
    if (process.env.NODE_ENV === 'development' && errors?.length) {
      console.error('[AutoComplete] GraphQL errors', { q, locale, errors })
    }

    const raw = data?.Searchable?.autocomplete?.SearchTitle?.html
    const list = Array.isArray(raw) ? raw : []
    const seen = new Set<string>()
    const suggestions: string[] = []
    for (const h of list) {
      if (h == null) continue
      const plain = stripHtml(h)
      if (!plain) continue
      const key = plain.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      suggestions.push(plain)
      if (suggestions.length >= 5) break
    }

    return NextResponse.json(
      { suggestions },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (e) {
    console.error('[search-autocomplete]', e)
    return NextResponse.json({ suggestions: [] })
  }
}
