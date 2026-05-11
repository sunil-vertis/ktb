import Link from 'next/link'
import SamplePreviewBlock from '@/components/block/sample-preview-block'

export default async function SamplePreviewBlockPage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params

  return (
    <>  {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Local preview</h1>
          <p className="text-muted-foreground">
            Route:{' '}
            <code className="rounded bg-muted px-1">
              /{locale}/preview/sample-preview-block
            </code>
          </p>
        </div>
        <Link className="text-sm underline underline-offset-4" href={`/${locale}`}>
          Back to home
        </Link>
      </div>
    </div>
     <SamplePreviewBlock
     title="Sample Preview Block"
     description="Edit `components/block/sample-preview-block.tsx` and refresh to see changes."
     ctaLabel="Looks good"
   />
   </>
  )
}

