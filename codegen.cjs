/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

require('./scripts/node-tls-prelude.cjs')

const apiUrl = process.env.OPTIMIZELY_API_URL
const apiKey = process.env.OPTIMIZELY_SINGLE_KEY
if (!apiUrl?.trim() || !apiKey?.trim()) {
  throw new Error(
    'codegen.cjs: set OPTIMIZELY_API_URL and OPTIMIZELY_SINGLE_KEY in .env / .env.local'
  )
}

const schemaUrl = `${apiUrl.replace(/\/?$/, '')}?auth=${apiKey}`
const customFetch = require('./scripts/graphql-codegen-fetch.cjs')

/** @type {import('@graphql-codegen/cli').CodegenConfig} */
module.exports = {
  schema: {
    [schemaUrl]: { customFetch },
  },
  documents: './lib/optimizely/queries/**/*.graphql',
  generates: {
    './lib/optimizely/types/generated.ts': {
      overwrite: true,
      plugins: ['typescript', 'typescript-operations', 'typescript-generic-sdk'],
      config: {
        rawRequest: true,
        avoidOptionals: true,
      },
    },
  },
}
