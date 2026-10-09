import Realm, { UpdateMode } from 'realm'
import { container, singleton } from 'tsyringe'

import { AbstractRepo } from 'shared/database/AbstractRepo'
import { isNotNull } from 'shared/utils/isNotNull'

import { QuestSyncType } from '../../types/QuestSync'
import { Quest } from '../../types/Quests'
import { QuestOutbox } from '../dao/QuestOutbox'
import { PullQuestsResponse, QuestSyncRequest } from '../rest/QuestRest'
import { QuestRowAdapter } from '../adapters/QuestRowAdapter'
import { QuestRows } from '../dao/QuestRows'
import { QuestSyncSchema } from '../schemas/QuestSyncSchema'
import { QuestsSchema } from '../schemas/QuestsSchema'
import {
  SYNC_META_ID,
  SyncMeta,
  SyncMetaSchema,
} from '../schemas/SyncMetaSchema'

export interface PendingQuestSync {
  request: QuestSyncRequest
  queuedAt: Date
}

const getRequestQuestId = (request: QuestSyncRequest) =>
  request.type === QuestSyncType.Upsert ? request.quest.id : request.id

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

  async loadPendingSyncs(): Promise<PendingQuestSync[]> {
    const realm = await this.getAvailableInstance()
    const pending = realm.objects(QuestSyncSchema).map(row => {
      const request = this.buildSyncRequest(realm, row)

      if (request === null) {
        return null
      }

      const pendingSync: PendingQuestSync = {
        request,
        queuedAt: row.queuedAt,
      }

      return pendingSync
    })

    return pending.filter(isNotNull)
  }

  async removeSentSyncs(sent: PendingQuestSync[]): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      sent.forEach(({ request, queuedAt }) => {
        const row = realm.objectForPrimaryKey(
          QuestSyncSchema,
          getRequestQuestId(request)
        )

        if (row !== null && row.queuedAt.getTime() === queuedAt.getTime()) {
          realm.delete(row)
        }
      })
    })
  }

  async mergeServerChanges(changes: PullQuestsResponse): Promise<void> {
    const realm = await this.getAvailableInstance()

    realm.write(() => {
      const queuedIds = this.questOutbox.getQueuedIds(realm)

      changes.quests
        .filter(quest => !queuedIds.has(quest.id))
        .forEach(quest => this.questRows.save(realm, quest))

      changes.deletedIds
        .filter(id => !queuedIds.has(id))
        .forEach(id => this.questRows.remove(realm, id))

      this.saveSyncMeta(realm, changes.nextToken, !changes.hasMore)
    })
  }

  async replaceWithServerSnapshot(
    quests: Quest[],
    token: string
  ): Promise<void> {
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

      this.saveSyncMeta(realm, token, true)
    })
  }

  private buildSyncRequest(
    realm: Realm,
    row: QuestSyncSchema
  ): QuestSyncRequest | null {
    if (row.type === QuestSyncType.Delete) {
      return {
        type: QuestSyncType.Delete,
        id: row.questId,
      }
    }

    const questRow = realm.objectForPrimaryKey(QuestsSchema, row.questId)

    if (questRow === null) {
      return null
    }

    return {
      type: QuestSyncType.Upsert,
      quest: this.questRowAdapter.formatToQuest(questRow),
    }
  }

  // syncedAt marks a finished pull, so it stays unchanged until the last page
  private saveSyncMeta(realm: Realm, syncToken: string, isPullDone: boolean) {
    const meta: Partial<SyncMetaSchema> = {
      id: SYNC_META_ID,
      syncToken,
    }

    if (isPullDone) {
      meta.syncedAt = new Date()
    }

    realm.create(SyncMetaSchema, meta, UpdateMode.Modified)
  }
}
