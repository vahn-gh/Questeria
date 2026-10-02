import Realm from 'realm'
import { singleton } from 'tsyringe'

import { QuestsSchema } from 'src/quests/services/QuestsSchema'

import { DatabaseAppStateListener } from './DatabaseAppStateListener'

const DATABASE_FILE_NAME = 'questeria'

@singleton()
export class Database {
  private dbInstance: Realm | undefined

  constructor() {
    // oxlint-disable-next-line no-new
    new DatabaseAppStateListener(() => {
      this.closeConnection()
    })
  }

  async getInstance() {
    if (this.dbInstance !== undefined) {
      return this.dbInstance
    }

    return this.openConnection()
  }

  async openConnection() {
    try {
      if (this.dbInstance) {
        console.info(
          '[DB] Database is already open: returning the existing instance'
        )

        return this.dbInstance
      }

      this.dbInstance = await Realm.open({
        path: DATABASE_FILE_NAME,
        schema: [QuestsSchema],
        schemaVersion: 1,
        deleteRealmIfMigrationNeeded: true,
      })
      console.info('[DB] Database open!')

      return this.dbInstance
    } catch (err) {
      console.error('[DB] Database connection failed: ', err)
    }
  }

  private async closeConnection(): Promise<void> {
    if (this.dbInstance === undefined) {
      console.info("[DB] No need to close DB again — it's already closed")

      return
    }

    await this.dbInstance.close()
    console.info('[DB] Database closed.')
    this.dbInstance = undefined
  }
}
