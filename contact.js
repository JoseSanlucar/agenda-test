const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phoneValidation = /^\d{2,3}-\d{5,}$/;

  const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: [3, 'Name must be at least 3 characters long'],
      required: [true, 'Name is required']
    },
    number: {
      type: String,
      required: [true, 'Number is required'],
      minLength: [8, 'Number must be at least 8 characters long'],
      validate: {
        validator: function (value) {
          return phoneValidation.test(value);
        },
        message: (props) => `${props.value} is not a valid phone number! It must match the format XX-XXXXX or XXX-XXXXX.`,
      },
    },
  });

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Contact', contactSchema)