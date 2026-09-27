'use client'

import { useQuery } from '@tanstack/react-query'
import { charactersQueryOptions } from '../features/characters/charactersQuery.ts'
import type { Character } from '../types/rickAndMorty.ts'
import { CharacterList } from './CharacterList.tsx'
import { CharacterListSkeleton } from './CharacterListSkeleton.tsx'

interface CharacterListSectionProps {
  readonly initialCharacters: readonly Character[]
}

export function CharacterListSection({
  initialCharacters,
}: CharacterListSectionProps) {
  const { data, isPending, isError, error } = useQuery({
    ...charactersQueryOptions(),
    initialData: initialCharacters,
    staleTime: 60_000,
  })

  if (isPending) {
    return <CharacterListSkeleton />
  }

  if (isError) {
    return (
      <p className="character-list__empty" role="alert">
        {error instanceof Error ? error.message : 'Failed to load characters.'}
      </p>
    )
  }

  if (!data.length) {
    return (
      <p className="character-list__empty" role="status">
        No characters found.
      </p>
    )
  }

  return <CharacterList characters={data} />
}
