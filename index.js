
//servidor simple
//const http = require('http')  //se importa el servidor web integrado a node
const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())  // para acceder a los datos json-parser

app.use(morgan('tiny'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

/*
const app = http.createServer((request, response) => {  //se crea el servidor web del modulo http
  response.writeHead(200, { 'Content-Type': 'application/json' }) //e registra un controlador de eventos en el servidor, que se llama cada vez que se realiza una solicitud HTTP a la dirección del servidor http://localhost:3001. regresa codigo 200 con la cabecera establecida en 'application/json'
  response.end(JSON.stringify(persons)) //devuelve la respeusta las personas en formato JSON
})*/

app.get('/info', (request, response) => {
    const numberOfPersons = persons.length; // Obtén el número de personas
    const currentTime = new Date(); // Obtén la hora actual
    response.send(`
        <p>Phonebook has info for ${numberOfPersons} persons</p>
        <p>${currentTime}</p>
    `);
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {  //Podemos definir parámetros para rutas en Express usando la sintaxis de dos puntos:
    //const id = request.params.id   //Se puede acceder al parámetro id en la ruta de una solicitud a través del objeto request:
    const id = Number(request.params.id) //se convierte a numero
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else { //en caso de que no encuentre la nota
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {  //borrar recursos
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {

    const body = request.body;

      if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

    const unique = persons.find(person => person.name === body.name)
    if (unique) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

      let generateId;
    do {
        generateId = Math.floor(Math.random() * 100000);
    } while (persons.find(person => person.id === generateId));


      const person = {
        id: generateId,
        name: body.name,
        number: body.number,
      }

    persons = persons.concat(person)
    console.log(person)
    response.json(person)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT) //enlazan el servidor http asignado a la variable app, para escuchar las solicitudes HTTP enviadas al puerto 3001
console.log(`Server running on port ${PORT}`)