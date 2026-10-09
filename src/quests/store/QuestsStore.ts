import { makeAutoObservable } from 'mobx'
import { container, singleton } from 'tsyringe'
import { Quest } from '../types/Quests'

@singleton()
export class QuestsStore {
  quests: Quest[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    // TODO: Implement
  }
}

export const useQuestsStore = () => container.resolve(QuestsStore)
