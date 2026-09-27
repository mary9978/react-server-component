import type { AppAssets, AppPageData } from '../types/ssr.ts'

interface InlineSsrDataProps {
  readonly assets: AppAssets
  readonly page: AppPageData
}

export function InlineSsrData({ assets, page }: InlineSsrDataProps) {
  const payload = JSON.stringify({ assets, page }).replace(/</g, '\\u003c')

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__SSR_DATA__=${payload}`,
      }}
    />
  )
}
