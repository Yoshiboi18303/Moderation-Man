const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const guildSchema = Schema({
  id: reqString,
  premium: { type: Boolean, default: false },
  shitFilter: { type: Boolean, default: true },
  captcha: { type: Boolean, default: false },
  voiceMod: { type: Boolean, default: false },
  welcome: { type: String, default: "" },
});

module.exports = model("dashboard-guilds", guildSchema);
