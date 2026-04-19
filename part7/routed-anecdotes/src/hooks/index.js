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

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteServices.createNew(anecdote)
    setAnecdotes((anecdotes) => anecdotes.concat(newAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteServices.deleteAnecdote(id)
    setAnecdotes((anecdotes) => anecdotes.filter((a) => a.id !== id))
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  }
}
