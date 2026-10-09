import Realm, { UpdateMode } from 'realm'
import { container, singleton } from 'tsyringe'

import { Quest } from '../../types/Quests'
import { QuestRowAdapter } from '../adapters/QuestRowAdapter'
import { QuestsSchema } from '../schemas/QuestsSchema'

// Must be called inside realm.write opened by a repo
@singleton()
export class QuestRows {
  private questRowAdapter = container.resolve(QuestRowAdapter)

  save(realm: Realm, quest: Quest) {
    realm.create(
      QuestsSchema,
      this.questRowAdapter.formatToRealm(quest),
      UpdateMode.Modified
    )
  }

  remove(realm: Realm, id: string) {
    const row = realm.objectForPrimaryKey(QuestsSchema, id)

    if (row !== null) {
      realm.delete(row)
    }
  }
}
