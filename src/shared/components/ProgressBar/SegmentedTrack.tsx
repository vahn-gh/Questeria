import { StyleProp, View, ViewStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { ColorNameType, useColors } from 'shared/theme/colors'
import { CommonStyles } from 'shared/theme/commonStyles'

import { PixelBox } from '../PixelBox'

const DEFAULT_SEGMENTS = 6
const DEFAULT_EMPTY_COLOR = '#FFFFFF'
const DEFAULT_BORDER_WIDTH = 3
const DEFAULT_DIVIDER_WIDTH = 3

interface Props {
  percentage: number
  axis?: 'width' | 'height'
  segments?: number
  color?: ColorNameType
  emptyColor?: string
  borderWidth?: number
  dividerWidth?: number
  style?: StyleProp<ViewStyle>
}

export const SegmentedTrack: React.FC<Props> = ({
  percentage,
  axis = 'width',
  segments = DEFAULT_SEGMENTS,
  color = 'Secondary',
  emptyColor = DEFAULT_EMPTY_COLOR,
  borderWidth = DEFAULT_BORDER_WIDTH,
  dividerWidth = DEFAULT_DIVIDER_WIDTH,
  style,
}) => {
  const colors = useColors()
  const fillColor = colors[color] ?? emptyColor
  const outlineColor = colors.Outline ?? '#000000'
  const filledCount = Math.round((percentage / 100) * segments)

  const isHorizontal = axis === 'width'

  return (
    <PixelBox
      options={{
        outlineColor,
        borderWidth,
        useMask: true,
      }}
    >
      <View
        style={[
          isHorizontal ? ss.horizontal : ss.vertical,
          {
            backgroundColor: outlineColor,
          },
          isHorizontal
            ? {
                columnGap: dividerWidth,
              }
            : { rowGap: dividerWidth },
          style,
        ]}
      >
        {Array.from({ length: segments }, (_, index) => (
          <View
            key={index}
            style={[
              CommonStyles.flex1,
              {
                backgroundColor: index < filledCount ? fillColor : emptyColor,
              },
            ]}
          />
        ))}
      </View>
    </PixelBox>
  )
}

const ss = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column-reverse',
  },
})
