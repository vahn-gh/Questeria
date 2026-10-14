import React from 'react'

import { FlashList } from '@shopify/flash-list'
import { observer } from 'mobx-react-lite'
import { View } from 'react-native'

import { Button } from 'shared/components/Button'
import { Loader } from 'shared/components/Loader'
import { Typography } from 'shared/components/Typography'
import { ScreenProps } from 'shared/navigation/types/NavigationParams'
import { Screens } from 'shared/navigation/types/Screens'
import { useNetworkStore } from 'shared/store/NetworkStore'
import { CommonStyles } from 'shared/theme/commonStyles'

import { EmptyQuests } from '../components/EmptyQuests'
import { QuestBoard } from '../components/QuestBoard'
import { SyncIndicator } from '../components/SyncIndicator'
import { useQuestsData } from '../hooks/QuestsList/useQuestsData'
import { useQuestsListProps } from '../hooks/QuestsList/useQuestsListProps'

type Props = ScreenProps<Screens.QuestsScreen>

export const QuestsScreen: React.FC<Props> = () => (
  <View style={[CommonStyles.flex1, CommonStyles.ph4]}>
    <QuestBoard />
    <QuestsContent />
  </View>
)

const QuestsContent = observer(() => {
  const networkStore = useNetworkStore()

  const {
    quests,
    syncedAt,
    isLoading,
    isSyncIndicatorVisible,
    isRefreshing,
    loadNextPage,
    refresh,
  } = useQuestsData()

  const { flashListProps } = useQuestsListProps({
    quests,
    isRefreshing,
    onLoadNextPage: loadNextPage,
    onRefresh: refresh,
  })

  const isAwaitingFirstSync = quests.length === 0 && syncedAt === null

  if (isAwaitingFirstSync && !networkStore.isOnline) {
    return <QuestsMessage text="Connect to the internet to sync your quests" />
  }

  if (isLoading) {
    return <Loader />
  }

  if (isAwaitingFirstSync) {
    return (
      <QuestsMessage text="Couldn't load your quests">
        <Button onPressAsync={refresh}>Retry</Button>
      </QuestsMessage>
    )
  }

  return (
    <View style={CommonStyles.flex1}>
      <FlashList {...flashListProps} ListEmptyComponent={<EmptyQuests />} />
      {isSyncIndicatorVisible && <SyncIndicator />}
    </View>
  )
})

interface QuestsMessageProps {
  text: string
  children?: React.ReactNode
}

const QuestsMessage = ({ text, children }: QuestsMessageProps) => (
  <View style={[CommonStyles.flex1, CommonStyles.center, CommonStyles.gap12]}>
    <Typography type="p1" align="center">
      {text}
    </Typography>
    {children}
  </View>
)
