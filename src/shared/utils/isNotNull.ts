export type Maybe<T> = null | undefined | T

export function isNotNull<T>(param: Maybe<T>): param is T {
  return param !== undefined && param !== null
}

export function isNull<T>(param: Maybe<T>): param is undefined | null {
  return param === undefined || param === null
}
