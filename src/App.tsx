import { CharacterDetailSection } from './components/CharacterDetailSection.tsx'
import { CharacterListSection } from './components/CharacterListSection.tsx'
import { InlineSsrData } from './components/InlineSsrData.tsx'
import {
  fetchCharacterById,
  fetchCharacters,
} from './features/characters/fetchCharacters.ts'
import type { Character } from './types/rickAndMorty.ts'
import type { AppAssets, AppPageData } from './types/ssr.ts'
import './App.css'

export type { AppAssets } from './types/ssr.ts'

interface AppProps {
  readonly assets: AppAssets
  readonly page: AppPageData
  readonly embedSsrPayload?: boolean
}

export async function loadAppCharacters(): Promise<readonly Character[]> {
  const response = await fetchCharacters()
  return response.results
}

export async function loadAppCharacter(id: number): Promise<Character> {
  return fetchCharacterById(id)
}

function pageTitle(page: AppPageData): string {
  if (page.kind === 'detail') {
    return `${page.initialCharacter.name} — Rick and Morty`
  }
  return 'Rick and Morty Characters (SSR)'
}

export default function App({
  assets,
  page,
  embedSsrPayload = true,
}: AppProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle(page)}</title>
        {assets.injectViteClient ? (
          <script type="module" src="/@vite/client" />
        ) : null}
        {assets.stylesheets.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>
        <div id="root">
          <section id="center">
            {page.kind === 'list' ? (
              <>
                <div>
                  <h1>Rick and Morty Characters (SSR)</h1>
                  <p className="ssr-note">
                    Data loaded on the server — the Rick and Morty API is not
                    called from your browser on first paint.
                  </p>
                </div>
                <CharacterListSection
                  initialCharacters={page.initialCharacters}
                />
              </>
            ) : (
              <>
                <nav className="page-nav" aria-label="Breadcrumb">
                  <a className="page-nav__link" href="/">
                    ← All characters
                  </a>
                </nav>
                <CharacterDetailSection
                  initialCharacter={page.initialCharacter}
                />
              </>
            )}
          </section>
        </div>
        {embedSsrPayload ? (
          <InlineSsrData assets={assets} page={page} />
        ) : null}
      </body>
    </html>
  )
}
