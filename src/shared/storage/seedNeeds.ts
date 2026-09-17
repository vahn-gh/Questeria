import { nanoid } from 'nanoid/non-secure'

import { NeedsAdapter } from 'shared/adapters/NeedsAdapter'
import { ErrorAPI } from 'shared/error/ErrorAPI'
import { ProgressStorage } from 'shared/storage/Storage'
import { Need } from 'shared/types/Need'

const LABELS = [
  'Water',
  'Sleep',
  'Food',
  'Exercise',
  'Sunlight',
  'Reading',
  'Socializing',
  'Meditation',
  'Fresh air',
  'Music',
]

// TODO: Don't forget to remove this
export const generateNeeds = (count = 10): Need[] =>
  Array.from({ length: count }, (_, index) => ({
    id: nanoid(),
    label: LABELS[index % LABELS.length],
    percentage: Math.round(Math.random() * 100),
  }))

export const seedProgressStorage = () => {
  ProgressStorage.clearAll()

  for (const need of generateNeeds()) {
    try {
      const data = NeedsAdapter.stringifyItem(need)

      ProgressStorage.set(need.id, data)
    } catch (e) {
      ErrorAPI.show(e)
    }
  }
}
