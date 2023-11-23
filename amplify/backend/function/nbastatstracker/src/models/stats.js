const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: Object,
  },
  player: {
    type: mongoose.Schema.Types.String,
    ref: 'Player',
  },
})

statsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Stats', statsSchema)
