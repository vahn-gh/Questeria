import { QUEST_PERCENTAGE_RANGE } from '../constants/constraints'
import { Quest, QuestSketchKind, QuestSketchPreset } from '../types/Quests'

const MOCK_QUESTS_COUNT = 50
const MOCK_PERCENTAGE_STEP = 7
const MOCK_XP_STEP = 10
const MOCK_CREATED_AT_MS = Date.parse('2026-10-01T10:00:00Z')
const MOCK_CREATED_AT_STEP_MS = 60 * 1000

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
    createdAt: new Date(MOCK_CREATED_AT_MS + index * MOCK_CREATED_AT_STEP_MS),
  })
)
