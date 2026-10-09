import { singleton } from 'tsyringe'

import { QUEST_PERCENTAGE_RANGE } from '../../constants/constraints'
import { Quest, QuestSketchKind, QuestSketchPreset } from '../../types/Quests'
import { LocalUpdateType } from '../../types/QuestSync'
import { QuestsBatch, LocalUpdate } from '../rest/QuestRest'

const MOCK_QUESTS_COUNT = 50
const MOCK_PERCENTAGE_STEP = 7
const MOCK_XP_STEP = 10
const MOCK_CREATED_AT_MS = Date.parse('2026-10-01T10:00:00Z')
const MOCK_CREATED_AT_STEP_MS = 60 * 1000

export const MOCK_LATENCY_MS = 300

interface SyncLogEntry {
  number: number
  questId: string
}

const createSeedQuest = (index: number): Quest => {
  const createdAt = new Date(
    MOCK_CREATED_AT_MS + index * MOCK_CREATED_AT_STEP_MS
  )

  return {
    id: `quest-${index}`,
    label: `Quest ${index + 1}`,
    percentage: (index * MOCK_PERCENTAGE_STEP) % (QUEST_PERCENTAGE_RANGE + 1),
    sketch: {
      kind: QuestSketchKind.Preset,
      preset: QuestSketchPreset.Potion,
    },
    xp: (index + 1) * MOCK_XP_STEP,
    createdAt,
    updatedAt: createdAt,
  }
}

const decodeToken = (token: string | null): number => {
  if (token === null) {
    return 0
  }

  let number: number

  try {
    number = Number(atob(token))
  } catch {
    throw new Error('Invalid sync token')
  }

  if (!Number.isInteger(number) || number < 0) {
    throw new Error('Invalid sync token')
  }

  return number
}

const encodeToken = (number: number): string => btoa(String(number))

@singleton()
export class MockQuestsServer {
  private readonly quests = new Map<string, Quest>()
  private readonly syncLog: SyncLogEntry[] = []

  constructor() {
    for (let index = 0; index < MOCK_QUESTS_COUNT; index++) {
      const quest = createSeedQuest(index)

      this.quests.set(quest.id, quest)
      this.logSync(quest.id)
    }
  }

  pull(since: string | null, limit: number): QuestsBatch {
    const sinceNumber = decodeToken(since)
    const latestByQuest = new Map<string, SyncLogEntry>()

    for (const entry of this.syncLog) {
      if (entry.number > sinceNumber) {
        latestByQuest.delete(entry.questId)
        latestByQuest.set(entry.questId, entry)
      }
    }

    const pending = [...latestByQuest.values()]
    const page = pending.slice(0, limit)
    const quests: Quest[] = []
    const deletedIds: string[] = []

    for (const { questId } of page) {
      const quest = this.quests.get(questId)

      if (quest) {
        quests.push(quest)
      } else {
        deletedIds.push(questId)
      }
    }

    const lastNumber =
      page.length > 0 ? page[page.length - 1].number : sinceNumber

    return {
      quests,
      deletedIds,
      nextSyncToken: encodeToken(lastNumber),
      hasMore: pending.length > page.length,
    }
  }

  push(syncs: LocalUpdate[]): void {
    for (const sync of syncs) {
      if (sync.type === LocalUpdateType.Upsert) {
        const quest: Quest = {
          ...sync.quest,
          updatedAt: new Date(),
        }

        this.quests.set(quest.id, quest)
        this.logSync(quest.id)
      } else {
        this.quests.delete(sync.id)
        this.logSync(sync.id)
      }
    }
  }

  private logSync(questId: string) {
    const entry: SyncLogEntry = {
      number: this.syncLog.length + 1,
      questId,
    }

    this.syncLog.push(entry)
  }
}
