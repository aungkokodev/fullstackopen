import Person from "./Person";

const Persons = ({ persons }) =>
  persons.map((person) => <Person person={person} key={person.name} />);

export default Persons;
