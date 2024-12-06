import { useState } from "react";

// Button Component
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

// StatisticLine Component
const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

// Statistics Component
const Statistics = ({ good, neutral, bad }) => {
  let all = good + neutral + bad;
  let average = (good * 1 + bad * -1) / all;
  let positive = (good * 100) / all;

  if (!good && !neutral && !bad) return <p>No feedback given</p>;

  return (
    <table>
      <tbody>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />
        <StatisticLine text={"all"} value={all} />
        <StatisticLine text={"average"} value={average.toFixed(2)} />
        <StatisticLine text={"positive"} value={positive.toFixed(2) + " %"} />
      </tbody>
    </table>
  );
};

// App Component
const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodClick} text={"good"} />
      <Button onClick={handleNeutralClick} text={"neutral"} />
      <Button onClick={handleBadClick} text={"bad"} />
      <h2>statistic</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
