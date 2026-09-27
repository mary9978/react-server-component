import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { getBrowserQueryClient } from './lib/queryClient.ts'

const { assets, page } = window.__SSR_DATA__
const queryClient = getBrowserQueryClient()

hydrateRoot(
  document,
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App
        assets={{ ...assets, injectViteClient: false }}
        page={page}
        embedSsrPayload={false}
      />
    </QueryClientProvider>
  </StrictMode>,
)
