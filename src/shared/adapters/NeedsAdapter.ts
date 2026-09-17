import {
  NEED_LABEL_LENGTH,
  NEED_PERCENTAGE_RANGE,
} from 'shared/constants/constraints'
import { AbstractMMKV } from 'shared/storage/Storage'
import { Need } from 'shared/types/Need'

export class NeedsAdapter {
  static parseItem(item: string, storage: AbstractMMKV): Need {
    return JSON.parse(storage.getString(item) ?? '{}') as Need
  }

  static parseData(data: string[], storage: AbstractMMKV): Need[] {
    return data.map(key => NeedsAdapter.parseItem(key, storage))
  }

  /** @throws {Error} */
  static stringifyItem(item: Need): string {
    if (item.label.length > NEED_LABEL_LENGTH) {
      throw new Error(`Label exceeds ${NEED_LABEL_LENGTH} characters`)
    }

    if (item.percentage < 0 || item.percentage > NEED_PERCENTAGE_RANGE) {
      throw new Error(
        `Percentage must be between 0 and ${NEED_PERCENTAGE_RANGE}`
      )
    }

    return JSON.stringify(item)
  }
}
