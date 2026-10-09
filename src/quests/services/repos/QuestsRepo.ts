import Realm, { CollectionChangeSet, OrderedCollection } from 'realm'
import { container, singleton } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'

import { AbstractRepo } from 'shared/database/AbstractRepo'

import { QUESTS_PAGE_SIZE } from '../../constants/constraints'
import { QuestSyncType } from '../../types/QuestSync'
import { Quest, QuestDraft } from '../../types/Quests'
import { QuestOutbox } from '../dao/QuestOutbox'
import { QuestRowAdapter } from '../adapters/QuestRowAdapter'
import { QuestRows } from '../dao/QuestRows'
import { QuestsSchema } from '../schemas/QuestsSchema'

const QUESTS_SORT: [string, boolean][] = [
  ['createdAt', true],
  ['id', true],
]
const QUESTS_AFTER_QUERY = 'createdAt < $0 OR (createdAt == $0 AND id < $1)'

export interface QuestsChange {
  deletions: number[]
  insertions: number[]
  modifications: number[]
  readQuestAt: (index: number) => Quest
}

@singleton()
export class QuestsRepo extends AbstractRepo {
  private questRowAdapter = container.resolve(QuestRowAdapter)
  private questRows = container.resolve(QuestRows)
  private questOutbox = container.resolve(QuestOutbox)

  async loadPage(after: Quest | null): Promise<Quest[]> {
    const realm = await this.getAvailableInstance()
    let quests = this.getSortedQuests(realm)

    if (after !== null) {
      quests = quests.filtered(QUESTS_AFTER_QUERY, after.createdAt, after.id)
    }

    return quests
      .slice(0, QUESTS_PAGE_SIZE)
      .map(row => this.questRowAdapter.formatToQuest(row))
  }

  async watchQuests(
    listener: (change: QuestsChange) => void
  ): Promise<() => void> {
    const realm = await this.getAvailableInstance()
    const quests = this.getSortedQuests(realm)

    const handleChange = (
      collection: OrderedCollection<QuestsSchema>,
      changes: CollectionChangeSet
    ) => {
      const change: QuestsChange = {
        deletions: changes.deletions,
        insertions: changes.insertions,
        modifications: changes.newModifications,
        readQuestAt: index =>
          this.questRowAdapter.formatToQuest(collection[index]),
      }

      listener(change)
    }

    quests.addListener(handleChange)

    return () => quests.removeListener(handleChange)
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
      this.questOutbox.queue(realm, quest.id, QuestSyncType.Upsert)
    })

    return quest
  }

  async updateQuest(quest: Quest): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      this.questRows.save(realm, quest)
      this.questOutbox.queue(realm, quest.id, QuestSyncType.Upsert)
    })
  }

  async deleteQuest(id: string): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      this.questRows.remove(realm, id)
      this.questOutbox.queue(realm, id, QuestSyncType.Delete)
    })
  }

  private getSortedQuests(realm: Realm) {
    return realm.objects(QuestsSchema).sorted(QUESTS_SORT)
  }
}
