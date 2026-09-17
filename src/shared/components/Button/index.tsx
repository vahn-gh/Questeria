import React, { useCallback, useState } from 'react'

import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { PixelBorder } from 'shared/components/PixelBorder'
import { ColorNameType, useColors } from 'shared/theme/colors'
import { triggerHaptic } from 'shared/utils/triggerHaptic'

import { Typography } from '../Typography'

export type ButtonType = 'primary'
type ButtonSize = 'small' | 'medium'

interface ButtonTypeStateStyle {
  textColor: ColorNameType
  fillColor?: ColorNameType
  bevel?: boolean
}

type ButtonState = 'default' | 'disabled' | 'pressed'
type ButtonStyleConfig = Record<ButtonState, ButtonTypeStateStyle>
const STYLE_KEYS: Record<ButtonType, ButtonStyleConfig> = {
  primary: {
    default: {
      textColor: 'Tertiary',
      fillColor: 'Primary',
      bevel: true,
    },
    pressed: {
      textColor: 'Tertiary',
      fillColor: 'Quaternary',
    },
    disabled: {
      textColor: 'Secondary',
    },
  },
}

export interface Props extends Pick<PressableProps, 'onPress' | 'disabled'> {
  type?: ButtonType
  size?: ButtonSize
  haptic?: boolean
  loading?: boolean
  onPressAsync?: () => Promise<void>
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

export const Button: React.FC<Props> = ({
  type = 'primary',
  size = 'medium',
  haptic,
  loading,
  onPressAsync,
  disabled,
  onPress,
  style,
  children,
  ...props
}) => {
  const colors = useColors()

  const [asyncLoading, setAsyncLoading] = useState(false)
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 })

  const isLoading = loading || asyncLoading
  const isDisabled = disabled

  const handlePress = (evt: GestureResponderEvent) => {
    if (onPress || onPressAsync) {
      if (haptic) {
        triggerHaptic()
      }

      if (onPress) {
        onPress(evt)
      } else {
        setAsyncLoading(true)
        // @ts-expect-error we already checked that onPressAsync is not null
        onPressAsync().finally(() => {
          setAsyncLoading(false)
        })
      }
    }
  }

  const handleLayout = useCallback((evt: LayoutChangeEvent) => {
    const { width, height } = evt.nativeEvent.layout
    setLayoutSize({ width, height })
  }, [])

  const config = STYLE_KEYS[type]

  const hasRightIcon = Boolean(isLoading)

  const buttonStyle: StyleProp<ViewStyle> = [
    ss.main,
    size === 'small' && ss.small,
    size === 'medium' && ss.medium,
    { paddingHorizontal: hasRightIcon ? 36 : 16 },
    style,
  ]

  const textColor = config[isDisabled ? 'disabled' : 'default'].textColor

  return (
    <Pressable
      disabled={isDisabled || isLoading}
      style={buttonStyle}
      onLayout={handleLayout}
      onPress={handlePress}
      {...props}
    >
      {({ pressed }) => {
        const state: ButtonState = isDisabled
          ? 'disabled'
          : pressed
            ? 'pressed'
            : 'default'

        const stateConfig = config[state]

        return (
          <>
            <PixelBorder
              width={layoutSize.width}
              height={layoutSize.height}
              color={
                stateConfig.fillColor
                  ? colors[stateConfig.fillColor]
                  : undefined
              }
              outlineColor={colors.Outline}
              bevel={Boolean(stateConfig.bevel)}
            />
            <Typography numberOfLines={1} type="h5" color={textColor}>
              {children}
            </Typography>
          </>
        )
      }}
    </Pressable>
  )
}

const ss = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
  },
  small: {
    height: 40,
  },
  medium: {
    height: 48,
  },
})
