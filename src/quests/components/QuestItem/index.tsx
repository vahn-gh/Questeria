import React from 'react'

import { observer } from 'mobx-react-lite'
import { Image, View } from 'react-native'
import { PixelViewBox } from 'react-native-pixelkit'
import { StyleSheet } from 'react-native-unistyles'

import { Typography } from 'shared/components/Typography'
import { useColors } from 'shared/theme/colors'
import { CommonStyles } from 'shared/theme/commonStyles'

import {
  Quest,
  QuestSketch,
  QuestSketchKind,
  QuestSketchPreset,
} from '../../types/Quests'

const SKETCH_SIZE = 48
const POTION_IMAGE = require('../PotionAnimated/res/QuesteriaPotion.png')

interface Props {
  quest: Quest
}

export const QuestItem = observer(({ quest }: Props) => {
  const colors = useColors()

  const boxOptions = {
    backgroundColor: colors.Tertiary,
    outlineColor: colors.Outline,
    bevel: false,
    borderWidth: 3,
    borderRadius: 4,
    highlightRatio: 0.3,
    lipHeight: 4,
  }

  const sketchFrameOptions = {
    backgroundColor: colors.Tertiary,
    outlineColor: colors.Outline,
    bevel: false,
    borderWidth: 2,
    borderRadius: 4,
  }

  return (
    <View style={ss.container}>
      <View style={ss.note}>
        <PixelViewBox
          style={[ss.noteBox, CommonStyles.rowCenter, CommonStyles.gap12]}
          options={boxOptions}
        >
          <PixelViewBox style={ss.sketchFrame} options={sketchFrameOptions}>
            <QuestSketchImage sketch={quest.sketch} />
          </PixelViewBox>
          <View style={CommonStyles.flex1}>
            <Typography type="p1" color="Outline" numberOfLines={1}>
              {quest.label}
            </Typography>
            <Typography type="p3_light" color="Primary">
              {`${quest.percentage}% · ${quest.xp} XP`}
            </Typography>
          </View>
        </PixelViewBox>
      </View>
    </View>
  )
})

interface QuestSketchImageProps {
  sketch: QuestSketch
}

// Only the potion preset has an image so far
const QuestSketchImage = ({ sketch }: QuestSketchImageProps) => {
  if (
    sketch.kind === QuestSketchKind.Preset &&
    sketch.preset === QuestSketchPreset.Potion
  ) {
    return <Image source={POTION_IMAGE} style={ss.sketch} />
  }

  return <View style={[ss.sketch, ss.sketchPlaceholder]} />
}

const ss = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  note: {
    width: '100%',
  },
  noteBox: {
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 8,
  },
  sketchFrame: {
    padding: 4,
  },
  sketch: {
    width: SKETCH_SIZE,
    height: SKETCH_SIZE,
  },
  sketchPlaceholder: {
    backgroundColor: theme.colors.Secondary,
  },
}))
