'use client'

import { useQuery } from '@tanstack/react-query'
import { characterDetailQueryOptions } from '../features/characters/characterDetailQuery.ts'
import type { Character } from '../types/rickAndMorty.ts'
import { CharacterDetail } from './CharacterDetail.tsx'
import { CharacterListSkeleton } from './CharacterListSkeleton.tsx'

interface CharacterDetailSectionProps {
  readonly initialCharacter: Character
}

export function CharacterDetailSection({
  initialCharacter,
}: CharacterDetailSectionProps) {
  const { data, isPending, isError, error } = useQuery({
    ...characterDetailQueryOptions(initialCharacter.id),
    initialData: initialCharacter,
    staleTime: 60_000,
  })

  if (isPending) {
    return <CharacterListSkeleton count={1} />
  }

  if (isError) {
    return (
      <p className="character-list__empty" role="alert">
        {error instanceof Error ? error.message : 'Failed to load character.'}
      </p>
    )
  }

  return <CharacterDetail character={data} />
}
