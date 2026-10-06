import { singleton } from 'tsyringe'

import { isNotNull } from 'shared/utils/isNotNull'

import { Quest, QuestSketch, QuestSketchKind } from '../types/Quests'
import type { QuestsSchema } from './QuestsSchema'

export type QuestRow = Pick<
  QuestsSchema,
  | 'id'
  | 'label'
  | 'description'
  | 'percentage'
  | 'xp'
  | 'sketchKind'
  | 'sketchPreset'
  | 'sketchDrawing'
  | 'position'
>

@singleton()
export class QuestRowAdapter {
  formatToRealm(quest: Quest, position: number): QuestRow {
    const { sketch } = quest

    return {
      id: quest.id,
      label: quest.label,
      description: quest.description,
      percentage: quest.percentage,
      xp: quest.xp,
      sketchKind: sketch.kind,
      sketchPreset:
        sketch.kind === QuestSketchKind.Preset ? sketch.preset : undefined,
      sketchDrawing:
        sketch.kind === QuestSketchKind.Drawn ? sketch.drawing : undefined,
      position,
    }
  }

  formatToQuest(data: QuestRow): Quest {
    return {
      id: data.id,
      label: data.label,
      description: data.description ?? undefined,
      percentage: data.percentage,
      sketch: this.formatSketch(data),
      xp: data.xp,
    }
  }

  private formatSketch(data: QuestRow): QuestSketch {
    if (
      data.sketchKind === QuestSketchKind.Preset &&
      isNotNull(data.sketchPreset)
    ) {
      return {
        kind: QuestSketchKind.Preset,
        preset: data.sketchPreset,
      }
    }

    if (
      data.sketchKind === QuestSketchKind.Drawn &&
      isNotNull(data.sketchDrawing)
    ) {
      return {
        kind: QuestSketchKind.Drawn,
        drawing: data.sketchDrawing,
      }
    }

    throw new Error(`Quest ${data.id} has an invalid sketch`)
  }
}
