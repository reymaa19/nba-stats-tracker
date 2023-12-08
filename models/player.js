const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  _id: String,
  name: String,
  position: String,
  stats: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stats',
  },
})

playerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Player', playerSchema)
