import Realm from 'realm'
import { container, singleton } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'

import { AbstractRepo } from 'shared/database/AbstractRepo'

import { LocalUpdateType } from '../../types/QuestSync'
import { Quest, QuestDraft } from '../../types/Quests'
import { QuestOutbox } from '../dao/QuestOutbox'
import { QuestRowAdapter } from '../adapters/QuestRowAdapter'
import { QuestRows } from '../dao/QuestRows'
import { QuestsSchema } from '../schemas/QuestsSchema'

const QUESTS_SORT: [string, boolean][] = [
  ['createdAt', true],
  ['id', true],
]

@singleton()
export class QuestsRepo extends AbstractRepo {
  private questRowAdapter = container.resolve(QuestRowAdapter)
  private questRows = container.resolve(QuestRows)
  private questOutbox = container.resolve(QuestOutbox)

  async loadQuests(count: number): Promise<Quest[]> {
    const realm = await this.getAvailableInstance()

    return this.getSortedQuests(realm)
      .slice(0, count)
      .map(row => this.questRowAdapter.formatToQuest(row))
  }

  async listenToQuestsChanges(onChange: () => void): Promise<() => void> {
    const realm = await this.getAvailableInstance()
    const rows = realm.objects(QuestsSchema)

    rows.addListener(onChange)

    return () => rows.removeListener(onChange)
  }

  async createQuest(draft: QuestDraft): Promise<Quest> {
    const realm = await this.getAvailableInstance()
    const quest: Quest = {
      ...draft,
      id: uuidv4(),
      createdAt: new Date(),
    }

    realm.write(() => {
      this.questRows.save(realm, quest)
      this.questOutbox.queue(realm, quest.id, LocalUpdateType.Upsert)
    })

    return quest
  }

  async updateQuest(quest: Quest): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      this.questRows.save(realm, quest)
      this.questOutbox.queue(realm, quest.id, LocalUpdateType.Upsert)
    })
  }

  async deleteQuest(id: string): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      this.questRows.remove(realm, id)
      this.questOutbox.queue(realm, id, LocalUpdateType.Delete)
    })
  }

  private getSortedQuests(realm: Realm) {
    return realm.objects(QuestsSchema).sorted(QUESTS_SORT)
  }
}
