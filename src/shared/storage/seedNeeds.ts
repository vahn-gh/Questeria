import { nanoid } from 'nanoid/non-secure'

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

export const generateNeeds = (count = 10): Need[] =>
  Array.from({ length: count }, (_, index) => ({
    id: nanoid(),
    label: LABELS[index % LABELS.length],
    percentage: Math.round(Math.random() * 100),
  }))

export const seedProgressStorage = () => {
  ProgressStorage.clearAll()

  for (const need of generateNeeds()) {
    ProgressStorage.set(need.id, JSON.stringify(need))
  }
}
