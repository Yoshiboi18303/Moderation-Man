const { SlashCommandBuilder } = require("@discordjs/builders");
const Users = require('../../schemas/userSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure something!"),
  async execute(interaction) {
    return await interaction.reply({ content: "Coming Soon!", ephemeral: true })
  }
} // brb