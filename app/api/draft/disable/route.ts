import { cookies, draftMode } from 'next/headers'

import { OPTIMIZELY_PREVIEW_JWT_COOKIE } from '@/lib/optimizely/fetch'

export async function GET() {
  ;(await draftMode()).disable()
  ;(await cookies()).delete(OPTIMIZELY_PREVIEW_JWT_COOKIE)
  return new Response('Draft mode is disabled')
}
