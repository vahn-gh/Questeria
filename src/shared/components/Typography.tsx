import React, { useMemo } from 'react'

import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'

import { ColorNameType, useColors } from 'shared/theme/colors'

export const SUPPORTED_FONTS = {
  MAIN_BOLD: 'PixelifySans-Bold',
  MAIN_SEMI_BOLD: 'PixelifySans-SemiBold',
  MAIN_MEDIUM: 'PixelifySans-Medium',
  MAIN_REGULAR: 'PixelifySans-Regular',
}

export type TypographyType =
  // Titles
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  // Paragraphs
  | 'p1'
  | 'p1_light'
  | 'p1_regular'
  | 'p2'
  | 'p2_light'
  | 'p2_regular'
  | 'p3'
  | 'p3_light'
  | 'p3_regular'
  | 'p4'
  | 'p4_light'
  | 'p4_regular'

type TypographyAlign = 'left' | 'center' | 'right' | 'justify'

export interface ITypographyProps extends TextProps {
  type: TypographyType
  children?: string | React.ReactNode
  style?: StyleProp<TextStyle>
  color?: ColorNameType
  colorValue?: string // hex, rgba and so on
  align?: TypographyAlign
}

export const Typography = ({
  type,
  color,
  children,
  style,
  align,
  colorValue,
  ...textProps
}: ITypographyProps) => {
  const colors = useColors()

  const styles = useMemo(() => {
    const colorRes = colorValue || colors[color || 'Primary']

    return [
      ss.root,
      {
        color: colorRes,
      },
      ssFontTypeMap[type],
      align ? ssTextAlign[align] : undefined,
      style,
    ]
  }, [align, type, style, colorValue, color, colors])

  return (
    <Text style={styles} allowFontScaling={false} {...textProps}>
      {children}
    </Text>
  )
}

const ssTextAlign = StyleSheet.create<
  Record<TypographyAlign, Pick<TextStyle, 'textAlign'>>
>({
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  justify: {
    textAlign: 'justify',
  },
})

const ss = StyleSheet.create({
  root: {
    flexShrink: 1,
  },
})

export const ssFontTypeMap = StyleSheet.create<
  Record<
    TypographyType,
    Required<Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight'>> &
      Pick<TextStyle, 'textDecorationLine' | 'letterSpacing'>
  >
>({
  h1: {
    fontFamily: SUPPORTED_FONTS.MAIN_BOLD,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: 0.45,
  },
  h2: {
    fontFamily: SUPPORTED_FONTS.MAIN_BOLD,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.4,
  },
  h3: {
    fontFamily: SUPPORTED_FONTS.MAIN_BOLD,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: 0.325,
  },
  h4: {
    fontFamily: SUPPORTED_FONTS.MAIN_BOLD,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.275,
  },
  h5: {
    fontFamily: SUPPORTED_FONTS.MAIN_BOLD,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.225,
  },
  h6: {
    fontFamily: SUPPORTED_FONTS.MAIN_BOLD,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  p1: {
    fontFamily: SUPPORTED_FONTS.MAIN_SEMI_BOLD,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.225,
  },
  p1_light: {
    fontFamily: SUPPORTED_FONTS.MAIN_MEDIUM,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.225,
  },
  p1_regular: {
    fontFamily: SUPPORTED_FONTS.MAIN_REGULAR,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.225,
  },
  p2: {
    fontFamily: SUPPORTED_FONTS.MAIN_SEMI_BOLD,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  p2_light: {
    fontFamily: SUPPORTED_FONTS.MAIN_MEDIUM,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  p2_regular: {
    fontFamily: SUPPORTED_FONTS.MAIN_REGULAR,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  p3: {
    fontFamily: SUPPORTED_FONTS.MAIN_SEMI_BOLD,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.175,
  },
  p3_light: {
    fontFamily: SUPPORTED_FONTS.MAIN_MEDIUM,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.175,
  },
  p3_regular: {
    fontFamily: SUPPORTED_FONTS.MAIN_REGULAR,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.175,
  },
  p4: {
    fontFamily: SUPPORTED_FONTS.MAIN_SEMI_BOLD,
    fontSize: 12,
    lineHeight: 16.8,
  },
  p4_light: {
    fontFamily: SUPPORTED_FONTS.MAIN_MEDIUM,
    fontSize: 12,
    lineHeight: 16.8,
  },
  p4_regular: {
    fontFamily: SUPPORTED_FONTS.MAIN_REGULAR,
    fontSize: 12,
    lineHeight: 16.8,
  },
})
