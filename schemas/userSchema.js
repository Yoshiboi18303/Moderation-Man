const { Schema, model } = require('mongoose');

var reqString = {
  type: String,
  required: true
}

var opBool = {
  type: Boolean,
  default: false
}

const userSchema = Schema({
  id: reqString,
  blacklisted: opBool
})

module.exports = model('users', userSchema)