import http from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createServer as createViteServer } from 'vite'
import { getDevPageOptions, getProdPageOptions } from './clientAssets.ts'
import { tryServeStaticFile } from './staticFile.ts'
import { sendWebResponse } from './webResponse.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 5173

async function handleSsrPage(
  request: IncomingMessage,
  nodeResponse: ServerResponse,
  loadHandler: () => Promise<{
    handlePageRequest: (options: unknown) => Promise<Response>
  }>,
  pageOptions: ReturnType<typeof getDevPageOptions>,
): Promise<void> {
  const { handlePageRequest } = await loadHandler()
  const webResponse = await handlePageRequest({
    ...pageOptions,
    url: request.url ?? '/',
  })
  await sendWebResponse(webResponse, nodeResponse)
}

function createRequestListener(
  onPageRequest: (
    request: IncomingMessage,
    response: ServerResponse,
  ) => Promise<void>,
): http.RequestListener {
  return (request, response) => {
    onPageRequest(request, response).catch((error: unknown) => {
      console.error(error)
      if (!response.headersSent) {
        response.statusCode = 500
        response.setHeader('Content-Type', 'text/plain; charset=utf-8')
      }
      response.end('Internal Server Error')
    })
  }
}

async function startDevServer(): Promise<void> {
  const vite = await createViteServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  })

  const pageOptions = getDevPageOptions()

  const server = http.createServer(
    createRequestListener(async (request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.statusCode = 405
        response.end('Method Not Allowed')
        return
      }

      await new Promise<void>((resolve) => {
        vite.middlewares(request, response, () => resolve())
      })

      if (response.writableEnded) {
        return
      }

      try {
        await handleSsrPage(request, response, async () => {
          return vite.ssrLoadModule('/src/entry-server.tsx') as Promise<{
            handlePageRequest: (options: unknown) => Promise<Response>
          }>
        }, pageOptions)
      } catch (error) {
        if (error instanceof Error) {
          vite.ssrFixStacktrace(error)
        }
        throw error
      }
    }),
  )

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

async function startProdServer(): Promise<void> {
  const clientDist = path.resolve(root, 'dist/client')
  const serverEntry = path.resolve(root, 'dist/server/entry-server.js')
  const pageOptions = getProdPageOptions(clientDist)

  const loadHandler = async () => {
    return import(pathToFileURL(serverEntry).href) as Promise<{
      handlePageRequest: (options: unknown) => Promise<Response>
    }>
  }

  const server = http.createServer(
    createRequestListener(async (request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.statusCode = 405
        response.end('Method Not Allowed')
        return
      }

      const served = await tryServeStaticFile(request, response, clientDist)
      if (served || response.writableEnded) {
        return
      }

      await handleSsrPage(request, response, loadHandler, pageOptions)
    }),
  )

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

if (isProduction) {
  await startProdServer()
} else {
  await startDevServer()
}
