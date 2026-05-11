import { BlobServiceClient } from '@azure/storage-blob'
import { GetEmailTemplatesDocument } from '@/lib/optimizely/types/generated'

const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!
const containerName = process.env.AZURE_STORAGE_CONTAINER!

const client = BlobServiceClient.fromConnectionString(conn)
const container = client.getContainerClient(containerName)

export async function saveSubmission(data: any) {
  const name = `submission-${Date.now()}.json`
  const block = container.getBlockBlobClient(name)

  await block.upload(
    JSON.stringify(data, null, 2),
    Buffer.byteLength(JSON.stringify(data))
  )

  return name
}

export async function getAllSubmissions() {
  const results: any[] = []

  for await (const blob of container.listBlobsFlat()) {
    const blobClient = container.getBlobClient(blob.name)
    const download = await blobClient.download()
    const text = await streamToString(download.readableStreamBody!)
    results.push(JSON.parse(text))
  }

  return results
}

export async function getEmailTemplates(formName: string) {
  const response = await fetch(
    `${process.env.OPTIMIZELY_API_URL}?auth=${process.env.OPTIMIZELY_SINGLE_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        query: GetEmailTemplatesDocument.loc?.source.body,
        variables: {
          formName,
        },
      }),
    }
  )

  const json = await response.json()

  return {
    customer:
      json?.data?.CustomerEmailTemplateBlock?.items?.[0] || null,

    staff:
      json?.data?.StaffEmailTemplateBlock?.items?.[0] || null,
  }
}

function streamToString(stream: NodeJS.ReadableStream) {
  return new Promise<string>((resolve, reject) => {
    const chunks: any[] = []

    stream.on('data', (d) => chunks.push(d.toString()))
    stream.on('end', () => resolve(chunks.join('')))
    stream.on('error', reject)
  })
}