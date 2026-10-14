import { LocalUpdateType, ServerSnapshot } from '../types/QuestSync'
import { Quest, QuestSketchKind, QuestSketchPreset } from '../types/Quests'
import { QuestsSyncStore } from './QuestsSyncStore'
import { QueuedLocalUpdate } from '../services/repos/QuestSyncRepo'
import { QuestsBatch } from '../services/rest/QuestRest'

const mockQuestSyncRepo = {
  loadLocalUpdates: jest.fn(),
  removeSentLocalUpdates: jest.fn(),
  getSyncedMeta: jest.fn(),
  mergeBatch: jest.fn(),
  replaceWithServerSnapshot: jest.fn(),
}
const mockQuestRest = {
  getQuestsSince: jest.fn(),
  postLocalUpdates: jest.fn(),
  isSyncTokenExpired: jest.fn(),
}

jest.mock('../services/repos/QuestSyncRepo', () => ({
  QuestSyncRepo: jest.fn(() => mockQuestSyncRepo),
}))
jest.mock('../services/rest/QuestRest', () => ({
  QuestRest: jest.fn(() => mockQuestRest),
}))
jest.mock('shared/error/ErrorAPI', () => ({
  ErrorAPI: {
    log: jest.fn(),
  },
}))
jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js')
)

const createQuest = (id: string): Quest => ({
  id,
  label: `Quest ${id}`,
  percentage: 0,
  sketch: {
    kind: QuestSketchKind.Preset,
    preset: QuestSketchPreset.Potion,
  },
  xp: 10,
  createdAt: new Date('2026-10-01T10:00:00Z'),
})

const createBatch = (
  quests: Quest[],
  nextSyncToken: string,
  hasMore: boolean
): QuestsBatch => ({
  quests,
  deletedIds: [],
  nextSyncToken,
  hasMore,
})

const QUEUED_UPDATE: QueuedLocalUpdate = {
  update: {
    type: LocalUpdateType.Delete,
    id: 'quest-1',
  },
  queuedAt: new Date('2026-10-02T10:00:00Z'),
}

describe('QuestsSyncStore', () => {
  let questsSyncStore: QuestsSyncStore

  beforeEach(() => {
    // resetAllMocks would also reset the mocked constructors
    ;[
      ...Object.values(mockQuestSyncRepo),
      ...Object.values(mockQuestRest),
    ].forEach(mock => mock.mockReset())

    mockQuestSyncRepo.loadLocalUpdates.mockResolvedValue([])
    mockQuestSyncRepo.getSyncedMeta.mockResolvedValue(null)
    mockQuestRest.getQuestsSince.mockResolvedValue(
      createBatch([], 'token-1', false)
    )

    questsSyncStore = new QuestsSyncStore()
  })

  it('sends local updates before fetching and removes what was sent', async () => {
    mockQuestSyncRepo.loadLocalUpdates.mockResolvedValue([QUEUED_UPDATE])

    await questsSyncStore.sync()

    expect(mockQuestRest.postLocalUpdates).toHaveBeenCalledWith([
      QUEUED_UPDATE.update,
    ])
    expect(mockQuestSyncRepo.removeSentLocalUpdates).toHaveBeenCalledWith([
      QUEUED_UPDATE,
    ])
    expect(
      mockQuestRest.postLocalUpdates.mock.invocationCallOrder[0]
    ).toBeLessThan(mockQuestRest.getQuestsSince.mock.invocationCallOrder[0])
  })

  it('keeps fetching while the server has more', async () => {
    const firstBatch = createBatch([createQuest('a')], 'token-1', true)
    const lastBatch = createBatch([createQuest('b')], 'token-2', false)

    mockQuestSyncRepo.getSyncedMeta.mockResolvedValue({
      syncToken: 'token-0',
      syncedAt: null,
    })
    mockQuestRest.getQuestsSince
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(lastBatch)

    await questsSyncStore.sync()

    expect(mockQuestRest.getQuestsSince.mock.calls).toEqual([
      ['token-0'],
      ['token-1'],
    ])
    expect(mockQuestSyncRepo.mergeBatch.mock.calls).toEqual([
      [firstBatch],
      [lastBatch],
    ])
  })

  it('runs exactly one more sync when triggered during a sync', async () => {
    await Promise.all([
      questsSyncStore.sync(),
      questsSyncStore.sync(),
      questsSyncStore.sync(),
    ])

    expect(mockQuestSyncRepo.loadLocalUpdates).toHaveBeenCalledTimes(2)
    expect(mockQuestRest.getQuestsSince).toHaveBeenCalledTimes(2)
  })

  it('refetches all quests when the sync token expired', async () => {
    const tokenExpiredError = new Error('Gone')
    const quests = [createQuest('a'), createQuest('b')]
    const snapshot: ServerSnapshot = {
      quests,
      syncToken: 'token-2',
    }

    mockQuestSyncRepo.getSyncedMeta.mockResolvedValue({
      syncToken: 'token-old',
      syncedAt: null,
    })
    mockQuestRest.isSyncTokenExpired.mockImplementation(
      error => error === tokenExpiredError
    )
    mockQuestRest.getQuestsSince
      .mockRejectedValueOnce(tokenExpiredError)
      .mockResolvedValueOnce(createBatch([quests[0]], 'token-1', true))
      .mockResolvedValueOnce(createBatch([quests[1]], 'token-2', false))

    await questsSyncStore.sync()

    expect(mockQuestRest.getQuestsSince.mock.calls).toEqual([
      ['token-old'],
      [null],
      ['token-1'],
    ])
    expect(mockQuestSyncRepo.mergeBatch).not.toHaveBeenCalled()
    expect(mockQuestSyncRepo.replaceWithServerSnapshot).toHaveBeenCalledWith(
      snapshot
    )
  })

  it('does not fetch or remove outbox rows when sending fails', async () => {
    const error = new Error('Network down')

    mockQuestSyncRepo.loadLocalUpdates.mockResolvedValue([QUEUED_UPDATE])
    mockQuestRest.postLocalUpdates.mockRejectedValue(error)

    await expect(questsSyncStore.sync()).rejects.toBe(error)

    expect(mockQuestSyncRepo.removeSentLocalUpdates).not.toHaveBeenCalled()
    expect(mockQuestRest.getQuestsSince).not.toHaveBeenCalled()
    expect(questsSyncStore.isSyncing).toBe(false)
  })
})
