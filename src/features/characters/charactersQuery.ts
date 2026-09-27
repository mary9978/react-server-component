import { queryOptions } from '@tanstack/react-query'
import type { Character } from '../../types/rickAndMorty.ts'
import { fetchCharacters } from './fetchCharacters.ts'

export const charactersQueryKey = ['characters'] as const

export function charactersQueryOptions() {
  return queryOptions({
    queryKey: charactersQueryKey,
    queryFn: async (): Promise<readonly Character[]> => {
      const response = await fetchCharacters()
      return response.results
    },
  })
}
