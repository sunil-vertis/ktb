import { generateAlternates } from '@/lib/utils/metadata'
import type { Metadata } from 'next'
import RegistrationBlock from '@/components/block/registration-block'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params

  return {
    title: 'Sign Up',
    alternates: generateAlternates(locale, 'sign-up'),
  }
}

export default function SignUpPage() {
  return <RegistrationBlock />
}
