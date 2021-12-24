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
  job: {
    type: String,
    default: "",
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
  inventory: {
    type: Object,
    default: {
      items: {
        work_boosters: 0,
        nukes: 0,
        computers: 0,
        fishing_rods: 0,
      },
      fish: 0,
    },
  },
  startedAt: {
    type: Number,
    default: 0,
  },
  passive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user-profiles", profileSchema);
