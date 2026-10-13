import { action, makeObservable, observableShallow } from 'mobx'
import { container, singleton } from 'tsyringe'

import { ErrorAPI } from 'shared/error/ErrorAPI'
import { UniqueID } from 'shared/types/common'

import { QUESTS_PAGE_SIZE } from '../constants/constraints'
import { Quest, QuestDraft } from '../types/Quests'
import { QuestsRepo } from '../services/repos/QuestsRepo'
import { QuestsSyncStore } from './QuestsSyncStore'

@singleton()
export class QuestsStore {
  quests: Quest[] = []

  private questsRepo = container.resolve(QuestsRepo)
  private questsSyncStore = container.resolve(QuestsSyncStore)

  private loadedCount = 0
  private isLoadingPage = false

  constructor() {
    makeObservable<this, 'setQuests'>(this, {
      quests: observableShallow,
      setQuests: action,
    })
  }

  get isSyncing() {
    return this.questsSyncStore.isSyncing
  }

  async start() {
    await this.reloadQuests(QUESTS_PAGE_SIZE)
    this.loadedCount = QUESTS_PAGE_SIZE

    await this.questsRepo.listenToQuestsChanges(() => {
      this.reloadQuests(this.loadedCount).catch(ErrorAPI.log)
    })
  }

  loadNextPage = async () => {
    // Fewer quests than asked for: every quest is loaded
    if (this.isLoadingPage || this.quests.length < this.loadedCount) {
      return
    }

    const nextCount = this.loadedCount + QUESTS_PAGE_SIZE
    this.isLoadingPage = true

    try {
      await this.reloadQuests(nextCount)
      this.loadedCount = nextCount
    } catch (error) {
      ErrorAPI.log(error)
    } finally {
      this.isLoadingPage = false
    }
  }

  refresh = async () => {
    try {
      await this.questsSyncStore.sync()
    } catch (error) {
      ErrorAPI.show(error)
    }
  }

  async createQuest(draft: QuestDraft) {
    try {
      await this.questsRepo.createQuest(draft)
      await this.questsSyncStore.sync()
    } catch (error) {
      ErrorAPI.log(error)
    }
  }

  async updateQuest(quest: Quest) {
    try {
      await this.questsRepo.updateQuest(quest)
      await this.questsSyncStore.sync()
    } catch (error) {
      ErrorAPI.log(error)
    }
  }

  async deleteQuest(id: UniqueID) {
    try {
      await this.questsRepo.deleteQuest(id)
      await this.questsSyncStore.sync()
    } catch (error) {
      ErrorAPI.log(error)
    }
  }

  private async reloadQuests(count: number) {
    const quests = await this.questsRepo.loadQuests(count)

    this.setQuests(quests)
  }

  private setQuests(quests: Quest[]) {
    this.quests = quests
  }
}

export const useQuestsStore = () => container.resolve(QuestsStore)
