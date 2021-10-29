const mongoose = require("mongoose");

var defaultString = {
  type: String,
  default: "",
};

const channelSchema = mongoose.Schema({
  guild: {
    type: String,
    required: true,
  },
  channelType: defaultString,
  channelId: defaultString,
});

module.exports = mongoose.model("guild-channels", channelSchema);
