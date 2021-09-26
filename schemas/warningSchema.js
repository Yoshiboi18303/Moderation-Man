const mongoose = require('mongoose');

const warningSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  warnings: {
    type: Number,
    default: 0
  },
})

module.exports = mongoose.Model("user-warnings", warningSchema)