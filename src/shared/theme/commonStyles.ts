import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { Prettify } from 'shared/types/common'

import { generateSpacingStyles } from './spacing'

type StyleItem = ViewStyle | TextStyle | ImageStyle

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export const CommonStyles = Object.assign(
  StyleSheet.create({
    flex1: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    absoluteFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    ...generateSpacingStyles(),
  }),
  {
    merge<T extends [StyleItem, StyleItem, ...Array<StyleItem>]>(objects: T) {
      return StyleSheet.flatten(objects) as Prettify<
        UnionToIntersection<T[number]>
      >
    },
  }
)
