import Realm, { ObjectSchema } from 'realm'

export const SYNC_META_ID = 'quests'

export interface SyncMeta {
  syncToken: string | null
  syncedAt: Date | null
}

export class SyncMetaSchema extends Realm.Object<SyncMetaSchema> {
  id!: string
  syncToken?: string
  syncedAt?: Date

  static schema: ObjectSchema = {
    name: 'SyncMeta',
    primaryKey: 'id',
    properties: {
      id: 'string',
      syncToken: 'string?',
      syncedAt: 'date?',
    },
  }
}
