const { Schema, model } = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const ticketSchema = Schema({
  guild: reqString,
  mod_role: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
});

module.exports = model("guild-ticket-settings", ticketSchema);
