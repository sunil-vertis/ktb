import '@/app/globals.css'
import '@/styles/main.scss'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const PREVIEW_LOCALE = 'en'

export default async function PreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={PREVIEW_LOCALE} suppressHydrationWarning>
      <body
        className="flex min-h-screen flex-col antialiased"
        suppressHydrationWarning
      >
        <Header locale={PREVIEW_LOCALE} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}

