const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  position: String,
})

playerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.id
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Player', playerSchema)
