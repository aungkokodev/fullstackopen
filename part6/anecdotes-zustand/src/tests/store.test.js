import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useAnecdoteStore, {
  useAnecdoteActions,
  useAnecdotes,
} from '../stores/anecdotes'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    vote: vi.fn(),
  },
}))

import anecdoteServices from '../services/anecdotes'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize with the anecdotes returned by the backend', async () => {
    const anecdote = {
      content: 'If it hurts, do it more often',
      id: '47145',
      votes: 0,
    }
    anecdoteServices.getAll.mockResolvedValue([anecdote])

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    const { result: actions } = renderHook(() => useAnecdoteActions())

    await act(async () => await actions.current.initialize())
    expect(anecdotes.current).toEqual([anecdote])
  })

  it('component receives the anecdotes sorted by votes', () => {
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

  it('component receives a filtered list of anecdotes', () => {
    const anecdotes = [
      {
        content: 'If it hurts, do it more often',
        id: '47145',
        votes: 0,
      },
      {
        content: 'Adding manpower to a late software project makes it later!',
        id: '21149',
        votes: 0,
      },
      {
        content: 'Premature optimization is the root of all evil.',
        id: '25170',
        votes: 0,
      },
    ]
    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdotes())
    const { result: actions } = renderHook(() => useAnecdoteActions())

    act(() => actions.current.setFilter('optimization'))
    expect(result.current).toHaveLength(1)
    expect(result.current).toEqual([anecdotes[2]])
  })

  it('voting increases the number of votes for an anecdote', async () => {
    const anecdote = {
      content: 'If it hurts, do it more often',
      id: 1,
      votes: 0,
    }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteServices.vote.mockResolvedValue({
      ...anecdote,
      votes: anecdote.votes + 1,
    })

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    const { result: actions } = renderHook(() => useAnecdoteActions())

    await act(async () => await actions.current.vote(1))
    expect(anecdotes.current).toContainEqual({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  })
})
