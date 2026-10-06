import { singleton } from 'tsyringe'

import { AbstractRest } from 'shared/services/AbstractRest'

import { Quest } from '../types/Quests'
import { MOCK_LATENCY_MS, MOCK_QUESTS } from './mockQuests'

export interface GetQuestsRequest {
  cursor: string | null
  limit: number
}

export interface GetQuestsResponse {
  items: Quest[]
  nextCursor: string | null
}

@singleton()
export class QuestRest extends AbstractRest {
  async getQuests({
    cursor,
    limit,
  }: GetQuestsRequest): Promise<GetQuestsResponse> {
    await new Promise<void>(resolve => setTimeout(resolve, MOCK_LATENCY_MS))

    const start =
      cursor === null
        ? 0
        : MOCK_QUESTS.findIndex(quest => quest.id === cursor) + 1

    if (cursor !== null && start === 0) {
      throw new Error('Invalid cursor')
    }

    const items = MOCK_QUESTS.slice(start, start + limit)
    const hasMore = start + limit < MOCK_QUESTS.length

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    }
  }
}
