import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total
      total={course.parts.reduce((sum, part) => sum + part.exercises, 0)}
    />
  </div>
);

export default Course;
