import type { SsrPayload } from './types/ssr.ts'

declare global {
  interface Window {
    readonly __SSR_DATA__: SsrPayload
  }
}

export {}
