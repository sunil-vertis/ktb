/**
 * Fetch implementation for GraphQL Codegen URL schema loading.
 * Node's global fetch/undici may ignore NODE_TLS_REJECT_UNAUTHORIZED; this uses https.request
 * so OPTIMIZELY_GRAPH_TLS_INSECURE=1 reliably works behind TLS-inspecting proxies.
 */
'use strict'

const https = require('https')
const { URL } = require('url')

function isTlsInsecure() {
  const f = process.env.OPTIMIZELY_GRAPH_TLS_INSECURE
  if (f === '1' || f === 'true' || f === 'yes') return true
  // Set by node-tls-prelude.cjs when OPTIMIZELY_GRAPH_TLS_INSECURE is enabled
  return process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0'
}

function toPlainHeaders(headers) {
  if (!headers) return {}
  if (typeof headers.forEach === 'function') {
    const o = {}
    headers.forEach((value, key) => {
      o[key] = value
    })
    return o
  }
  return { ...headers }
}

function resolveUrl(input) {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  if (input && typeof input.url === 'string') return input.url
  throw new TypeError('graphql-codegen-fetch: unsupported request input')
}

/**
 * @param {string | Request} input
 * @param {RequestInit} [init]
 */
module.exports = async function graphqlCodegenFetch(input, init = {}) {
  const urlString = resolveUrl(input)
  const u = new URL(urlString)
  const headers = toPlainHeaders(init.headers)
  const method = init.method || 'GET'
  const insecure = isTlsInsecure()

  let body = init.body
  if (body != null && typeof body !== 'string' && !Buffer.isBuffer(body)) {
    if (body instanceof Uint8Array) {
      body = Buffer.from(body)
    } else if (typeof body.text === 'function') {
      body = await body.text()
    } else {
      body = String(body)
    }
  }

  return await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: `${u.pathname}${u.search}`,
        method,
        headers,
        ...(insecure ? { agent: new https.Agent({ rejectUnauthorized: false }) } : {}),
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const buf = Buffer.concat(chunks)
          const headerObj = {}
          for (const [k, v] of Object.entries(res.headers)) {
            if (v == null) continue
            headerObj[k] = Array.isArray(v) ? v.join(', ') : v
          }
          resolve(
            new Response(buf, {
              status: res.statusCode ?? 0,
              statusText: res.statusMessage,
              headers: headerObj,
            })
          )
        })
      }
    )
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}
