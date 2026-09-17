import React, { useId, useMemo } from 'react'

import { StyleSheet } from 'react-native'

import Svg, { ClipPath, Defs, Path, Rect } from 'react-native-svg'

import { shadeHexColor } from 'shared/utils/shadeHexColor'

const CORNER_SIZE = 8
const CORNER_STEPS = 2
const BORDER_WIDTH = 3
const HIGHLIGHT_RATIO = 0.4
const LIP_HEIGHT = 5

type Axis = 'x' | 'y'

const buildStaircase = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  steps: number,
  firstAxis: Axis
) => {
  const dx = (x1 - x0) / steps
  const dy = (y1 - y0) / steps

  let cx = x0
  let cy = y0
  const commands: string[] = []

  for (let i = 0; i < steps; i++) {
    if (firstAxis === 'x') {
      cx += dx
      commands.push(`L ${cx} ${cy}`)
      cy += dy
      commands.push(`L ${cx} ${cy}`)
    } else {
      cy += dy
      commands.push(`L ${cx} ${cy}`)
      cx += dx
      commands.push(`L ${cx} ${cy}`)
    }
  }

  return commands.join(' ')
}

// Each corner's first step must move away from the axis of the edge
// it arrives from, otherwise that step is collinear with the edge and
// visually disappears, leaving only one visible step instead of two.
const buildPixelRectPath = (width: number, height: number) => {
  const r = Math.min(CORNER_SIZE, width / 2, height / 2)

  return [
    `M ${r} 0`,
    `L ${width - r} 0`,
    buildStaircase(width - r, 0, width, r, CORNER_STEPS, 'y'),
    `L ${width} ${height - r}`,
    buildStaircase(width, height - r, width - r, height, CORNER_STEPS, 'x'),
    `L ${r} ${height}`,
    buildStaircase(r, height, 0, height - r, CORNER_STEPS, 'y'),
    `L 0 ${r}`,
    buildStaircase(0, r, r, 0, CORNER_STEPS, 'x'),
    'Z',
  ].join(' ')
}

interface Props {
  width: number
  height: number
  color?: string
  outlineColor?: string
  bevel?: boolean
}

export const PixelBorder = ({
  width,
  height,
  color,
  outlineColor,
  bevel = true,
}: Props) => {
  const clipId = `pixel-border-clip-${useId()}`

  const path = useMemo(() => buildPixelRectPath(width, height), [width, height])

  const showBevel = bevel && Boolean(color)
  const highlight = useMemo(
    () => (color ? shadeHexColor(color, 22) : color),
    [color]
  )
  const lip = useMemo(
    () => (color ? shadeHexColor(color, -30) : color),
    [color]
  )

  if (!width || !height) {
    return null
  }

  return (
    <Svg width={width} height={height} style={ss.svg} pointerEvents="none">
      <Defs>
        <ClipPath id={clipId}>
          <Path d={path} />
        </ClipPath>
      </Defs>

      <Path d={path} fill={color || 'none'} />

      {showBevel && (
        <>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height * HIGHLIGHT_RATIO}
            fill={highlight}
            clipPath={`url(#${clipId})`}
          />
          <Rect
            x={0}
            y={height - LIP_HEIGHT}
            width={width}
            height={LIP_HEIGHT}
            fill={lip}
            clipPath={`url(#${clipId})`}
          />
        </>
      )}

      <Path
        d={path}
        fill="none"
        stroke={outlineColor}
        strokeWidth={BORDER_WIDTH}
      />
    </Svg>
  )
}

const ss = StyleSheet.create({
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
})
