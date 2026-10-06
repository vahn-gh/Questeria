import Realm, { ObjectSchema } from 'realm'

export const QUESTS_FEED_META_ID = 'quests'

export interface FeedMeta {
  nextCursor: string | null
  syncedAt: Date | null
}

export class QuestsFeedMetaSchema extends Realm.Object<QuestsFeedMetaSchema> {
  id!: string
  nextCursor?: string
  syncedAt?: Date

  static schema: ObjectSchema = {
    name: 'QuestsFeedMeta',
    primaryKey: 'id',
    properties: {
      id: 'string',
      nextCursor: 'string?',
      syncedAt: 'date?',
    },
  }
}
