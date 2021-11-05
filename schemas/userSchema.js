const { Schema, model } = require("mongoose");

var reqString = {
  type: String,
  required: true,
};

var opBool = {
  type: Boolean,
  default: false,
};

const userSchema = Schema({
  id: reqString,
  blacklisted: opBool,
  voted: opBool,
  vote_timeout: {
    type: Number,
    default: Date.now(),
  },
  dmable: opBool,
  commandsUsed: {
    type: Number,
    default: 0,
  },
});

module.exports = model("users", userSchema);
