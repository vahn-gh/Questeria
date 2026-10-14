import React from 'react'

import { Image, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { CommonStyles } from 'shared/theme/commonStyles'

const BAND_COUNT = 40
const EDGE_RGB = [222, 164, 104]
const CENTER_RGB = [242, 198, 120]
const STREAK_SHIFT = 5
const PARCHMENT_IMAGE = require('./res/parchment.png')

const mixChannel = (edge: number, center: number, closeness: number) =>
  Math.round(edge + (center - edge) * closeness)

const pickBandColor = (index: number) => {
  const position = index / (BAND_COUNT - 1)
  const closeness = 1 - Math.abs(position - 0.5) * 2
  const streak = index % 2 === 0 ? 0 : STREAK_SHIFT
  const channels = EDGE_RGB.map(
    (edge, channel) =>
      mixChannel(edge, CENTER_RGB[channel], closeness ** 0.8) - streak
  )

  return `rgb(${channels.join(', ')})`
}

const BAND_COLORS = Array.from({ length: BAND_COUNT }, (_, index) =>
  pickBandColor(index)
)

export const QuestBoard = () => (
  <View style={CommonStyles.absoluteFill}>
    {BAND_COLORS.map((color, index) => (
      <View
        key={index}
        style={[CommonStyles.flex1, { backgroundColor: color }]}
      />
    ))}
    <Image
      source={PARCHMENT_IMAGE}
      style={CommonStyles.absoluteFill}
      resizeMode="cover"
    />
    <View style={ss.edge} />
  </View>
)

const ss = StyleSheet.create(theme => ({
  edge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    backgroundColor: theme.colors.Primary,
  },
}))
