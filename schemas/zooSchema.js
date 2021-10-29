const { Schema, model } = require("mongoose");

const zooSchema = Schema({
  id: {
    type: String,
    required: true,
  },
  animals: {
    type: Object,
    default: {},
  },
});

module.exports = model("user-zoo", zooSchema);
