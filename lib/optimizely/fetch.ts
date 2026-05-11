import { DocumentNode } from 'graphql'
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
  // Same GraphQL URL for every POST; `force-cache` can ignore body and reuse wrong locale.
  cache = 'no-store',
  preview,
  cacheTag,
}: OptimizelyFetch<Variables>): Promise<
  GraphqlResponse<Response> & { headers: Headers }
> => {
  const configHeaders = headers ?? {}

  if (preview) {
    configHeaders.Authorization = `Basic ${process.env.OPTIMIZELY_PREVIEW_SECRET}`
    cache = 'no-store'
  }
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
      cache,
      next: { tags: cacheTags },
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

  // Forward GraphQL `errors` (SDK expects ExecutionResult); callers can log / handle.
  return {
    data: request.data,
    errors: request.errors,
    extensions: request.extensions,
    _headers: request.headers,
  }
}

export const optimizely = getSdk(requester)
