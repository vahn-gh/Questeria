import Realm from 'realm'
import { container } from 'tsyringe'
import { Database } from './Database'
import { convertToArray } from 'shared/utils/realm'

export abstract class AbstractRepo<G> {
  protected db = container.resolve(Database)
  protected constructor(private name: string) {}

  protected async save<T = G>(objList: T[], name = this.name): Promise<T[]> {
    const realmDB = await this.db.getInstance()

    if (realmDB) {
      realmDB.write(() => {
        // delete all objects
        realmDB.delete(realmDB.objects(name))
        // pull new objects
        objList.forEach(obj => {
          realmDB.create<T>(name, obj, Realm.UpdateMode.Never)
        })
      })
    }

    return objList
  }

  protected async getDataFromDatabase<T = G>(name = this.name): Promise<T[]> {
    const realmDB = await this.db.getInstance()

    return realmDB ? convertToArray<T>(realmDB.objects<T>(name)) : []
  }

  protected shouldSetData(data: G[]): boolean {
    return data.length !== 0
  }

  async updateData(data: G[]) {
    if (this.shouldSetData(data)) {
      await this.save(data)
    }
  }

  async load() {
    const data = await this.getDataFromDatabase()

    if (this.shouldSetData(data)) {
      return data
    }
  }

  async clear() {
    const realmDB = await this.db.getInstance()

    if (realmDB) {
      realmDB.write(() => {
        // delete all objects
        realmDB.delete(realmDB.objects(this.name))
      })
    }
  }
}
