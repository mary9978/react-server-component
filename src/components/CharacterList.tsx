import type { Character } from '../types/rickAndMorty.ts'

interface CharacterListProps {
  readonly characters: readonly Character[]
}

function statusClassName(status: Character['status']): string {
  if (status === 'Alive') return 'character-card__status character-card__status--alive'
  if (status === 'Dead') return 'character-card__status character-card__status--dead'
  return 'character-card__status character-card__status--unknown'
}

export function CharacterList({ characters }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <p className="character-list__empty" role="status">
        No characters found.
      </p>
    )
  }

  return (
    <ul className="character-list" aria-label="Rick and Morty characters">
      {characters.map((character) => (
        <li key={character.id}>
          <a
            href={`/character/${character.id}`}
            className="character-card character-card--link"
          >
            <img
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              loading="lazy"
              className="character-card__image"
            />
            <div className="character-card__body">
              <h2 className="character-card__name">{character.name}</h2>
              <p className="character-card__meta">
                <span className={statusClassName(character.status)}>
                  {character.status}
                </span>
                <span className="character-card__species">{character.species}</span>
              </p>
              <p className="character-card__location">
                Last known: {character.location.name}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
