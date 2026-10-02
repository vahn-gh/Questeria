import Realm, { ObjectSchema } from 'realm'
import { QuestSketchKind, QuestSketchPreset } from 'src/quests/types/Quests'

export class QuestsSchema extends Realm.Object<QuestsSchema> {
  id!: string
  label!: string
  description?: string
  percentage!: number
  xp!: number
  sketchKind!: QuestSketchKind
  // set when sketchKind is Preset
  sketchPreset?: QuestSketchPreset
  // set when sketchKind is Drawn, base64 of PKDrawing data
  sketchDrawing?: string

  static schema: ObjectSchema = {
    name: 'Quest',
    primaryKey: 'id',
    properties: {
      id: 'string',
      label: 'string',
      description: 'string?',
      percentage: {
        type: 'double',
        default: 0,
      },
      xp: {
        type: 'int',
        default: 0,
      },
      sketchKind: 'string',
      sketchPreset: 'string?',
      sketchDrawing: 'string?',
    },
  }
}
