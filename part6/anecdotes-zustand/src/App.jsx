import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import { useAnecdoteActions } from './stores/anecdotes'
import Notification from './components/Notification'

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
