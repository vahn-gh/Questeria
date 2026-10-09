import { container, singleton } from 'tsyringe'

import { AbstractRest } from 'shared/services/AbstractRest'

import { QUESTS_PULL_LIMIT } from '../../constants/constraints'
import { QuestSyncType } from '../../types/QuestSync'
import { Quest } from '../../types/Quests'
import { MOCK_LATENCY_MS, MockQuestsServer } from '../mocks/MockQuestsServer'

export interface PullQuestsResponse {
  quests: Quest[]
  deletedIds: string[]
  nextToken: string
  hasMore: boolean
}

export type QuestSyncRequest =
  | { type: QuestSyncType.Upsert; quest: Quest }
  | { type: QuestSyncType.Delete; id: string }

const waitMockLatency = () =>
  new Promise<void>(resolve => setTimeout(resolve, MOCK_LATENCY_MS))

@singleton()
export class QuestRest extends AbstractRest {
  async pullQuests(since: string | null): Promise<PullQuestsResponse> {
    await waitMockLatency()

    return container.resolve(MockQuestsServer).pull(since, QUESTS_PULL_LIMIT)
  }

  async pushQuestSyncs(syncs: QuestSyncRequest[]): Promise<void> {
    await waitMockLatency()
    container.resolve(MockQuestsServer).push(syncs)
  }
}
