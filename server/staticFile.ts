import fs from 'node:fs/promises'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

export async function tryServeStaticFile(
  request: IncomingMessage,
  response: ServerResponse,
  rootDirectory: string,
): Promise<boolean> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return false
  }

  const requestUrl = new URL(request.url ?? '/', 'http://localhost')
  const pathname = decodeURIComponent(requestUrl.pathname)

  if (pathname.includes('..')) {
    return false
  }

  const filePath = path.join(rootDirectory, pathname)
  const normalizedRoot = path.resolve(rootDirectory)
  const normalizedFile = path.resolve(filePath)

  if (!normalizedFile.startsWith(normalizedRoot)) {
    return false
  }

  try {
    const fileStat = await fs.stat(normalizedFile)
    if (!fileStat.isFile()) {
      return false
    }

    const extension = path.extname(normalizedFile).toLowerCase()
    const contentType = MIME_TYPES[extension] ?? 'application/octet-stream'

    response.statusCode = 200
    response.setHeader('Content-Type', contentType)

    if (request.method === 'HEAD') {
      response.end()
      return true
    }

    const fileContents = await fs.readFile(normalizedFile)
    response.end(fileContents)
    return true
  } catch {
    return false
  }
}
