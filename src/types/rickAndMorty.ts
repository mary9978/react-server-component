export interface CharacterLocation {
  readonly name: string
  readonly url: string
}

export interface Character {
  readonly id: number
  readonly name: string
  readonly status: 'Alive' | 'Dead' | 'unknown'
  readonly species: string
  readonly type: string
  readonly gender: string
  readonly origin: CharacterLocation
  readonly location: CharacterLocation
  readonly image: string
  readonly episode: readonly string[]
  readonly url: string
  readonly created: string
}

export interface CharactersResponse {
  readonly info: {
    readonly count: number
    readonly pages: number
    readonly next: string | null
    readonly prev: string | null
  }
  readonly results: readonly Character[]
}
