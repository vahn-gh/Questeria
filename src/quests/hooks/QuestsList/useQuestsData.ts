import { useQuestsStore } from '../../store/QuestsStore'

export const useQuestsData = () => {
  const questsStore = useQuestsStore()

  const { quests, syncedAt, isSyncing, isRefreshing } = questsStore
  const hasQuests = quests.length > 0
  const isSyncNotRefresh = isSyncing && !isRefreshing

  return {
    quests,
    syncedAt,
    isLoading: !hasQuests && isSyncNotRefresh,
    isSyncIndicatorVisible: hasQuests && isSyncNotRefresh,
    isRefreshing,
    loadNextPage: questsStore.loadNextPage,
    refresh: questsStore.refresh,
  }
}
