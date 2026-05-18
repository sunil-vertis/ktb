import '@/app/globals.css'
import '@/styles/main.scss'
import Script from 'next/script'
import { OptimizelyWebSnippetHead } from '@/components/optimizely/optimizely-web-snippet-head'
import DraftActions from '@/components/draft/draft-actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <OptimizelyWebSnippetHead />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Script
          src={`${process.env.NEXT_PUBLIC_CMS_URL}/util/javascript/communicationinjector.js`}
        />
        <DraftActions />
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  )
}
