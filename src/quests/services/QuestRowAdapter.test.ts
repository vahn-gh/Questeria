import { container } from 'tsyringe'

import { Quest, QuestSketchKind, QuestSketchPreset } from '../types/Quests'
import { QuestRowAdapter } from './QuestRowAdapter'

const QUEST_POSITION = 3

const PRESET_QUEST: Quest = {
  id: 'quest-preset',
  label: 'Preset quest',
  percentage: 40,
  sketch: {
    kind: QuestSketchKind.Preset,
    preset: QuestSketchPreset.Potion,
  },
  xp: 120,
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
    const row = adapter.formatToRealm(quest, QUEST_POSITION)

    expect(adapter.formatToQuest(row)).toEqual(quest)
  })

  it('stores the position in the row', () => {
    const row = adapter.formatToRealm(PRESET_QUEST, QUEST_POSITION)

    expect(row.position).toBe(QUEST_POSITION)
  })

  it('throws when a Drawn row has no drawing', () => {
    const row = {
      ...adapter.formatToRealm(DRAWN_QUEST, QUEST_POSITION),
      sketchDrawing: undefined,
    }

    expect(() => adapter.formatToQuest(row)).toThrow()
  })
})
