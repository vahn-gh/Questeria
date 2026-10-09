import { Database } from 'shared/database/Database'
import { NetworkStore } from 'shared/store/NetworkStore'
import { QuestsSyncStore } from 'src/quests/store/QuestsSyncStore'
import { QuestsStore } from 'src/quests/store/QuestsStore'
import { container, singleton } from 'tsyringe'

@singleton()
export class StoreLoader {
  private networkStore = container.resolve(NetworkStore)
  private questsStore = container.resolve(QuestsStore)
  private questsSyncStore = container.resolve(QuestsSyncStore)

  async loadData() {
    await container.resolve(Database).openConnection()

    await this.questsStore.load()
    this.networkStore.start()
    this.questsSyncStore.start()
  }
}

export const useStoreLoader = () => container.resolve(StoreLoader)
