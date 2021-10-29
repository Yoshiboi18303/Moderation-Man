const mongoose = require("mongoose");

const warningSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  guild: {
    type: String,
    default: "",
  },
  context: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("user-warnings", warningSchema);
