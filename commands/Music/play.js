const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song!"),
  async execute(interaction) {
    return await interaction.reply({ content: "Coming soon!", ephemeral: true })
  }
}