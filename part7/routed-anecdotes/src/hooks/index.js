import { useEffect, useState } from 'react'
import anecdoteServices from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => setValue(event.target.value)

  const reset = () => setValue('')

  return {
    type,
    value,
    onChange,
    reset,
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteServices.getAll().then((anecdotes) => setAnecdotes(anecdotes))
  }, [])

  const addAnecdote = (anecdote) => {
    anecdoteServices
      .createNew(anecdote)
      .then((anecdote) =>
        setAnecdotes((anecdotes) => anecdotes.concat(anecdote)),
      )
  }

  return {
    anecdotes,
    addAnecdote,
  }
}
