const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const countSysSchema = Schema({
  guild: reqString,
  channel: {
    type: String,
    default: "",
  },
  currentNumber: {
    type: Number,
    default: 0,
  },
  nextNumber: {
    type: Number,
    default: 1,
  },
});

module.exports = model("guild-count-system", countSysSchema);
