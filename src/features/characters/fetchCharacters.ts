import type { Character, CharactersResponse } from '../../types/rickAndMorty.ts'

const CHARACTERS_API = 'https://rickandmortyapi.com/api/character'

export async function fetchCharacters(): Promise<CharactersResponse> {
  const response = await fetch(CHARACTERS_API)

  if (!response.ok) {
    throw new Error(`Failed to load characters: ${response.status}`)
  }

  return response.json() as Promise<CharactersResponse>
}

export async function fetchCharacterById(id: number): Promise<Character> {
  const response = await fetch(`${CHARACTERS_API}/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to load character: ${response.status}`)
  }

  return response.json() as Promise<Character>
}
