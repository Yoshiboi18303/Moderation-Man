const { Schema, model } = require("mongoose");

const suggestionSchema = Schema({
  id: {
    type: String,
    default: "",
  },
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
  embed: {
    type: String,
    default: "",
  },
});

module.exports = model("suggestions", suggestionSchema);
