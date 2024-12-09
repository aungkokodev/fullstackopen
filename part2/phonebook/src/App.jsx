import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  /* */
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  /* */
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  /* */
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  /* */
  const addPerson = (e) => {
    e.preventDefault();

    if (!newName.trim()) return;

    let newPerson = { name: newName.trim(), number: newNumber };
    let isExist = persons.find(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
    );

    if (isExist) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    personService.create(newPerson).then((data) => {
      setPersons((prev) => prev.concat(data));
    });

    setNewName("");
    setNewNumber("");
  };

  /* */
  const removePerson = (person) => {
    const accept = confirm(`Delete ${person.name}?`);

    if (!accept) return;

    personService.remove(person.id).then((data) => {
      setPersons((prev) => prev.filter((person) => person.id !== data.id));
    });
  };

  /* */
  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onSubmit={addPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
