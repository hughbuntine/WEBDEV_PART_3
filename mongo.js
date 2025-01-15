const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4) {
    console.log('give name and number as argument')
    process.exit(1)
    }

const password = process.argv[2]

const url =
  `mongodb+srv://hughbuntine:${password}@webdev.8k4z9.mongodb.net/phonebook?retryWrites=true&w=majority&appName=WEBDEV`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const entryName = process.argv[3];
const entryNumber = process.argv[4];


const person = new Person({
  name: entryName,
  number: entryNumber,
})

// show the phone book
if (process.argv.length === 3) {
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number);
        })
        mongoose.connection.close()
      })
}
// add a person to the phone book
else{
    person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
})
}


