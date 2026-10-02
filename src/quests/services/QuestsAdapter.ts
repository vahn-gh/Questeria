import { Unmanaged } from 'realm'

import { QuestsSchema } from 'src/quests/services/QuestsSchema'

import {
  QUEST_LABEL_LENGTH,
  QUEST_PERCENTAGE_RANGE,
} from 'src/quests/constants/constraints'
import { Quest, QuestSketch, QuestSketchKind } from 'src/quests/types/Quests'

export class QuestsAdapter {
  /** @throws {Error} */
  static sketchFromDB(item: QuestsSchema): QuestSketch {
    const preset = item.sketchPreset
    const drawing = item.sketchDrawing

    switch (item.sketchKind) {
      case QuestSketchKind.Preset:
        if (!preset) {
          throw new Error(`Quest ${item.id}: preset sketch has no preset`)
        }

        return {
          kind: QuestSketchKind.Preset,
          preset,
        }

      case QuestSketchKind.Drawn:
        if (!drawing) {
          throw new Error(`Quest ${item.id}: drawn sketch has no drawing`)
        }

        return {
          kind: QuestSketchKind.Drawn,
          drawing,
        }

      default:
        throw new Error(
          `Quest ${item.id}: unknown sketch kind ${item.sketchKind}`
        )
    }
  }

  /** @throws {Error} */
  static fromDB(item: QuestsSchema): Quest {
    return {
      id: item.id,
      label: item.label,
      description: item.description ?? undefined,
      percentage: item.percentage,
      sketch: QuestsAdapter.sketchFromDB(item),
      xp: item.xp,
    }
  }

  /** @throws {Error} */
  static listFromDB(data: Iterable<QuestsSchema>): Quest[] {
    return Array.from(data, QuestsAdapter.fromDB)
  }

  /** @throws {Error} */
  static toDB(item: Quest): Unmanaged<QuestsSchema> {
    if (item.label.length > QUEST_LABEL_LENGTH) {
      throw new Error(`Label exceeds ${QUEST_LABEL_LENGTH} characters`)
    }

    if (item.percentage < 0 || item.percentage > QUEST_PERCENTAGE_RANGE) {
      throw new Error(
        `Percentage must be between 0 and ${QUEST_PERCENTAGE_RANGE}`
      )
    }

    if (item.xp < 0) {
      throw new Error('XP must not be negative')
    }

    return {
      id: item.id,
      label: item.label,
      description: item.description,
      percentage: item.percentage,
      xp: item.xp,
      sketchKind: item.sketch.kind,
      sketchPreset:
        item.sketch.kind === QuestSketchKind.Preset
          ? item.sketch.preset
          : undefined,
      sketchDrawing:
        item.sketch.kind === QuestSketchKind.Drawn
          ? item.sketch.drawing
          : undefined,
    }
  }
}
