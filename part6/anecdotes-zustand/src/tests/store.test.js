import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useAnecdoteStore, {
  useAnecdoteActions,
  useAnecdotes,
} from '../stores/anecdotes'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
  },
}))

import anecdoteServices from '../services/anecdotes'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize with the anecdotes returned by the backend', async () => {
    const mock = [
      {
        content: 'If it hurts, do it more often',
        id: '47145',
        votes: 0,
      },
    ]
    anecdoteServices.getAll.mockResolvedValue(mock)

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    const { result: actions } = renderHook(() => useAnecdoteActions())

    await act(async () => actions.current.initialize())

    expect(anecdotes.current).toEqual(mock)
  })
})
