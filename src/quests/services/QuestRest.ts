import { container, singleton } from 'tsyringe'

import { AbstractRest } from 'shared/services/AbstractRest'

import { QUESTS_PULL_LIMIT } from '../constants/constraints'
import { QuestChangeType } from '../types/QuestChange'
import { Quest } from '../types/Quests'
import { MOCK_LATENCY_MS, MockQuestsServer } from './MockQuestsServer'

export interface PullQuestsResponse {
  quests: Quest[]
  deletedIds: string[]
  nextToken: string
  hasMore: boolean
}

export type QuestChangeRequest =
  | { type: QuestChangeType.Upsert; quest: Quest }
  | { type: QuestChangeType.Delete; id: string }

const waitMockLatency = () =>
  new Promise<void>(resolve => setTimeout(resolve, MOCK_LATENCY_MS))

@singleton()
export class QuestRest extends AbstractRest {
  async pullQuests(since: string | null): Promise<PullQuestsResponse> {
    await waitMockLatency()

    return container.resolve(MockQuestsServer).pull(since, QUESTS_PULL_LIMIT)
  }

  async pushQuestChanges(changes: QuestChangeRequest[]): Promise<void> {
    await waitMockLatency()
    container.resolve(MockQuestsServer).push(changes)
  }
}
