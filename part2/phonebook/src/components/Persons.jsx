import Person from "./Person";

const Persons = ({ persons, removePerson }) =>
  persons.map((person) => (
    <Person person={person} key={person.name} removePerson={removePerson} />
  ));

export default Persons;
