import Realm, { UpdateMode } from 'realm'
import { container, singleton } from 'tsyringe'

import { AbstractRepo } from 'shared/database/AbstractRepo'
import { isNotNull } from 'shared/utils/isNotNull'

import { LocalUpdateType, ServerSnapshot } from '../../types/QuestSync'
import { QuestOutbox } from '../dao/QuestOutbox'
import { QuestsBatch, LocalUpdate } from '../rest/QuestRest'
import { QuestRowAdapter } from '../adapters/QuestRowAdapter'
import { QuestRows } from '../dao/QuestRows'
import { QuestOutboxSchema } from '../schemas/QuestOutboxSchema'
import { QuestsSchema } from '../schemas/QuestsSchema'
import {
  SYNC_META_ID,
  SyncMeta,
  SyncMetaSchema,
} from '../schemas/SyncMetaSchema'

export interface QueuedLocalUpdate {
  update: LocalUpdate
  queuedAt: Date
}

const getLocalUpdateQuestId = (update: LocalUpdate) =>
  update.type === LocalUpdateType.Upsert ? update.quest.id : update.id

@singleton()
export class QuestSyncRepo extends AbstractRepo {
  private questRowAdapter = container.resolve(QuestRowAdapter)
  private questRows = container.resolve(QuestRows)
  private questOutbox = container.resolve(QuestOutbox)

  async getSyncedMeta(): Promise<SyncMeta | null> {
    const realm = await this.getAvailableInstance()
    const row = realm.objectForPrimaryKey(SyncMetaSchema, SYNC_META_ID)

    if (row === null) {
      return null
    }

    return {
      syncToken: row.syncToken ?? null,
      syncedAt: row.syncedAt ?? null,
    }
  }

  async loadLocalUpdates(): Promise<QueuedLocalUpdate[]> {
    const realm = await this.getAvailableInstance()
    const queuedUpdates = realm.objects(QuestOutboxSchema).map(row => {
      const update = this.buildLocalUpdate(realm, row)

      if (update === null) {
        return null
      }

      const queuedUpdate: QueuedLocalUpdate = {
        update,
        queuedAt: row.queuedAt,
      }

      return queuedUpdate
    })

    return queuedUpdates.filter(isNotNull)
  }

  async removeSentLocalUpdates(sent: QueuedLocalUpdate[]): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      sent.forEach(({ update, queuedAt }) => {
        const row = realm.objectForPrimaryKey(
          QuestOutboxSchema,
          getLocalUpdateQuestId(update)
        )

        if (row !== null && row.queuedAt.getTime() === queuedAt.getTime()) {
          realm.delete(row)
        }
      })
    })
  }

  async mergeBatch(batch: QuestsBatch): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      const queuedIds = this.questOutbox.getQueuedIds(realm)

      batch.quests
        .filter(quest => !queuedIds.has(quest.id))
        .forEach(quest => this.questRows.save(realm, quest))

      batch.deletedIds
        .filter(id => !queuedIds.has(id))
        .forEach(id => this.questRows.remove(realm, id))

      this.saveSyncMeta(realm, batch.nextSyncToken, !batch.hasMore)
    })
  }

  async replaceWithServerSnapshot({
    quests,
    syncToken,
  }: ServerSnapshot): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      const queuedIds = this.questOutbox.getQueuedIds(realm)
      const staleQuests = realm
        .objects(QuestsSchema)
        .filtered('NOT (id IN $0)', [...queuedIds])

      realm.delete(staleQuests)

      quests
        .filter(quest => !queuedIds.has(quest.id))
        .forEach(quest => this.questRows.save(realm, quest))

      this.saveSyncMeta(realm, syncToken, true)
    })
  }

  private buildLocalUpdate(
    realm: Realm,
    row: QuestOutboxSchema
  ): LocalUpdate | null {
    if (row.type === LocalUpdateType.Delete) {
      return {
        type: LocalUpdateType.Delete,
        id: row.questId,
      }
    }

    const questRow = realm.objectForPrimaryKey(QuestsSchema, row.questId)

    if (questRow === null) {
      return null
    }

    return {
      type: LocalUpdateType.Upsert,
      quest: this.questRowAdapter.formatToQuest(questRow),
    }
  }

  // syncedAt marks a finished fetch, so it stays unchanged until the last batch
  private saveSyncMeta(realm: Realm, syncToken: string, isLastBatch: boolean) {
    const meta: Partial<SyncMetaSchema> = {
      id: SYNC_META_ID,
      syncToken,
    }

    if (isLastBatch) {
      meta.syncedAt = new Date()
    }

    realm.create(SyncMetaSchema, meta, UpdateMode.Modified)
  }
}
