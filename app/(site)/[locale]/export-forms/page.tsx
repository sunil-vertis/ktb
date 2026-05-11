import { generateAlternates } from '@/lib/utils/metadata'
import type { Metadata } from 'next'
import ExportFormsBlock from '@/components/block/export-forms-block'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params

  return {
    title: 'Export Forms',
    alternates: generateAlternates(locale, 'export-forms'),
  }
}

export default function ExportFormsPage() {
  return <ExportFormsBlock />
}
