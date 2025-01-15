const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

// get the URL from the .env file
require('dotenv').config();
const url = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit if connection fails
    }
};

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  })

const Person = mongoose.model('Person', personSchema);

module.exports = { connectDB, Person };