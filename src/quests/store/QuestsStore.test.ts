import { QUESTS_PAGE_SIZE } from '../constants/constraints'
import {
  Quest,
  QuestDraft,
  QuestSketchKind,
  QuestSketchPreset,
} from '../types/Quests'
import { QuestsStore } from './QuestsStore'

const mockQuestsRepo = {
  loadQuests: jest.fn(),
  listenToQuestsChanges: jest.fn(),
  createQuest: jest.fn(),
  updateQuest: jest.fn(),
  deleteQuest: jest.fn(),
}
const mockQuestsSyncStore = {
  isSyncing: false,
  sync: jest.fn(),
}

jest.mock('../services/repos/QuestsRepo', () => ({
  QuestsRepo: jest.fn(() => mockQuestsRepo),
}))
jest.mock('./QuestsSyncStore', () => ({
  QuestsSyncStore: jest.fn(() => mockQuestsSyncStore),
}))
jest.mock('shared/error/ErrorAPI', () => ({
  ErrorAPI: {
    log: jest.fn(),
    show: jest.fn(),
  },
}))

const { ErrorAPI } = jest.requireMock('shared/error/ErrorAPI')

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

const createQuests = (count: number) =>
  Array.from(Array(count).keys()).map(index => createQuest(`quest-${index}`))

const DRAFT: QuestDraft = {
  label: 'New quest',
  percentage: 0,
  sketch: {
    kind: QuestSketchKind.Preset,
    preset: QuestSketchPreset.Potion,
  },
  xp: 10,
}

describe('QuestsStore', () => {
  let questsStore: QuestsStore
  let notifyQuestsChanged: () => void

  beforeEach(() => {
    // resetAllMocks would also reset the mocked constructors
    ;[
      ...Object.values(mockQuestsRepo),
      mockQuestsSyncStore.sync,
      ErrorAPI.log,
      ErrorAPI.show,
    ].forEach(mock => mock.mockReset())

    mockQuestsRepo.listenToQuestsChanges.mockImplementation(async onChange => {
      notifyQuestsChanged = onChange

      return () => {}
    })

    questsStore = new QuestsStore()
  })

  it('shows the first page on start', async () => {
    const quests = createQuests(QUESTS_PAGE_SIZE)

    mockQuestsRepo.loadQuests.mockResolvedValue(quests)

    await questsStore.start()

    expect(mockQuestsRepo.loadQuests).toHaveBeenCalledWith(QUESTS_PAGE_SIZE)
    expect(questsStore.quests).toEqual(quests)
  })

  it('reads one more page when the loaded quests are full', async () => {
    const quests = createQuests(QUESTS_PAGE_SIZE * 2)

    mockQuestsRepo.loadQuests.mockImplementation(async (count: number) =>
      quests.slice(0, count)
    )

    await questsStore.start()
    await questsStore.loadNextPage()

    expect(mockQuestsRepo.loadQuests).toHaveBeenLastCalledWith(
      QUESTS_PAGE_SIZE * 2
    )
    expect(questsStore.quests).toEqual(quests)
  })

  it('does not read more when every quest is loaded', async () => {
    mockQuestsRepo.loadQuests.mockResolvedValue(createQuests(3))

    await questsStore.start()
    await questsStore.loadNextPage()

    expect(mockQuestsRepo.loadQuests).toHaveBeenCalledTimes(1)
  })

  it('reads the loaded quests again when quests change in Realm', async () => {
    const changedQuests = [createQuest('new'), ...createQuests(2)]

    mockQuestsRepo.loadQuests
      .mockResolvedValueOnce(createQuests(2))
      .mockResolvedValueOnce(changedQuests)

    await questsStore.start()
    notifyQuestsChanged()
    await Promise.resolve()

    expect(mockQuestsRepo.loadQuests).toHaveBeenLastCalledWith(QUESTS_PAGE_SIZE)
    expect(questsStore.quests).toEqual(changedQuests)
  })

  it('writes to the repo, then syncs', async () => {
    await questsStore.createQuest(DRAFT)

    expect(mockQuestsRepo.createQuest).toHaveBeenCalledWith(DRAFT)
    expect(mockQuestsRepo.createQuest.mock.invocationCallOrder[0]).toBeLessThan(
      mockQuestsSyncStore.sync.mock.invocationCallOrder[0]
    )
  })

  it('shows the error when refresh fails', async () => {
    const error = new Error('Network down')

    mockQuestsSyncStore.sync.mockRejectedValue(error)

    await questsStore.refresh()

    expect(ErrorAPI.show).toHaveBeenCalledWith(error)
  })
})
