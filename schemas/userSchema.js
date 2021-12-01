const { Schema, model } = require("mongoose");

var reqString = {
  type: String,
  required: true,
};

var opBool = {
  type: Boolean,
  default: false,
};

var opNum = {
  type: Number,
  default: 0,
};

const userSchema = Schema({
  id: reqString,
  blacklisted: opBool,
  voted: opBool,
  vote_timeout: opNum,
  dmable: opBool,
  commandsUsed: {
    type: Number,
    default: 1,
  },
  admin: opBool,
  owner: opBool,
  foundbug: opBool,
  bughunterlvl: opNum,
  reportedbugs: opNum,
});

module.exports = model("users", userSchema);
