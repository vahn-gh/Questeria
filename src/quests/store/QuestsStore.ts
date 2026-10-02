import { makeAutoObservable } from 'mobx'
import { container, singleton } from 'tsyringe'
import { QuestsRepo } from '../services/QuestsRepo'
import { Quest } from '../types/Quests'

@singleton()
export class QuestsStore {
  private questsRepo = container.resolve(QuestsRepo)

  quests: Quest[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    const quests = await this.questsRepo.load()

    if (quests) {
      this.quests = quests
    }
  }
}

export const useQuestsStore = () => container.resolve(QuestsStore)
