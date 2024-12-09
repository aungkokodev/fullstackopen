const Person = ({ person, removePerson }) => (
  <p>
    {person.name} {person.number}{" "}
    <button onClick={() => removePerson(person)}>delete</button>
  </p>
);

export default Person;
