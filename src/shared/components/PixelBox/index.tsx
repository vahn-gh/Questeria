import React, { useCallback, useId, useMemo, useState } from 'react'

import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native'

import RNMaskedView from '@react-native-masked-view/masked-view'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
import { StyleSheet } from 'react-native-unistyles'

import { PixelRectPath } from 'shared/utils/PixelRectPath'
import { shadeHexColor } from 'shared/utils/shadeHexColor'

import {
  DEFAULT_BORDER_WIDTH,
  DEFAULT_HIGHLIGHT_RATIO,
  DEFAULT_LIP_HEIGHT,
} from './constants'

interface PixelBoxOptions {
  backgroundColor?: string
  outlineColor?: string
  bevel?: boolean
  borderWidth?: number
  highlightRation?: number
  lipHeight?: number
  useMask?: boolean
}

interface Props {
  options?: PixelBoxOptions
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

const MaskedView = RNMaskedView as unknown as React.FC<{
  style?: StyleProp<ViewStyle>
  maskElement: React.ReactElement
  children?: React.ReactNode
}>

export const PixelBox: React.FC<Props> = ({ options, style, children }) => {
  const backgroundColor = options?.backgroundColor
  const outlineColor = options?.outlineColor || '#000000'
  const isBevelVisible = options?.bevel && backgroundColor
  const borderWidth = options?.borderWidth || DEFAULT_BORDER_WIDTH
  const highlightRation = options?.highlightRation || DEFAULT_HIGHLIGHT_RATIO
  const lipHeight = options?.lipHeight || DEFAULT_LIP_HEIGHT

  const clipId = `pixel-border-clip-${useId()}`

  const [layoutSize, setLayoutSize] = useState({
    width: 0,
    height: 0,
  })
  const handleLayout = useCallback((evt: LayoutChangeEvent) => {
    const { width, height } = evt.nativeEvent.layout
    setLayoutSize({ width, height })
  }, [])

  const { width, height } = layoutSize

  const translate = `translate(${borderWidth / 2}, ${borderWidth / 2})`

  const innerWidth = Math.max(width - borderWidth, 0)
  const innerHeight = Math.max(height - borderWidth, 0)

  const path = useMemo(
    () => PixelRectPath.build(innerWidth, innerHeight),
    [innerWidth, innerHeight]
  )

  const highlight = useMemo(
    () =>
      backgroundColor ? shadeHexColor(backgroundColor, 22) : backgroundColor,
    [backgroundColor]
  )
  const lip = useMemo(
    () =>
      backgroundColor ? shadeHexColor(backgroundColor, -30) : backgroundColor,
    [backgroundColor]
  )

  const hasSize = width > 0 && height > 0
  const hasBackground = hasSize && backgroundColor

  return (
    <View style={style} onLayout={handleLayout}>
      {hasBackground && (
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <ClipPath id={clipId}>
              <Path d={path} />
            </ClipPath>
          </Defs>

          <G transform={translate}>
            <Path d={path} fill={backgroundColor} />

            {isBevelVisible && (
              <>
                <Rect
                  x={0}
                  y={0}
                  width={innerWidth}
                  height={innerHeight * highlightRation}
                  fill={highlight}
                  clipPath={`url(#${clipId})`}
                />
                <Rect
                  x={0}
                  y={innerHeight - lipHeight}
                  width={innerWidth}
                  height={lipHeight}
                  fill={lip}
                  clipPath={`url(#${clipId})`}
                />
              </>
            )}
          </G>
        </Svg>
      )}

      {hasSize && options?.useMask ? (
        <MaskedView
          maskElement={
            <Svg width={width} height={height}>
              <G transform={translate}>
                <Path d={path} fill="#000" />
              </G>
            </Svg>
          }
        >
          {children}
        </MaskedView>
      ) : (
        children
      )}

      {hasSize && (
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <G transform={translate}>
            <Path
              d={path}
              fill="none"
              stroke={outlineColor}
              strokeWidth={borderWidth}
            />
          </G>
        </Svg>
      )}
    </View>
  )
}
