import Realm, { ObjectSchema } from 'realm'

import { LocalUpdateType } from '../../types/QuestSync'

export class QuestOutboxSchema extends Realm.Object<QuestOutboxSchema> {
  questId!: string
  type!: LocalUpdateType
  queuedAt!: Date

  static schema: ObjectSchema = {
    name: 'QuestOutbox',
    primaryKey: 'questId',
    properties: {
      questId: 'string',
      type: 'string',
      queuedAt: 'date',
    },
  }
}
