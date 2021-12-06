const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const pollSetSchema = Schema({
  guild: reqString,
  message: {
    type: String,
    default: "",
  },
});

module.exports = model("guild-poll-settings", pollSetSchema);
