import React from 'react'

import { Image, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Typography } from 'shared/components/Typography'
import { CommonStyles } from 'shared/theme/commonStyles'

const EMPTY_IMAGE = require('./res/toad.png')

export const EmptyQuests = () => (
  <View style={[CommonStyles.flex1, CommonStyles.center]}>
    <Image source={EMPTY_IMAGE} style={ss.image} resizeMode="contain" />
    <Typography type="p2_regular" align="center">
      Take a break.
    </Typography>
    <Typography type="p2_regular" align="center">
      You have no active quest.
    </Typography>
  </View>
)

const ss = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
})
