const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const suggestionSchema = Schema({
  id: reqString,
  suggestion: {
    type: String,
    default: "",
  },
  suggestor: {
    type: String,
    default: "",
  },
  guild: {
    type: String,
    default: "",
  },
});

module.exports = model("suggestions", suggestionSchema);
