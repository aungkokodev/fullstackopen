require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;
const Person = require("./models/person");

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

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

morgan.token("body", (request, response) => JSON.stringify(request.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.status(200).json(persons);
  });
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

  // const isExist = persons.find((p) => p.name === body.name);
  // if (isExist)
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((person) => {
    response.status(201).json(person);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
