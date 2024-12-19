const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ADMIN:${password}@agenda.bayg4.mongodb.net/?retryWrites=true&w=majority&appName=Agenda`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length===3) {
    Contact.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
            mongoose.connection.close()
        })
      })
  }else if (process.argv.length===5){
    const name = process.argv[3];
    const number = process.argv[4];

    const contact = new Contact({
        name,
        number,
    });
      
      contact.save().then(result => {
          console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
          mongoose.connection.close()
      })
  }

