import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { renderToReadableStream } from 'react-dom/server'
import App, {
  loadAppCharacter,
  loadAppCharacters,
  type AppAssets,
} from './App.tsx'
import { parseAppRoute } from './lib/appRoute.ts'
import { createQueryClient } from './lib/queryClient.ts'
import type { AppPageData } from './types/ssr.ts'
import './index.css'

export interface PageRequestOptions {
  readonly bootstrapModule: string
  readonly assets: AppAssets
  readonly url: string
}

async function loadPageData(route: ReturnType<typeof parseAppRoute>): Promise<
  AppPageData | 'notFound'
> {
  if (route.kind === 'notFound') {
    return 'notFound'
  }

  if (route.kind === 'list') {
    return {
      kind: 'list',
      initialCharacters: await loadAppCharacters(),
    }
  }

  try {
    return {
      kind: 'detail',
      initialCharacter: await loadAppCharacter(route.id),
    }
  } catch {
    return 'notFound'
  }
}

export async function handlePageRequest(
  options: PageRequestOptions,
): Promise<Response> {
  const pathname = new URL(options.url, 'http://ssr.local').pathname
  const route = parseAppRoute(pathname)
  const page = await loadPageData(route)

  if (page === 'notFound') {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  const queryClient = createQueryClient()

  const stream = await renderToReadableStream(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App assets={options.assets} page={page} />
      </QueryClientProvider>
    </StrictMode>,
    {
      bootstrapModules: [options.bootstrapModule],
    },
  )

  return new Response(stream, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
