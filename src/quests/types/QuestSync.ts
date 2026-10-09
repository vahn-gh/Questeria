export enum QuestSyncType {
  // creates the quest, or replaces it if the id already exists
  Upsert = 'Upsert',
  // deletes the quest by id; an unknown id is ignored
  Delete = 'Delete',
}
