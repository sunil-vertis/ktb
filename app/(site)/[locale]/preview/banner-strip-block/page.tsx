import Link from 'next/link'
import BannerStripBlock from '@/components/block/banner-strip-block'

export default async function BannerStripBlockPage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Banner Strip Preview</h1>
            <p className="text-muted-foreground">
              Route:{' '}
              <code className="rounded bg-muted px-1">
                /{locale}/preview/banner-strip-block
              </code>
            </p>
          </div>
          <Link className="text-sm underline underline-offset-4" href={`/${locale}`}>
            Back to home
          </Link>
        </div>
      </div>

      <BannerStripBlock
        message="Special Promotion 2026 - Apply for a home loan before 30 June  ·  Interest rate from 2.99% p.a."
      />
    </div>
  )
}
