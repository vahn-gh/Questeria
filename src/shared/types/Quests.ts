import { UniqueID } from './common'

export enum QuestSketchPreset {
  Potion = 'Potion',
  Landscape = 'Landscape',
}

export enum QuestSketchKind {
  Preset = 'Preset',
  Drawn = 'Drawn',
}

export interface QuestPresetSketch {
  kind: QuestSketchKind.Preset
  preset: QuestSketchPreset
}

export interface QuestDrawnSketch {
  kind: QuestSketchKind.Drawn
  // Base64 of PencilKit's PKDrawing.dataRepresentation()
  drawing: string
}

export type QuestSketch = QuestPresetSketch | QuestDrawnSketch

export interface Quest {
  id: UniqueID
  label: string
  description: string
  percentage: number
  sketch: QuestSketch
  xp: number
}
