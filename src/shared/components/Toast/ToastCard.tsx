import React from 'react'

import { Pressable, Text, View } from 'react-native'

import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { useSafeInsets } from 'shared/hooks/useSafeInsets'

// TODO: Refactor to UI library
type ColorNameType = string

export enum ToastType {
  Info = 'Info',
}

export interface ToastCardData {
  type: ToastType
  text: string
}

interface Props {
  data: ToastCardData
  onClose: () => void
}

const CONFIG_MAP: Record<
  ToastType,
  {
    color: ColorNameType
    backgroundColor: ColorNameType
  }
> = {
  Info: {
    backgroundColor: '#FFD6EC',
    color: '#8A3B6B',
  },
}

export const ToastCard = ({ data, onClose }: Props) => {
  const { topInset } = useSafeInsets()
  const config = CONFIG_MAP[data.type]

  return (
    <Animated.View
      style={ss.container}
      entering={SlideInUp.springify().damping(200).overshootClamping(1)}
      exiting={SlideOutUp.duration(1000)}
    >
      <Pressable
        onPress={onClose}
        style={[
          ss.message,
          {
            backgroundColor: config.backgroundColor,
            paddingTop: topInset + 12,
          },
        ]}
      >
        <View style={ss.textContent}>
          <Text style={ss.emoji}>(｡•ᴗ•｡)♡</Text>
          <Text style={[ss.text, { color: config.color }]}>{data.text}</Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

// TODO: temporary kawaii styles until the UI library lands
const ss = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  message: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 2,
    borderColor: '#FFF0F7',
    shadowColor: '#FF9EC9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  textContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 16,
    color: '#FF7EB9',
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
})
