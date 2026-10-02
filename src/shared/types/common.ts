export type UniqueID = string

type PrettifyObj<T> = { [K in keyof T]: T[K] } & {}
/** helper for arrays / tuples so their element type is also deep-expanded */
type PrettifyArray<A> = A extends readonly (infer U)[]
  ? ReadonlyArray<Prettify<U>>
  : never

// used to improve TS info readability, displays inlined objects instead of referring to the type
// example: instead of SpacingEntry['mb'], displays {marginBottom: number}
export type Prettify<T> =
  // leave functions untouched
  T extends (...args: unknown[]) => unknown
    ? T
    : // recurse into arrays / tuples
      T extends readonly unknown[]
      ? PrettifyArray<T>
      : // recurse into object literals
        T extends object
        ? PrettifyObj<{ [K in keyof T]: Prettify<T[K]> }>
        : T
