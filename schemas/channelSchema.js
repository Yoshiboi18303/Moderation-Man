const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
  guild: {
    type: String,
    required: true
  },
  c: {
    type: Object,
    default: {}
  },
})

module.exports = mongoose.model("guild-channels", channelSchema)