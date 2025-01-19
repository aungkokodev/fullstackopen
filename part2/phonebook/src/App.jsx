import { useEffect, useRef, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const timeoutId = useRef();

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
  const displayMessage = (message, isError = false) => {
    setError(isError);
    setMessage(message);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setMessage(null);
      setError(false);
    }, 5000);
  };

  /* */
  const resetForm = () => {
    setNewName("");
    setNewNumber("");
  };

  /* */
  const addPerson = (e) => {
    e.preventDefault();

    if (!newName.trim()) return;

    let newPerson = { name: newName.trim(), number: newNumber };
    let isExist = persons.find(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
    );
    newPerson = { ...isExist, ...newPerson };

    if (isExist) {
      let accept = confirm(
        `${newName} is already added to phonebook, replace the old number number with a new one?`
      );

      if (!accept) return;

      personService
        .update(newPerson.id, newPerson)
        .then((data) => {
          setPersons((prev) =>
            prev.map((person) => (person.id !== data.id ? person : data))
          );
          resetForm();
          displayMessage(
            `Updated ${data.name}'s old number with ${data.number}`
          );
        })
        .catch((error) => {
          displayMessage(error.response.data.error, true);
        });

      return;
    }

    personService
      .create(newPerson)
      .then((data) => {
        setPersons((prev) => prev.concat(data));
        resetForm();
        displayMessage(`Added ${data.name}`);
      })
      .catch((error) => {
        displayMessage(error.response.data.error, true);
      });
  };

  /* */
  const removePerson = (person) => {
    const accept = confirm(`Delete ${person.name}?`);

    if (!accept) return;

    personService
      .remove(person.id)
      .then(() => {
        displayMessage(`Deleted ${person.name}`);
        setPersons((prev) => prev.filter((p) => p.id !== person.id));
      })
      .catch(() => {
        displayMessage(
          `Information of ${person.name} has already been removed from server`,
          true
        );
        setPersons((prev) => prev.filter((p) => p.id !== person.id));
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
      <Notification message={message} error={error} />
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
