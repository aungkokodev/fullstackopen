import { useFeedbackBad, useFeedbackGood, useFeedbackNeutral } from '../store'

const Statistics = () => {
  const good = useFeedbackGood()
  const neutral = useFeedbackNeutral()
  const bad = useFeedbackBad()
  const all = good + neutral + bad
  const average = (good * 1 + bad * -1) / all
  const positive = (good * 100) / all

  const noFeedback = !good && !neutral && !bad

  return (
    <div>
      <h2>statistics</h2>

      {noFeedback ?
        <p>No feedback given</p>
      : <table>
          <tbody>
            <tr>
              <td>good</td>
              <td>{good}</td>
            </tr>
            <tr>
              <td>neutral</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>bad</td>
              <td>{bad}</td>
            </tr>
            <tr>
              <td>all</td>
              <td>{all}</td>
            </tr>
            <tr>
              <td>average</td>
              <td>{average.toFixed(2)}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{positive.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      }
    </div>
  )
}

export default Statistics
