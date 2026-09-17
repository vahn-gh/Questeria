import React from 'react'

import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'

import { ColorNameType, useColors } from 'shared/theme/colors'

import CloseIcon from './assets/close.svg'

const ICON_MAP = {
  close: CloseIcon,
} as const

export type IconNameType = keyof typeof ICON_MAP

export const ICON_NAMES = Object.keys(ICON_MAP) as IconNameType[]

interface IProps {
  name: IconNameType
  colorValue?: string
  color?: ColorNameType
  size?: number
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}
export const Icon = ({
  name,
  colorValue,
  color = 'Primary',
  size = 24,
  onPress,
  style,
}: IProps) => {
  const colors = useColors()
  const IconFromMap = ICON_MAP[name]

  const resColor = colorValue ? colorValue : colors[color]
  const fillProp = resColor ? { ['fill']: resColor } : {}

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
        <IconFromMap height={size} width={size} {...fillProp} />
      </TouchableOpacity>
    )
  }
  return <IconFromMap style={style} height={size} width={size} {...fillProp} />
}
