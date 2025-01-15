const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
require('dotenv').config();

const { connectDB, Person } = require('./models/person');

// BACK END
// _______________________________________________________
app.use(cors())
app.use(morgan('tiny'));
app.use(express.json()); 
app.use(express.static('dist'));

// Route handler for /api/persons
app.get('/api/persons', async (req, res, next) => {
    try {
        const persons = await Person.find({});
        res.json(persons);
    } catch (error) {
        next(error);
    }
});

// Route handler for /info
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            next(error);
        });
});

// Route handler to delete a person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(err => next(err));
});


// Route handler to add a person to persons
app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({
            error: 'Both name and number are required'
        });
    }

    // Check if the person already exists in the database
    Person.findOne({ name }).then(existingPerson => {
        if (existingPerson) {
            return response.status(400).json({ error: 'Name must be unique' });
        }

        // Create and save the new person
        const person = new Person({ name, number });
        person.save()
            .then(savedPerson => response.json(savedPerson))
            .catch(error => next(error)); 
    }).catch(error => next(error));
});


// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }

    next(error);
});

// **Connect to MongoDB and start the server**
connectDB().then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// _______________________________________________________



