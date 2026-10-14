import React from 'react'

import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { BreadLoafAnimated } from 'shared/components/BreadLoafAnimated'
import { Typography } from 'shared/components/Typography'
import { useSafeInsets } from 'shared/hooks/useSafeInsets'
import { CommonStyles } from 'shared/theme/commonStyles'

export const SyncIndicator = () => {
  const { bottomInset } = useSafeInsets()

  return (
    <View
      style={[
        ss.indicator,
        CommonStyles.rowCenter,
        CommonStyles.gap8,
        { bottom: bottomInset },
      ]}
    >
      <BreadLoafAnimated />
      <Typography type="p2" color="Outline">
        Sync in progress...
      </Typography>
    </View>
  )
}

const ss = StyleSheet.create({
  indicator: {
    position: 'absolute',
    right: 0,
  },
})
