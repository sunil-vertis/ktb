// app/(site)/[locale]/[slug]/page.tsx
import ContentAreaMapper from '@/components/content-area/mapper'
import VisualBuilderExperienceWrapper from '@/components/visual-builder/wrapper'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { optimizely } from '@/lib/optimizely/fetch'
import { SafeVisualBuilderExperience } from '@/lib/optimizely/types/experience'
import {
  getValidLocale,
  mapPathWithoutLocale,
} from '@/lib/optimizely/utils/language'
import { generateAlternates } from '@/lib/utils/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { mapLocationsToOptions } from '@/lib/forms/utils/selection'
import { buildCmsPageBreadcrumbItems } from '@/lib/utils/page-breadcrumbs'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug?: string }>
}): Promise<Metadata> {
  const { locale, slug = '' } = await props.params
  const locales = getValidLocale(locale)
  const formattedSlug = `/${slug}`
  const { data, errors } = await optimizely.getPageByURL({
    locales: [locales],
    slug: formattedSlug,
  })

  if (process.env.NODE_ENV === 'development' && errors?.length) {
    console.error('[getPageByURL] GraphQL errors', {
      locale,
      slug: formattedSlug,
      errors,
    })
  }

  if (errors?.length) {
    return {}
  }

  const page = data?.CMSPage?.item
  if (!page) {
    const experienceData = await optimizely.GetVisualBuilderBySlug({
      locales,
      slug: formattedSlug,
    })

    const experience =
      experienceData.data?.BlankExperience?.item ||
      experienceData.data?.SEOExperience?.item

    if (experience) {
      return {
        title: 'title' in experience ? experience.title : '',
        description:
          'shortDescription' in experience ? experience.shortDescription || '' : '',
        keywords: 'keywords' in experience ? experience.keywords ?? '' : '',
        alternates: generateAlternates(locale, formattedSlug),
      }
    }

    return {}
  }

  return {
    title: page.title,
    description: page.shortDescription || '',
    keywords: page.keywords ?? '',
    alternates: generateAlternates(locale, formattedSlug),
  }
}

export async function generateStaticParams() {
  try {
    const pageTypes = ['CMSPage', 'SEOExperience', 'BlankExperience']
    const pathsResp = await optimizely.AllPages({ pageType: pageTypes })
    const paths = pathsResp.data?._Content?.items ?? []
    const filterPaths = paths.filter(
      (path) => path && path._metadata?.url?.default !== null
    )
    const uniquePaths = new Set<string>()
    filterPaths.forEach((path) => {
      const cleanPath = mapPathWithoutLocale(
        path?._metadata?.url?.default ?? ''
      )
      uniquePaths.add(cleanPath)
    })

    return Array.from(uniquePaths).map((slug) => ({
      slug,
    }))
  } catch (e) {
    console.error(e)
    return []
  }
}

export default async function CmsPage(props: {
  params: Promise<{ locale: string; slug?: string }>
}) {
  const { locale, slug = '' } = await props.params
  const locales = getValidLocale(locale)
  const formattedSlug = `/${slug}`
  const { data, errors } = await optimizely.getPageByURL({
    locales: [locales],
    slug: formattedSlug,
  })

  if (process.env.NODE_ENV === 'development' && errors?.length) {
    console.error('[getPageByURL] GraphQL errors', {
      locale,
      slug: formattedSlug,
      errors,
    })
  }

  if (errors?.length || !data?.CMSPage?.item?._modified) {
    const experienceData = await optimizely.GetVisualBuilderBySlug({
      locales,
      slug: formattedSlug,
    })

    const experience = (
      experienceData.data?.BlankExperience?.item ||
      experienceData.data?.SEOExperience?.item
    ) as SafeVisualBuilderExperience | undefined

    if (experience) {
      const locationsData = await optimizely.GetLocations()
      const locationOptions = mapLocationsToOptions(
        locationsData.data?.Location?.items || []
      )

      return (
        <Suspense>
          <VisualBuilderExperienceWrapper
            experience={experience}
            locationOptions={locationOptions}
            locale={locale}
          />
        </Suspense>
      )
    }

    return notFound()
  }

  const page = data.CMSPage.item
  const blocks = (page?.blocks ?? []).filter(
    (block) => block !== null && block !== undefined
  )

  if (process.env.NODE_ENV === 'development' && blocks.length === 0) {
    console.warn('[CMSPage] blocks empty', {
      locale,
      slug: formattedSlug,
      modified: page?._modified,
    })
  }

  const publishedPath =
    page?._metadata?.url?.default?.trim() ||
    page?._metadata?.url?.hierarchical?.trim() ||
    page?._metadata?.url?.internal?.trim() ||
    page?._metadata?.url?.base?.trim() ||
    null

  const breadcrumbItems = buildCmsPageBreadcrumbItems({
    locale,
    pageTitle: page?.title,
    publishedPath,
    routePath: formattedSlug,
  })

  return (
    <>
      {breadcrumbItems ? <Breadcrumb items={breadcrumbItems} /> : null}
      <Suspense>
        <ContentAreaMapper blocks={blocks} />
      </Suspense>
    </>
  )
}
