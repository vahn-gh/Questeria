type PlainObject = Record<string, unknown>

const isRealmList = (val: unknown): val is ArrayLike<unknown> =>
  Object.prototype.toString.call(val) === '[object List]'

const isObject = (val: unknown): val is PlainObject =>
  typeof val === 'object' && val !== null

// used as a utility to transform realm objects to plain js objects
// looks ugly, but it's the most performant way to copy objects
// ref: https://github.com/lukeed/klona/blob/master/src/json.js (adapted for realm)
function deepCopyObjects(val: unknown): unknown {
  if (isRealmList(val)) {
    let i = val.length
    const list: unknown[] = new Array(i)

    while (i--) {
      const item = val[i]
      list[i] = isObject(item) ? deepCopyObjects(item) : item
    }

    return list
  }

  // other objects like [object Building], [object BuildingApartment]
  const src = isObject(val) ? val : {}
  const out: PlainObject = {}

  // oxlint-disable-next-line guard-for-in
  for (const key in src) {
    const item = src[key]
    out[key] = isObject(item) ? deepCopyObjects(item) : item
  }

  return out
}

export const convertToArray = <T>(
  objects: Iterable<unknown> | ArrayLike<unknown>
): T[] => Array.from(objects, deepCopyObjects) as T[]
