const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(morgan('tiny'));
app.use(express.json()); 
app.use(express.static('dist'));

let phonebookEntries = [
        { 
            "id": "1",
            "name": "Arto Hellas", 
            "number": "040-123456"
        },
        { 
            "id": "2",
            "name": "Ada Lovelace", 
            "number": "39-44-5323523"
        },
        { 
            "id": "3",
            "name": "Dan Abramov", 
            "number": "12-43-234345"
        },
        { 
            "id": "4",
            "name": "Mary Poppendieck", 
            "number": "39-23-6423122"
        }
];

// Route handler for /api/persons
app.get('/api/persons', (request, response) => {
        response.json(phonebookEntries);
});

// Route handler for /info
app.get('/info', (request, response) => {
        const date = new Date();
        response.send(`<p>Phonebook has info for ${phonebookEntries.length} people</p><p>${date}</p>`);
});

// Route handler for /api/persons/:id
app.get('/api/persons/:id', (request, response) => {
        const id = request.params.id;
        const entry = phonebookEntries.find(entry => entry.id === id);
        if (entry) {
                response.json(entry);
        } else {
                response.status(404).end();
        }
});

// Route handler to delete a person
app.delete('/api/persons/:id', (request, response) => {
        const id = request.params.id;
        phonebookEntries = phonebookEntries.filter(entry => entry.id !== id);
        response.status(204).end();
});


// Route handler to add a person to persons
app.post('/api/persons', (request, response) => {
    if (!request.body.name && !request.body.number) {
        return response.status(400).json({
            error: 'Both name and number are missing'
        });
    } else if (!request.body.name) {
        return response.status(400).json({
            error: 'Name is missing'
        });
    } else if (!request.body.number) {
        return response.status(400).json({
            error: 'Number is missing'
        });
    }

    const id = Math.floor(Math.random() * 100000).toString();
    const body = request.body;
    const entry = {
        id: id,
        name: body.name,
        number: body.number
    };

    phonebookEntries = phonebookEntries.concat(entry);
    response.json(entry);
});


// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(express.static('dist'))