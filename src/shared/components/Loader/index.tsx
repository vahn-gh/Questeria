import React from 'react'

import { ActivityIndicator, View } from 'react-native'

import { useColors } from 'shared/theme/colors'
import { CommonStyles } from 'shared/theme/commonStyles'

export const Loader = () => {
  const colors = useColors()

  return (
    <View style={[CommonStyles.flex1, CommonStyles.center]}>
      <ActivityIndicator color={colors.Primary} />
    </View>
  )
}
