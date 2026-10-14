import React, { useCallback, useMemo } from 'react'

import { FlashListProps, ListRenderItemInfo } from '@shopify/flash-list'
import { RefreshControl } from 'react-native'

import { useSafeInsets } from 'shared/hooks/useSafeInsets'
import { useColors } from 'shared/theme/colors'

import { QuestItem } from '../../components/QuestItem'
import { Quest } from '../../types/Quests'

interface QuestsListProps {
  quests: Quest[]
  isRefreshing: boolean
  onLoadNextPage: () => Promise<void>
  onRefresh: () => Promise<void>
}

interface QuestsListPropsReturnType {
  flashListProps: Pick<
    FlashListProps<Quest>,
    | 'data'
    | 'renderItem'
    | 'keyExtractor'
    | 'onEndReached'
    | 'refreshControl'
    | 'contentContainerStyle'
    | 'showsVerticalScrollIndicator'
  >
}

export const useQuestsListProps = ({
  quests,
  isRefreshing,
  onLoadNextPage,
  onRefresh,
}: QuestsListProps): QuestsListPropsReturnType => {
  const { topInset, bottomInset } = useSafeInsets()
  const colors = useColors()

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Quest>) => <QuestItem quest={item} />,
    []
  )

  const keyExtractor = useCallback((quest: Quest) => quest.id, [])

  const flashListProps = useMemo(
    () => ({
      data: quests,
      renderItem,
      keyExtractor,
      onEndReached: onLoadNextPage,
      showsVerticalScrollIndicator: false,
      refreshControl: (
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.Primary}
        />
      ),
      contentContainerStyle: {
        flexGrow: 1,
        paddingTop: topInset,
        paddingBottom: bottomInset,
      },
    }),
    [
      quests,
      isRefreshing,
      onLoadNextPage,
      onRefresh,
      renderItem,
      keyExtractor,
      topInset,
      bottomInset,
      colors,
    ]
  )

  return {
    flashListProps,
  }
}
