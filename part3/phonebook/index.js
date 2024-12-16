const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = 3001;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/persons", (request, response) => {
  response.status(200).json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) response.status(404).end();
  else response.json(person);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${Date().toString()}</p>`
  );
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number)
    return response.status(400).json({
      error: "missing name or number",
    });

  const isExist = persons.find((p) => p.name === body.name);
  if (isExist)
    return response.status(400).json({
      error: "name must be unique",
    });

  const id = String(Math.floor(Math.random() * 1000000));
  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.status(201).json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
