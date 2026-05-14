/** Map Optimizely Content Graph fields to PDP presentation props. */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function dayFromScalar(val: unknown): string | undefined {
  if (val == null || String(val).trim() === '') return undefined
  return String(val).slice(0, 10)
}

export function mediaRefToUrl(
  ref:
    | {
        __typename?: string
        _assetMetadata?: {
          url?: string | null
          fileSize?: number | null
          mimeType?: string | null
        } | null
      }
    | null
    | undefined
): string | undefined {
  if (!isRecord(ref)) return undefined
  const u = ref._assetMetadata?.url?.trim()
  return u || undefined
}

/** Resolved from `DownloadResourceBlock.DownloadMedia` (`... on _Media` + concrete media types). */
export type DownloadMediaAsset = {
  url?: string
  fileSize?: number
  mimeType?: string
  /** From `_itemMetadata.lastModified` (YYYY-MM-DD). */
  lastModifiedDay?: string
  /** From `_modified` on the media item (YYYY-MM-DD). */
  contentModifiedDay?: string
  displayName?: string
}

export function assetFromDownloadMedia(
  downloadMedia: unknown | null | undefined
): DownloadMediaAsset | undefined {
  if (!isRecord(downloadMedia)) return undefined

  const meta = downloadMedia._assetMetadata as
    | {
        fileSize?: number | null
        mimeType?: string | null
        url?: string | null
      }
    | null
    | undefined
  const im = downloadMedia._itemMetadata as
    | {
        lastModified?: unknown
        type?: string | null
        key?: string | null
        displayName?: string | null
      }
    | null
    | undefined

  const url = meta?.url?.trim()
  const fileSize =
    meta?.fileSize != null && Number.isFinite(meta.fileSize)
      ? meta.fileSize
      : undefined
  const mimeType = meta?.mimeType?.trim() || undefined
  const lastModifiedDay = dayFromScalar(im?.lastModified)
  const contentModifiedDay = dayFromScalar(downloadMedia._modified)
  const displayName = im?.displayName?.trim() || undefined

  if (
    !url &&
    fileSize == null &&
    !mimeType &&
    !lastModifiedDay &&
    !contentModifiedDay &&
    !displayName
  ) {
    return undefined
  }

  return {
    url: url || undefined,
    fileSize,
    mimeType,
    lastModifiedDay,
    contentModifiedDay,
    displayName,
  }
}

export function mimeTypeToFileExtension(
  mime: string | undefined
): string | undefined {
  if (!mime?.trim()) return undefined
  const key = mime.trim().toLowerCase()
  const known: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  }
  if (known[key]) return known[key]
  const subtype = key.split('/')[1]
  if (!subtype) return undefined
  return subtype.split('.').pop()!.toUpperCase().slice(0, 12)
}

export function displaySizeFromBytes(bytes: number): {
  sizeInMb: number
  sizeLabel: string
} {
  const mb = bytes / (1024 * 1024)
  if (mb >= 0.01) {
    const rounded = Math.round(mb * 1000) / 1000
    return {
      sizeInMb: mb,
      sizeLabel: `${rounded} MB`,
    }
  }
  const kb = bytes / 1024
  return {
    sizeInMb: mb,
    sizeLabel: `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`,
  }
}

export function linkToAbsoluteUrl(
  link:
    | {
        url?: {
          default?: string | null
          base?: string | null
          hierarchical?: string | null
          internal?: string | null
        } | null
      }
    | null
    | undefined
): string | undefined {
  if (!link?.url) return undefined
  const u =
    link.url.default?.trim() ||
    link.url.hierarchical?.trim() ||
    link.url.internal?.trim() ||
    link.url.base?.trim()
  return u || undefined
}

export function richTextToPlainLines(
  html: string | null | undefined
): string[] | undefined {
  if (!html?.trim()) return undefined
  const normalized = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
  const stripped = normalized.replace(/<[^>]+>/g, ' ')
  const lines = stripped
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  return lines.length ? lines : undefined
}
