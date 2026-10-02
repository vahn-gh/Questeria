import { AbstractRepo } from 'shared/database/AbstractRepo'
import { Quest } from '../types/Quests'
import { QuestsSchema } from './QuestsSchema'
import { convertToArray } from 'shared/utils/realm'

export class QuestsRepo extends AbstractRepo<Quest> {
  constructor() {
    super(QuestsSchema.name)
  }

  async loadSaved(): Promise<Quest[]> {
    const realmDB = await this.db.getInstance()

    let savedData: Quest[] = []

    if (realmDB) {
      const quests = realmDB.objects(QuestsSchema.name)

      savedData = convertToArray<Quest>(quests)
    }

    return savedData
  }

  async load(): Promise<Quest[] | undefined> {
    const savedData = await this.loadSaved()

    if (super.shouldSetData(savedData)) {
      return savedData
    }
  }
}
