import '@/styles/main.scss'
import { OptimizelyWebSnippetHead } from '@/components/optimizely/optimizely-web-snippet-head'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <OptimizelyWebSnippetHead />
      </head>
      <body>{children}</body>
    </html>
  )
}