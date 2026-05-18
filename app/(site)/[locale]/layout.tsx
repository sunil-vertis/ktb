import '@/app/globals.css'
import '@/styles/main.scss'
import { DraftPreviewRuntime } from '@/components/draft/draft-preview-runtime'
import { OptimizelyWebSnippetHead } from '@/components/optimizely/optimizely-web-snippet-head'
import { LOCALES } from '@/lib/optimizely/utils/language'
import { Header } from '@/components/layout/header'
import { fetchSiteHeaderCms } from '@/components/layout/header-cms'
import { Footer } from '@/components/layout/footer'
import { draftMode } from 'next/headers'

export function generateStaticParams() {
  try {
    return LOCALES.map((locale) => ({ locale }))
  } catch (e) {
    console.error(e)
    return []
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const headerContent = await fetchSiteHeaderCms(locale)
  const { isEnabled: isDraftPreview } = await draftMode()
  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <head>
        <OptimizelyWebSnippetHead />
      </head>
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        {isDraftPreview ? <DraftPreviewRuntime /> : null}
        <Header locale={locale} content={headerContent} />
        <main className="min-h-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
