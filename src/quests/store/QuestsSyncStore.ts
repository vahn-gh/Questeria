import { action, makeObservable, observable, reaction } from 'mobx'
import { AppState } from 'react-native'
import { container, singleton } from 'tsyringe'

import { ErrorAPI } from 'shared/error/ErrorAPI'
import { NetworkStore } from 'shared/store/NetworkStore'

import { ServerSnapshot } from '../types/QuestSync'
import { Quest } from '../types/Quests'
import { QuestSyncRepo } from '../services/repos/QuestSyncRepo'
import { QuestRest } from '../services/rest/QuestRest'

@singleton()
export class QuestsSyncStore {
  isSyncing = false
  syncedAt: Date | null = null

  private questSyncRepo = container.resolve(QuestSyncRepo)
  private questRest = container.resolve(QuestRest)
  private networkStore = container.resolve(NetworkStore)

  private isRerunQueued = false

  constructor() {
    makeObservable<this, 'setSyncing' | 'setSyncedAt'>(this, {
      isSyncing: observable,
      syncedAt: observable,
      setSyncing: action,
      setSyncedAt: action,
    })
  }

  async start() {
    await this.loadSyncedAt()

    this.syncInBackground()

    AppState.addEventListener('change', appState => {
      if (appState === 'active') {
        this.syncInBackground()
      }
    })

    reaction(
      () => this.networkStore.isOnline,
      isOnline => {
        if (isOnline) {
          this.syncInBackground()
        }
      }
    )
  }

  async sync() {
    if (this.isSyncing) {
      this.isRerunQueued = true

      return
    }

    this.setSyncing(true)

    try {
      await this.sendUpdatesAndFetchQuests()
    } finally {
      this.setSyncing(false)
    }
  }

  private setSyncing(isSyncing: boolean) {
    this.isSyncing = isSyncing
  }

  private setSyncedAt(syncedAt: Date | null) {
    this.syncedAt = syncedAt
  }

  private async loadSyncedAt() {
    const meta = await this.questSyncRepo.getSyncedMeta()

    this.setSyncedAt(meta?.syncedAt ?? null)
  }

  private syncInBackground() {
    this.sync().catch(ErrorAPI.log)
  }

  private async sendUpdatesAndFetchQuests(): Promise<void> {
    this.isRerunQueued = false

    await this.sendLocalUpdates()
    await this.fetchServerQuests()

    if (this.isRerunQueued) {
      return this.sendUpdatesAndFetchQuests()
    }
  }

  private async sendLocalUpdates() {
    const queuedUpdates = await this.questSyncRepo.loadLocalUpdates()

    if (queuedUpdates.length === 0) {
      return
    }

    await this.questRest.postLocalUpdates(
      queuedUpdates.map(({ update }) => update)
    )
    await this.questSyncRepo.removeSentLocalUpdates(queuedUpdates)
  }

  private async fetchServerQuests() {
    const meta = await this.questSyncRepo.getSyncedMeta()

    try {
      await this.mergeBatchesFrom(meta?.syncToken ?? null)
    } catch (error) {
      if (!this.questRest.isSyncTokenExpired(error)) {
        throw error
      }

      await this.refetchAllServerQuests()
    }

    await this.loadSyncedAt()
  }

  private async mergeBatchesFrom(syncToken: string | null): Promise<void> {
    const batch = await this.questRest.getQuestsSince(syncToken)

    await this.questSyncRepo.mergeBatch(batch)

    // The server sends at most QUESTS_BATCH_LIMIT (100) quests per batch
    if (batch.hasMore) {
      return this.mergeBatchesFrom(batch.nextSyncToken)
    }
  }

  private async refetchAllServerQuests() {
    const snapshot = await this.fetchServerSnapshot()

    await this.questSyncRepo.replaceWithServerSnapshot(snapshot)
  }

  private async fetchServerSnapshot(
    syncToken: string | null = null,
    fetchedQuests: Quest[] = []
  ): Promise<ServerSnapshot> {
    const batch = await this.questRest.getQuestsSince(syncToken)
    const quests = [...fetchedQuests, ...batch.quests]

    // The server sends at most QUESTS_BATCH_LIMIT (100) quests per batch
    if (batch.hasMore) {
      return this.fetchServerSnapshot(batch.nextSyncToken, quests)
    }

    const snapshot: ServerSnapshot = {
      quests,
      syncToken: batch.nextSyncToken,
    }

    return snapshot
  }
}
