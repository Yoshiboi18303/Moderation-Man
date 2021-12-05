const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const afkSchema = Schema({
  user: reqString,
  message: {
    type: String,
    default: ""
  }
})

module.exports = model("afk-users", afkSchema)