import { StyleProp, View, ViewStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { CommonStyles } from 'shared/theme/commonStyles'
import { NeedType } from 'shared/types/Need'

import { Typography } from '../Typography'
import { SegmentedTrack } from './SegmentedTrack'

interface Props {
  type: NeedType
  label: string
  percentage: number
  style?: StyleProp<ViewStyle>
}

export const ProgressBar: React.FC<Props> = ({
  type = NeedType.FullWidth,
  label,
  percentage,
  style,
}) => {
  if (type === NeedType.Big) {
    return (
      <View style={[CommonStyles.center, style]}>
        <SegmentedTrack
          percentage={percentage}
          axis="height"
          style={ss.bigBar}
        />
        <Typography type="p1" align="center" style={CommonStyles.mt2}>
          {label}
        </Typography>
      </View>
    )
  }

  if (type === NeedType.ListItem) {
    return (
      <View style={style}>
        <SegmentedTrack
          percentage={percentage}
          axis="width"
          style={[CommonStyles.flex1, ss.listItemBar]}
        />
        <Typography type="p3" style={CommonStyles.mr2}>
          {label}
        </Typography>
      </View>
    )
  }

  return (
    <View style={style}>
      <SegmentedTrack
        percentage={percentage}
        axis="width"
        style={ss.progressBar}
      />
      <Typography type="p1" style={CommonStyles.ml2}>
        {label}
      </Typography>
    </View>
  )
}

const ss = StyleSheet.create({
  progressBar: {
    height: 40,
    flex: 1,
  },
  bigBar: {
    width: 40,
    height: 200,
  },
  listItemBar: {
    height: 16,
  },
})
