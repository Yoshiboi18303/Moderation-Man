const mongoose = require("mongoose");

const optionsSchema = mongoose.Schema({
  guild: {
    type: String,
    required: true,
  },
  leveling: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("guild-options", optionsSchema);
