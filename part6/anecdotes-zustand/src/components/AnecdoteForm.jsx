import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const handleSubmit = (event) => {
    event.preventDefault()
    add(event.target.content.value)
    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name='content' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
