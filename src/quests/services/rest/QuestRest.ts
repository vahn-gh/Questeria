import { HttpStatusCode, isAxiosError } from 'axios'
import { container, singleton } from 'tsyringe'

import { AbstractRest } from 'shared/services/AbstractRest'

import { QUESTS_BATCH_LIMIT } from '../../constants/constraints'
import { LocalUpdateType } from '../../types/QuestSync'
import { Quest } from '../../types/Quests'
import { MOCK_LATENCY_MS, MockQuestsServer } from '../mocks/MockQuestsServer'

export interface QuestsBatch {
  quests: Quest[]
  deletedIds: string[]
  nextSyncToken: string
  hasMore: boolean
}

export type LocalUpdate =
  | { type: LocalUpdateType.Upsert; quest: Quest }
  | { type: LocalUpdateType.Delete; id: string }

const waitMockLatency = () =>
  new Promise<void>(resolve => setTimeout(resolve, MOCK_LATENCY_MS))

@singleton()
export class QuestRest extends AbstractRest {
  async getQuestsSince(syncToken: string | null): Promise<QuestsBatch> {
    await waitMockLatency()

    return container
      .resolve(MockQuestsServer)
      .pull(syncToken, QUESTS_BATCH_LIMIT)
  }

  async postLocalUpdates(updates: LocalUpdate[]): Promise<void> {
    await waitMockLatency()
    container.resolve(MockQuestsServer).push(updates)
  }

  isSyncTokenExpired(error: unknown) {
    return isAxiosError(error) && error.response?.status === HttpStatusCode.Gone
  }
}
