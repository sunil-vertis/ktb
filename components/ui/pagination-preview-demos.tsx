'use client'

import * as React from 'react'

import { Pagination } from '@/components/ui/pagination'

/** Preview for Figma node 208:4703 — single pagination variation. */
export function PaginationPreviewDemos() {
  const [page, setPage] = React.useState(1)
  const totalItems = 120
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return (
    <section className="mt-12 space-y-4">
      <h2 className="type-heading-h3">Pagination</h2>
      <p className="type-body-base-regular text-neutral-500">
        Props: <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">currentPage</code>,{' '}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">totalPages</code>,{' '}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">totalItems</code>,{' '}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">pageSize</code>,{' '}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">onPageChange</code>.
      </p>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </section>
  )
}
