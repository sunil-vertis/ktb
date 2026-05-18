import { cookies, draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

import { OPTIMIZELY_PREVIEW_JWT_COOKIE, optimizely } from '@/lib/optimizely/fetch'
import { DEFAULT_LOCALE, getValidLocale } from '@/lib/optimizely/utils/language'
import {
  appendCmsPreviewParams,
  buildPublishedPreviewPath,
} from '@/lib/preview/cms-preview-params'

export const dynamic = 'force-dynamic'

const graphPreviewFromToken = (previewJwt: string) =>
  ({ preview: true, previewJwt }) as const

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('preview_token')
  const key = searchParams.get('key')
  const ver = searchParams.get('ver')
  const loc = searchParams.get('loc')
  const ctx = searchParams.get('ctx')

  if (!ver || !token || !key) {
    return notFound()
  }

  const cookieStore = await cookies()
  const isSecureDeployment =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  cookieStore.set(OPTIMIZELY_PREVIEW_JWT_COOKIE, token, {
    httpOnly: true,
    /** Required when CMS loads preview in an iframe (cross-site ancestor). */
    secure: isSecureDeployment,
    sameSite: isSecureDeployment ? 'none' : 'lax',
    path: '/',
    maxAge: 1800,
  })

  const graphOpts = graphPreviewFromToken(token)

  const response = await optimizely.GetContentByKeyAndVersion(
    { key, ver },
    graphOpts
  )

  if (Array.isArray(response.errors) && response.errors.length > 0) {
    const errorsMessage = response.errors
      .map((error) => error.message)
      .join(', ')

    return new NextResponse(errorsMessage, { status: 401 })
  }

  let content = response.data?._Content?.item

  if (!content) {
    const localeSeg = loc ?? DEFAULT_LOCALE
    const vbResponse = await optimizely.VisualBuilder(
      {
        key,
        version: ver,
        locales: [getValidLocale(localeSeg)],
      },
      graphOpts
    )

    if (Array.isArray(vbResponse.errors) && vbResponse.errors.length > 0) {
      const errorsMessage = vbResponse.errors
        .map((error) => error.message)
        .join(', ')

      return new NextResponse(errorsMessage, { status: 401 })
    }

    if (vbResponse.data?.SEOExperience?.item) {
      ;(await draftMode()).enable()
      redirect(
        appendCmsPreviewParams(
          `/${localeSeg}/draft/${ver}/experience/${key}`,
          { key, ver, loc: localeSeg, ctx }
        )
      )
    }

    return new NextResponse('Bad Request', { status: 400 })
  }

  const localeSeg = loc ?? DEFAULT_LOCALE
  const previewParams = { key, ver, loc: localeSeg, ctx }

  ;(await draftMode()).enable()
  let newUrl = ''
  if (
    content.__typename === '_Experience' ||
    content.__typename === 'SEOExperience'
  ) {
    newUrl = `/${localeSeg}/draft/${ver}/experience/${key}`
  } else if (content.__typename === '_Component') {
    newUrl = `/${localeSeg}/draft/${ver}/block/${key}`
  } else {
    // CMS pages: use published URL shape (/en/loan) so CMS Stores/context can resolve.
    newUrl = buildPublishedPreviewPath(localeSeg, content)
  }

  redirect(appendCmsPreviewParams(newUrl, previewParams))
}
