import '@/app/globals.css'
import '@/styles/main.scss'
import { OptimizelyWebSnippetHead } from '@/components/optimizely/optimizely-web-snippet-head'
import { Header } from '@/components/layout/header'
import { fetchSiteHeaderCms } from '@/components/layout/header-cms'
import { Footer } from '@/components/layout/footer'

const PREVIEW_LOCALE = 'en'

export default async function PreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerContent = await fetchSiteHeaderCms(PREVIEW_LOCALE)
  return (
    <html lang={PREVIEW_LOCALE} suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <OptimizelyWebSnippetHead />
        <Header locale={PREVIEW_LOCALE} content={headerContent} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}

