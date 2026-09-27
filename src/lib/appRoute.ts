export type AppRoute =
  | { readonly kind: 'list' }
  | { readonly kind: 'detail'; readonly id: number }
  | { readonly kind: 'notFound' }

const DETAIL_PATH = /^\/character\/(\d+)\/?$/

export function parseAppRoute(pathname: string): AppRoute {
  if (pathname === '/' || pathname === '') {
    return { kind: 'list' }
  }

  const detailMatch = DETAIL_PATH.exec(pathname)
  if (detailMatch) {
    const id = Number(detailMatch[1])
    if (Number.isInteger(id) && id > 0) {
      return { kind: 'detail', id }
    }
  }

  return { kind: 'notFound' }
}
