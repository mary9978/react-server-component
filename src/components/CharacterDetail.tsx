import type { Character } from '../types/rickAndMorty.ts'

interface CharacterDetailProps {
  readonly character: Character
}

function statusClassName(status: Character['status']): string {
  if (status === 'Alive') return 'character-card__status character-card__status--alive'
  if (status === 'Dead') return 'character-card__status character-card__status--dead'
  return 'character-card__status character-card__status--unknown'
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  return (
    <article className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        width={400}
        height={400}
        className="character-detail__image"
      />
      <div className="character-detail__body">
        <h1 className="character-detail__name">{character.name}</h1>
        <p className="character-detail__meta">
          <span className={statusClassName(character.status)}>
            {character.status}
          </span>
          <span className="character-card__species">{character.species}</span>
          {character.type ? (
            <span className="character-detail__type">{character.type}</span>
          ) : null}
        </p>
        <dl className="character-detail__facts">
          <div>
            <dt>Gender</dt>
            <dd>{character.gender}</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>{character.origin.name}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{character.location.name}</dd>
          </div>
          <div>
            <dt>Episodes</dt>
            <dd>{character.episode.length}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
