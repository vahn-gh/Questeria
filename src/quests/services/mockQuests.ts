import { QUEST_PERCENTAGE_RANGE } from '../constants/constraints'
import { Quest, QuestSketchKind, QuestSketchPreset } from '../types/Quests'

const MOCK_QUESTS_COUNT = 50
const MOCK_PERCENTAGE_STEP = 7
const MOCK_XP_STEP = 10

export const MOCK_LATENCY_MS = 300

export const MOCK_QUESTS: Quest[] = Array.from(
  { length: MOCK_QUESTS_COUNT },
  (_, index) => ({
    id: `quest-${index}`,
    label: `Quest ${index + 1}`,
    percentage: (index * MOCK_PERCENTAGE_STEP) % (QUEST_PERCENTAGE_RANGE + 1),
    sketch: {
      kind: QuestSketchKind.Preset,
      preset: QuestSketchPreset.Potion,
    },
    xp: (index + 1) * MOCK_XP_STEP,
  })
)
