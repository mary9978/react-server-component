import { Readable } from 'node:stream'
import type { ServerResponse } from 'node:http'

export async function sendWebResponse(
  response: Response,
  nodeResponse: ServerResponse,
): Promise<void> {
  nodeResponse.statusCode = response.status

  response.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value)
  })

  if (response.body === null) {
    nodeResponse.end()
    return
  }

  await new Promise<void>((resolve, reject) => {
    Readable.fromWeb(response.body as ReadableStream<Uint8Array>)
      .on('error', reject)
      .on('end', resolve)
      .pipe(nodeResponse)
  })
}
