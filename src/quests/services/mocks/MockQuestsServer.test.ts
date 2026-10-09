import { QuestSyncType } from '../../types/QuestSync'
import { MockQuestsServer } from './MockQuestsServer'
import { QuestSyncRequest } from '../rest/QuestRest'

const PAGE_LIMIT = 20
const SEEDED_QUESTS_COUNT = 50

const pullAll = (server: MockQuestsServer) => {
  const pages = []
  let token: string | null = null
  let hasMore = true

  while (hasMore) {
    const page = server.pull(token, PAGE_LIMIT)

    pages.push(page)
    token = page.nextToken
    hasMore = page.hasMore
  }

  return { pages, token }
}

describe('MockQuestsServer', () => {
  let server: MockQuestsServer

  beforeEach(() => {
    server = new MockQuestsServer()
  })

  it('returns all seeded quests over pages without a token', () => {
    const { pages } = pullAll(server)
    const quests = pages.flatMap(page => page.quests)

    expect(pages.map(page => page.quests.length)).toEqual([20, 20, 10])
    expect(new Set(quests.map(quest => quest.id)).size).toBe(
      SEEDED_QUESTS_COUNT
    )
    expect(pages[pages.length - 1].hasMore).toBe(false)
  })

  it('returns nothing and the same token when pulling with the last token', () => {
    const { token } = pullAll(server)
    const page = server.pull(token, PAGE_LIMIT)

    expect(page.quests).toEqual([])
    expect(page.deletedIds).toEqual([])
    expect(page.nextToken).toBe(token)
    expect(page.hasMore).toBe(false)
  })

  it('returns only the pushed syncs after a push', () => {
    const { pages, token } = pullAll(server)
    const [first, second] = pages[0].quests
    const syncs: QuestSyncRequest[] = [
      {
        type: QuestSyncType.Upsert,
        quest: { ...first, label: 'Edited' },
      },
      {
        type: QuestSyncType.Delete,
        id: second.id,
      },
    ]

    server.push(syncs)
    const page = server.pull(token, PAGE_LIMIT)

    expect(page.quests.map(quest => quest.id)).toEqual([first.id])
    expect(page.quests[0].label).toBe('Edited')
    expect(page.quests[0].updatedAt).toBeInstanceOf(Date)
    expect(page.deletedIds).toEqual([second.id])
    expect(page.hasMore).toBe(false)
  })

  it('returns a quest edited twice once', () => {
    const { pages, token } = pullAll(server)
    const [quest] = pages[0].quests
    const syncs: QuestSyncRequest[] = [
      {
        type: QuestSyncType.Upsert,
        quest: { ...quest, label: 'First edit' },
      },
      {
        type: QuestSyncType.Upsert,
        quest: { ...quest, label: 'Second edit' },
      },
    ]

    server.push(syncs)
    const page = server.pull(token, PAGE_LIMIT)

    expect(page.quests).toHaveLength(1)
    expect(page.quests[0].label).toBe('Second edit')
  })

  it('throws on a token that is not a sync number', () => {
    expect(() => server.pull(btoa('abc'), PAGE_LIMIT)).toThrow(
      'Invalid sync token'
    )
  })
})
