import { container } from 'tsyringe'

import { Quest, QuestSketchKind, QuestSketchPreset } from '../../types/Quests'
import { QuestRowAdapter } from './QuestRowAdapter'

const CREATED_AT = new Date('2026-10-01T10:00:00Z')
const UPDATED_AT = new Date('2026-10-02T10:00:00Z')

const PRESET_QUEST: Quest = {
  id: 'quest-preset',
  label: 'Preset quest',
  percentage: 40,
  sketch: {
    kind: QuestSketchKind.Preset,
    preset: QuestSketchPreset.Potion,
  },
  xp: 120,
  createdAt: CREATED_AT,
}

const PRESET_QUEST_WITH_DESCRIPTION: Quest = {
  ...PRESET_QUEST,
  label: 'Preset quest with description',
  description: 'Brew a potion',
}

const DRAWN_QUEST: Quest = {
  id: 'quest-drawn',
  label: 'Drawn quest',
  percentage: 75,
  sketch: {
    kind: QuestSketchKind.Drawn,
    drawing: 'ZHJhd2luZw==',
  },
  xp: 300,
  createdAt: CREATED_AT,
  updatedAt: UPDATED_AT,
}

const DRAWN_QUEST_WITH_DESCRIPTION: Quest = {
  ...DRAWN_QUEST,
  label: 'Drawn quest with description',
  description: 'Draw a landscape',
}

const QUESTS = [
  PRESET_QUEST,
  PRESET_QUEST_WITH_DESCRIPTION,
  DRAWN_QUEST,
  DRAWN_QUEST_WITH_DESCRIPTION,
]

describe('QuestRowAdapter', () => {
  const adapter = container.resolve(QuestRowAdapter)

  it.each(QUESTS)('keeps "$label" unchanged after a round trip', quest => {
    const row = adapter.formatToRealm(quest)

    expect(adapter.formatToQuest(row)).toEqual(quest)
  })

  it('throws when a Drawn row has no drawing', () => {
    const row = {
      ...adapter.formatToRealm(DRAWN_QUEST),
      sketchDrawing: undefined,
    }

    expect(() => adapter.formatToQuest(row)).toThrow()
  })
})
