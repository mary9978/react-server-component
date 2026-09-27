const SKELETON_CARD_COUNT = 8

function CharacterCardSkeleton() {
  return (
    <li>
      <article className="character-card character-card--skeleton">
        <div className="character-card__skeleton-image skeleton-shimmer" />
        <div className="character-card__body">
          <div className="character-card__skeleton-line character-card__skeleton-line--title skeleton-shimmer" />
          <div className="character-card__skeleton-line character-card__skeleton-line--meta skeleton-shimmer" />
          <div className="character-card__skeleton-line character-card__skeleton-line--location skeleton-shimmer" />
        </div>
      </article>
    </li>
  )
}

interface CharacterListSkeletonProps {
  readonly count?: number
}

export function CharacterListSkeleton({
  count = SKELETON_CARD_COUNT,
}: CharacterListSkeletonProps) {
  return (
    <ul
      className="character-list character-list--loading"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading characters"
    >
      {Array.from({ length: count }, (_, index) => (
        <CharacterCardSkeleton key={index} />
      ))}
    </ul>
  )
}
