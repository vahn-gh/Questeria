import { AbstractMMKV } from 'shared/storage/Storage'
import { Need } from 'shared/types/Need'

export class NeedsAdapter {
  static transform(item: string, storage: AbstractMMKV): Need {
    return JSON.parse(storage.getString(item) ?? '{}') as Need
  }

  static transformData(data: string[], storage: AbstractMMKV): Need[] {
    return data.map(key => NeedsAdapter.transform(key, storage))
  }
}
