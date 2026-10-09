import { Quest } from './Quests'

export enum LocalUpdateType {
  // creates the quest, or replaces it if the id already exists
  Upsert = 'Upsert',
  // deletes the quest by id; an unknown id is ignored
  Delete = 'Delete',
}

export interface ServerSnapshot {
  quests: Quest[]
  syncToken: string
}
