const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const opString = {
  type: String,
  default: ""
}

const countSysSchema = Schema({
  guild: reqString,
  channel: opString,
  currentNumber: {
    type: Number,
    default: 0,
  },
  nextNumber: {
    type: Number,
    default: 1,
  },
  lastNumUser: opString
});

module.exports = model("guild-count-systems", countSysSchema);
