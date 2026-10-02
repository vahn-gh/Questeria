import { Database } from 'shared/database/Database'
import { QuestsStore } from 'src/quests/store/QuestsStore'
import { container, singleton } from 'tsyringe'

@singleton()
export class StoreLoader {
  private questsStore = container.resolve(QuestsStore)

  async loadData() {
    await container.resolve(Database).openConnection()

    await this.questsStore.load()
  }
}

export const useStoreLoader = () => container.resolve(StoreLoader)
