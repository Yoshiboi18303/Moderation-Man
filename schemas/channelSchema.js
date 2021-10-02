const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
  guild: {
    type: String,
    required: true
  },
  c_type: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: ""
  }
})

module.exports = mongoose.model("guild-channels", channelSchema)