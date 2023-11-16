const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  position: String,
})

playerSchema.plugin(uniqueValidator)

playerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Player', playerSchema)
