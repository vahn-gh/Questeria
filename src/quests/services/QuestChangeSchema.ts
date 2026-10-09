import Realm, { ObjectSchema } from 'realm'

import { QuestChangeType } from '../types/QuestChange'

export class QuestChangeSchema extends Realm.Object<QuestChangeSchema> {
  questId!: string
  type!: QuestChangeType
  queuedAt!: Date

  static schema: ObjectSchema = {
    name: 'QuestChange',
    primaryKey: 'questId',
    properties: {
      questId: 'string',
      type: 'string',
      queuedAt: 'date',
    },
  }
}
