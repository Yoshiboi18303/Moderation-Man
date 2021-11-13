const { SlashCommandBuilder } = require("@discordjs/builders");
const { yes, nope } = require("../../emojis.json");
const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Posts stats to Statcord"),
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are **NOT** an owner of this bot!",
        ephemeral: true,
      });
    await interaction.deferReply({ ephemeral: true })
    client.stats.post().then(async (status) => {
      if (status == String) {
        const success_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Success")
          .setDescription(
            `Successfully posted stats on **${client.user.username}** to Statcord!`
          );
        return await interaction.editReply({
          embeds: [success_embed],
          ephemeral: true,
        });
      } else {
        const error_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `An error occurred while posting stats, please check the console.`
          );
        return await interaction.editReply({
          embeds: [error_embed],
          ephemeral: true,
        });
      }
    });
  },
};
