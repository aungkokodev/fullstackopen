import { useAnecdoteActions } from '../stores/anecdotes'

const Filter = () => {
  const { setFilter } = useAnecdoteActions()

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      filter <input type='text' name='filter' onChange={handleChange} />
    </div>
  )
}

export default Filter
