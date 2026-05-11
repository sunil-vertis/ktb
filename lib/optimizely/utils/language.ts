// lib/optimizely/utils/language.ts
import { Locales } from '../types/generated'

export const DEFAULT_LOCALE = 'en'
/** First segment must match here or middleware will not treat `/th/...` as a locale route. */
export const LOCALES = ['en', 'pl', 'sv', 'th']

export const getValidLocale = (locale: string): Locales => {
  if (locale === 'th') return Locales.Th
  if (locale === 'en') return Locales.En
  if (locale === 'pl') return Locales.Pl
  if (locale === 'sv') return Locales.Sv
  return Locales.En
}

export const getLocales = () => {
  return LOCALES
}

export const mapPathWithoutLocale = (path: string): string => {
  const parts = path.split('/').filter(Boolean)
  if (LOCALES.includes(parts[0] ?? '')) {
    parts.shift()
  }

  return `${parts.join('/')}`
}
