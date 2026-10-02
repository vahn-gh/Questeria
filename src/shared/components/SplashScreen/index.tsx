import React, { useEffect, useState } from 'react'

import { View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { PotionSpin } from '../PotionAnimated'
import { CommonStyles } from 'shared/theme/commonStyles'

const REMOVE_DELAY_MS = 2500

export const SplashScreen = () => {
  const [canHide, setCanHide] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCanHide(true)
    }, REMOVE_DELAY_MS)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (canHide) {
    return null
  }

  return (
    <View style={ss.container}>
      <View style={ss.potionIconContainer}>
        <PotionSpin />
      </View>
    </View>
  )
}

const ss = StyleSheet.create(theme => ({
  container: CommonStyles.merge([
    CommonStyles.absoluteFill,
    CommonStyles.center,
    {
      backgroundColor: theme.colors.Tertiary,
    },
  ]),
  potionIconContainer: {
    position: 'absolute',
    zIndex: 20,
  },
}))
