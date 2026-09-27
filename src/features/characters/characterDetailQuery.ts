import { queryOptions } from '@tanstack/react-query'
import type { Character } from '../../types/rickAndMorty.ts'
import { fetchCharacterById } from './fetchCharacters.ts'

export function characterDetailQueryKey(id: number) {
  return ['character', id] as const
}

export function characterDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: characterDetailQueryKey(id),
    queryFn: (): Promise<Character> => fetchCharacterById(id),
  })
}
