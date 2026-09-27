import type { Character } from './rickAndMorty.ts'

export interface AppAssets {
  readonly stylesheets: readonly string[]
  readonly injectViteClient: boolean
}

export type AppPageData =
  | { readonly kind: 'list'; readonly initialCharacters: readonly Character[] }
  | { readonly kind: 'detail'; readonly initialCharacter: Character }

export interface SsrPayload {
  readonly assets: AppAssets
  readonly page: AppPageData
}
