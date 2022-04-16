const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    default: "User",
  },
  color: {
    type: String,
    default: "#000000",
  },
  coins: {
    type: Number,
    default: 100,
  },
  vault_coins: {
    type: Number,
    default: 0,
  },
  vault_level: {
    type: Number,
    default: 1,
  },
  vault_max: {
    type: Number,
    default: 2500,
  },
  items: {
    type: Object,
    default: {
      computers: 0,
      padlocks: 0,
    },
  },
  lastDaily: {
    type: Number,
    default: 0,
  },
  lastWeekly: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Number,
    default: 0,
  },
  passive: {
    type: Boolean,
    default: false,
  },
  previousNickname: {
    type: String,
    default: "",
  },
  previousColor: {
    type: String,
    default: "",
  },
  dailyStreak: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("user-profiles", profileSchema);
