import Realm, { UpdateMode } from 'realm'
import { singleton } from 'tsyringe'

import { LocalUpdateType } from '../../types/QuestSync'
import { QuestOutboxSchema } from '../schemas/QuestOutboxSchema'

// Must be called inside realm.write opened by a repo
@singleton()
export class QuestOutbox {
  queue(realm: Realm, questId: string, type: LocalUpdateType) {
    const outboxRow = {
      questId,
      type,
      queuedAt: new Date(),
    }

    realm.create(QuestOutboxSchema, outboxRow, UpdateMode.Modified)
  }

  getQueuedIds(realm: Realm) {
    return new Set(realm.objects(QuestOutboxSchema).map(row => row.questId))
  }
}
