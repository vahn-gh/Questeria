import { makeAutoObservable } from 'mobx'
import { container, singleton } from 'tsyringe'

@singleton()
export class QuestsStore {
  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    // TODO: Implement
  }
}

export const useQuestsStore = () => container.resolve(QuestsStore)
