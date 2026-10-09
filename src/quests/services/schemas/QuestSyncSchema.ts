import Realm, { ObjectSchema } from 'realm'

import { QuestSyncType } from '../../types/QuestSync'

export class QuestSyncSchema extends Realm.Object<QuestSyncSchema> {
  questId!: string
  type!: QuestSyncType
  queuedAt!: Date

  static schema: ObjectSchema = {
    name: 'QuestSync',
    primaryKey: 'questId',
    properties: {
      questId: 'string',
      type: 'string',
      queuedAt: 'date',
    },
  }
}
