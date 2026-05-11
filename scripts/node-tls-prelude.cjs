/**
 * Load env and optionally relax TLS verification for local tools (codegen, next dev)
 * when a corporate proxy re-signs HTTPS and Node does not trust the extra CA.
 *
 * Set OPTIMIZELY_GRAPH_TLS_INSECURE=1 in .env.local only for trusted dev machines.
 * Do not enable in production or CI that deploys publicly.
 */
'use strict'

const fs = require('fs')
const path = require('path')

let dotenv
try {
  dotenv = require('dotenv')
} catch {
  dotenv = null
}

if (dotenv) {
  const root = process.cwd()
  const envPath = (name) => path.join(root, name)
  if (fs.existsSync(envPath('.env'))) {
    dotenv.config({ path: envPath('.env') })
  }
  if (fs.existsSync(envPath('.env.local'))) {
    dotenv.config({ path: envPath('.env.local'), override: true })
  }
}

const flag = process.env.OPTIMIZELY_GRAPH_TLS_INSECURE
if (flag === '1' || flag === 'true' || flag === 'yes') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}
