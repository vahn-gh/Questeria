import React from 'react'

import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

const SPRITE_FRAME_COUNT = 3
const SPRITE_ASPECT_RATIO = 374 / 147
const FRAME_HEIGHT = 36
const SPRITE_WIDTH = FRAME_HEIGHT * SPRITE_ASPECT_RATIO
const FRAME_WIDTH = SPRITE_WIDTH / SPRITE_FRAME_COUNT
const FRAME_DURATION = 160

// Sprite frames 1 -> 2 -> 1 -> 3, so the loaf shakes from side to side
const FRAME_SEQUENCE = [0, 1, 0, 2]

export const BreadLoafAnimated = () => {
  const frameIndex = useSharedValue(0)

  useFrameCallback(frameInfo => {
    const step =
      Math.floor(frameInfo.timestamp / FRAME_DURATION) % FRAME_SEQUENCE.length

    frameIndex.value = FRAME_SEQUENCE[step]
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -frameIndex.value * FRAME_WIDTH }],
  }))

  return (
    <Animated.View style={ss.container}>
      <Animated.Image
        style={[ss.image, animatedStyle]}
        source={require('./res/bread_loaf.png')}
      />
    </Animated.View>
  )
}

const ss = StyleSheet.create({
  container: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    width: SPRITE_WIDTH,
    height: FRAME_HEIGHT,
  },
})
