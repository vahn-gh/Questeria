import { FlexStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes'

import { Prettify } from 'shared/types/common'

// m - margin, p - padding
type SpacingType = 'm' | 'p'
// '' - all
// h - horizontal, v - vertical
// t - top, b - bottom, l - left, r - right
type SpacingPrefixType = '' | 'h' | 'v' | 't' | 'l' | 'r' | 'b'
type SpacingValueType = 0 | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 36

type SpacingNameType = `${SpacingType}${SpacingPrefixType}` | 'gap'

const SPACING_NAME_MAP = {
  m: 'margin',
  mh: 'marginHorizontal',
  mv: 'marginVertical',
  mt: 'marginTop',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  p: 'padding',
  ph: 'paddingHorizontal',
  pv: 'paddingVertical',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  gap: 'gap',
} as const satisfies Record<SpacingNameType, keyof FlexStyle>

type SpacingProp<N extends SpacingNameType> = (typeof SPACING_NAME_MAP)[N]

type SpacingEntry<N extends SpacingNameType> = {
  [K in SpacingProp<N>]: number
}
export type ISpacing = {
  [N in SpacingNameType as `${N}${SpacingValueType}`]: SpacingEntry<N>
}

const SPACING_NAMES = Object.keys(SPACING_NAME_MAP) as SpacingNameType[]

const RANGE: SpacingValueType[] = [0, 2, 4, 8, 12, 16, 20, 24, 32, 36]

// Values from RANGE are equals to spacings in Figma (Large screen size, UNIT=8px)
// it means that if you see margin 24px in Figma, you can freely use mb24
// values for other screen-sizes (small, medium) will be calculated proportionally
// Example: mb24
// 1) Small device (deviceWidth <= 350px), UNIT=4px
//   - Value: 12px
// 2) Medium device (deviceWidth > 350px && deviceHeight <= 684px), UNIT=6px
//   - Value: 18px
// 2) Medium device (deviceWidth > 350px && deviceHeight > 684px), UNIT=8px
//   - Value: 24px
export const generateSpacingStyles = () => {
  return RANGE.reduce((acc, rangeValue) => {
    SPACING_NAMES.forEach(name => {
      const key = `${name}${rangeValue}` as keyof ISpacing

      acc[key] = {
        [SPACING_NAME_MAP[name]]: rangeValue,
      } as SpacingEntry<typeof name>
    })
    return acc
  }, {} as Prettify<ISpacing>)
}
