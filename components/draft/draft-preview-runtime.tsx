import Script from 'next/script'

import DraftActions from '@/components/draft/draft-actions'

/** Loaded on (site) routes when Next.js draft mode is enabled (CMS live preview). */
export function DraftPreviewRuntime() {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '')
  if (!cmsUrl) {
    return <DraftActions />
  }

  return (
    <>
      <Script src={`${cmsUrl}/util/javascript/communicationinjector.js`} />
      <DraftActions />
    </>
  )
}
