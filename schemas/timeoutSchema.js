const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const timeoutSchema = Schema({
  user: reqString,
  timeouts: {
    type: Array,
    default: [],
  },
});

module.exports = model("user-timeouts", timeoutSchema);
