import ContentAreaMapper from '@/components/content-area/mapper'
import OnPageEdit from '@/components/draft/on-page-edit'
import { optimizely } from '@/lib/optimizely/fetch'
import { getValidLocale } from '@/lib/optimizely/utils/language'
import { buildCmsPreviewQuerySuffix } from '@/lib/preview/cms-preview-params'
import { generateAlternates } from '@/lib/utils/metadata'
import { draftMode } from 'next/headers'
import { Metadata } from 'next'
import { Suspense } from 'react'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const locales = getValidLocale(locale)
  const pageResp = await optimizely.GetStartPage({ locales: [locales] })
  if (process.env.NODE_ENV === 'development' && pageResp.errors?.length) {
    console.error('[GetStartPage] GraphQL errors', { locale, errors: pageResp.errors })
  }
  const page = pageResp.data?.StartPage?.item
  if (!page) {
    return {}
  }

  return {
    title: page.title,
    description: page.shortDescription || '',
    keywords: page.keywords ?? '',
    alternates: generateAlternates(locale, '/'),
  }
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    key?: string
    ver?: string
    loc?: string
    ctx?: string
  }>
}) {
  const { locale } = await props.params
  const sp = await props.searchParams
  const { isEnabled: isDraftPreview } = await draftMode()
  const previewVersion = sp.ver?.trim()
  const locales = getValidLocale(locale)

  if (isDraftPreview && previewVersion) {
    const pageResponse = await optimizely.GetPreviewStartPage(
      { locales: [locales], version: previewVersion },
      { preview: true, useDraftGraphSessionCookie: true }
    )
    const startPage = pageResponse.data?.StartPage?.item
    const blocks = (startPage?.blocks ?? []).filter(
      (block) => block !== null && block !== undefined
    )
    const querySuffix = buildCmsPreviewQuerySuffix(sp)
    const currentRoute = `/${locale}${querySuffix}`

    return (
      <div data-epi-edit="blocks">
        <OnPageEdit version={previewVersion} currentRoute={currentRoute} />
        <Suspense>
          <ContentAreaMapper blocks={blocks} preview />
        </Suspense>
      </div>
    )
  }

  const pageResponse = await optimizely.GetStartPage({ locales: [locales] })
  if (process.env.NODE_ENV === 'development' && pageResponse.errors?.length) {
    console.error('[GetStartPage] GraphQL errors', { locale, errors: pageResponse.errors })
  }

  const startPage = pageResponse.data?.StartPage?.item
  const blocks = (startPage?.blocks ?? []).filter(
    (block) => block !== null && block !== undefined
  )

  return (
    <>
      <Suspense>
        <ContentAreaMapper blocks={blocks} />
      </Suspense>
    </>
  )
}
