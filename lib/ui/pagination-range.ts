/** Items to render: 1-based page numbers or ellipsis between groups. */
export type PaginationItem = number | 'ellipsis'

function range(from: number, to: number): number[] {
  if (from > to) return []
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}

/** Pages shown from the start (or end) before an ellipsis when near that edge. */
const EDGE_PAGE_WINDOW = 3

/**
 * Builds the list of page numbers and ellipsis markers (Chakra-style rules).
 * @param currentPage — 1-based
 * @param totalPages — >= 1
 * @param siblingCount — pages on each side of current (default 1)
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationItem[] {
  if (totalPages < 1) return []
  if (totalPages === 1) return [1]

  const totalPageNumbers = EDGE_PAGE_WINDOW + siblingCount + 2

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = range(1, EDGE_PAGE_WINDOW)
    return [...leftRange, 'ellipsis', totalPages]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    // Last EDGE_PAGE_WINDOW pages, extended left if current sits outside that tail (e.g. page 9 of 12).
    let tailStart = totalPages - EDGE_PAGE_WINDOW + 1
    if (currentPage < tailStart) {
      tailStart = Math.max(2, currentPage - siblingCount)
    }
    const rightRange = range(tailStart, totalPages)
    return [1, 'ellipsis', ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
  }

  return range(1, totalPages)
}
