import React, { useEffect } from 'react'

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

const POTION_SIZE = 200
// Neck points top-right at rest; a full turn plus 90deg clockwise leaves it bottom-right, forming a Q
const FINAL_ROTATION_DEG = 360 + 90

export const PotionSpin = () => {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withSpring(FINAL_ROTATION_DEG, {
      damping: 12,
      stiffness: 60,
      mass: 1,
    })
  }, [rotation])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  return (
    <Animated.Image
      source={require('./res/QuesteriaPotion.png')}
      style={[ss.potion, animatedStyle]}
    />
  )
}

const ss = StyleSheet.create({
  potion: {
    width: POTION_SIZE,
    height: POTION_SIZE,
  },
})
