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

  it('anecdotes are sorted by votes', () => {
    const anecdotes = [
      {
        content: 'If it hurts, do it more often',
        id: '47145',
        votes: 1,
      },
      {
        content: 'Adding manpower to a late software project makes it later!',
        id: '21149',
        votes: 0,
      },
      {
        content: 'Premature optimization is the root of all evil.',
        id: '25170',
        votes: 11,
      },
    ]
    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual(
      anecdotes.toSorted((a, b) => b.votes - a.votes),
    )
  })
})
