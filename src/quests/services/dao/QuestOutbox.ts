import Realm, { UpdateMode } from 'realm'
import { singleton } from 'tsyringe'

import { QuestSyncType } from '../../types/QuestSync'
import { QuestSyncSchema } from '../schemas/QuestSyncSchema'

// Must be called inside realm.write opened by a repo
@singleton()
export class QuestOutbox {
  queue(realm: Realm, questId: string, type: QuestSyncType) {
    const sync = {
      questId,
      type,
      queuedAt: new Date(),
    }

    realm.create(QuestSyncSchema, sync, UpdateMode.Modified)
  }

  getQueuedIds(realm: Realm) {
    return new Set(realm.objects(QuestSyncSchema).map(row => row.questId))
  }
}
