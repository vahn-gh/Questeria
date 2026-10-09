import Realm from 'realm'
import { container } from 'tsyringe'
import { Database } from './Database'

export abstract class AbstractRepo {
  protected db = container.resolve(Database)

  protected async getAvailableInstance(): Promise<Realm> {
    const realmDB = await this.db.getInstance()

    if (realmDB === undefined) {
      throw new Error('Database unavailable')
    }

    return realmDB
  }
}
