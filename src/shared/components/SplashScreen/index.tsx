import React, { useEffect, useState } from 'react'

import { View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { PotionSpin } from '../../../quests/components/PotionAnimated'
import { CommonStyles } from 'shared/theme/commonStyles'
import { useStoreLoader } from 'shared/store/StoreLoader'

const REMOVE_DELAY_MS = 2500

export const SplashScreen = () => {
  const [canHide, setCanHide] = useState(false)

  const storeLoader = useStoreLoader()

  useEffect(() => {
    const timeout = setTimeout(() => {
      storeLoader.loadData()

      setCanHide(true)
    }, REMOVE_DELAY_MS)

    return () => {
      clearTimeout(timeout)
    }

    // oxlint-disable-next-line react-hooks/exhaustive-deps
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
