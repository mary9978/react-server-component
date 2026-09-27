import fs from 'node:fs'
import path from 'node:path'
import type { AppAssets } from '../src/types/ssr.ts'

interface ProdClientBundle {
  readonly bootstrapModule: string
  readonly assets: AppAssets
}

let cachedProdBundle: ProdClientBundle | null = null

export function getDevPageOptions(): {
  readonly bootstrapModule: string
  readonly assets: AppAssets
} {
  return {
    bootstrapModule: '/src/entry-client.tsx',
    assets: {
      stylesheets: ['/src/index.css', '/src/App.css'],
      injectViteClient: true,
    },
  }
}

export function getProdPageOptions(clientDist: string): ProdClientBundle {
  if (cachedProdBundle) {
    return cachedProdBundle
  }

  const indexHtml = fs.readFileSync(
    path.join(clientDist, 'index.html'),
    'utf-8',
  )

  const bootstrapModule = indexHtml.match(/src="(\/assets\/[^"]+\.js)"/)?.[1]
  if (!bootstrapModule) {
    throw new Error('Could not find client bundle in dist/client/index.html')
  }

  const stylesheets = [
    ...indexHtml.matchAll(/href="(\/assets\/[^"]+\.css)"/g),
  ].map((match) => match[1])

  cachedProdBundle = {
    bootstrapModule,
    assets: {
      stylesheets,
      injectViteClient: false,
    },
  }

  return cachedProdBundle
}
