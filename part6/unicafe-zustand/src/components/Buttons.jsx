import { useFeedbackControls } from '../store'

const Buttons = () => {
  const { increaseGood, increaseNeutral, increaseBad } = useFeedbackControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={increaseGood}>good</button>
      <button onClick={increaseNeutral}>neutral</button>
      <button onClick={increaseBad}>bad</button>
    </div>
  )
}

export default Buttons
