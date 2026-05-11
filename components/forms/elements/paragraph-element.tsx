'use client'

const addClass = (html: string, tag: string, className: string) => {
  return html.replace(
    new RegExp(`<${tag}(?![^>]*class=)([^>]*)>`, 'gi'),
    `<${tag}$1 class="${className}">`
  )
}

const stripSingleOuterDiv = (html: string) => {
  const trimmed = html.trim()
  const match = trimmed.match(/^<div[^>]*>([\s\S]*)<\/div>$/i)
  return match ? match[1].trim() : html
}

export default function ParagraphElement({ element }: { element: any }) {
  const rawHtml = element.Text?.html ?? element.Text ?? ''

  if (!rawHtml) return null

  let styledHtml = stripSingleOuterDiv(rawHtml)

  styledHtml = addClass(styledHtml, 'h2', 'registration-block__title')
  styledHtml = addClass(styledHtml, 'p', 'registration-block__subtitle')
  styledHtml = addClass(styledHtml, 'div', 'registration-block__subtitle')

  return (
    <div
      className="registration-block__title-wrap"
      dangerouslySetInnerHTML={{ __html: styledHtml }}
    />
  )
}