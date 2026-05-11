import { DocumentNode, type ExecutionResult } from 'graphql'
import { print } from 'graphql/language/printer'
import { getSdk } from './types/generated'
import { isVercelError } from '../type-guards'

interface OptimizelyFetchOptions {
  headers?: Record<string, string>
  cache?: RequestCache
  preview?: boolean
  cacheTag?: string
}

interface OptimizelyFetch<Variables> extends OptimizelyFetchOptions {
  query: string
  variables?: Variables
}

interface GraphqlResponse<Response> {
  errors: unknown[]
  data: Response
  /** Optional GraphQL response payload (e.g. tracing); forwarded when present. */
  extensions?: unknown
}

function describeFetchFailure(e: unknown): string {
  if (!(e instanceof Error)) return String(e)
  const c = e.cause
  const detail =
    c instanceof Error ? c.message : c != null ? String(c) : ''
  return detail ? `${e.message}: ${detail}` : e.message
}

const optimizelyFetch = async <Response, Variables = object>({
  query,
  variables,
  headers,
  cache,
  preview,
  cacheTag,
}: OptimizelyFetch<Variables>): Promise<
  GraphqlResponse<Response> & { headers: Headers }
> => {
  const configHeaders = headers ?? {}
  let resolvedCache: RequestCache | undefined = cache

  if (preview) {
    configHeaders.Authorization = `Basic ${process.env.OPTIMIZELY_PREVIEW_SECRET}`
    resolvedCache = 'no-store'
  }

  // `cache: 'no-store'` implies revalidate 0 and breaks static prerender of public routes.
  // Published fetches use time-based revalidation so `next build` can pre-render /[locale].
  const useNoStore = resolvedCache === 'no-store'
  const revalidateSeconds = Number.parseInt(
    process.env.OPTIMIZELY_FETCH_REVALIDATE_SECONDS ?? '300',
    10
  )
  const revalidate =
    Number.isFinite(revalidateSeconds) && revalidateSeconds > 0
      ? revalidateSeconds
      : 300
  const cacheTags = ['optimizely-content']
  if (cacheTag) {
    cacheTags.push(cacheTag)
  }

  const apiUrl = process.env.OPTIMIZELY_API_URL
  const apiKey = process.env.OPTIMIZELY_SINGLE_KEY
  if (!apiUrl?.trim() || !apiKey?.trim()) {
    throw {
      status: 500,
      message: `Missing Optimizely env: ${[!apiUrl?.trim() && 'OPTIMIZELY_API_URL', !apiKey?.trim() && 'OPTIMIZELY_SINGLE_KEY'].filter(Boolean).join(', ')}`,
      query,
    }
  }

  try {
    const endpoint = `${apiUrl}?auth=${apiKey}`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...configHeaders,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      ...(useNoStore
        ? { cache: 'no-store' as const, next: { tags: cacheTags } }
        : {
            next: {
              revalidate,
              tags: cacheTags,
            },
          }),
    })

    const result = await response.json()

    return {
      ...result,
      headers: response.headers,
    }
  } catch (e) {
    if (isVercelError(e)) {
      throw {
        status: 500,
        message: describeFetchFailure(e),
        query,
      }
    }

    throw {
      error: e,
      query,
    }
  }
}

async function requester<R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: OptimizelyFetchOptions
) {
  const request = await optimizelyFetch<R>({
    query: print(doc),
    variables: vars ?? {},
    ...options,
  })

  // Forward GraphQL `errors` / `extensions`; SDK `Requester` expects `ExecutionResult` shape.
  const out = {
    data: request.data,
    errors: request.errors,
    extensions: request.extensions,
    _headers: request.headers,
  }
  return out as unknown as ExecutionResult<R, unknown>
}

export const optimizely = getSdk(requester)
