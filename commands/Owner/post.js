const { SlashCommandBuilder } = require("@discordjs/builders");
const { yes, nope } = require("../../emojis.json");
const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Post stats to Statcord"),
  async execute(interaction) {
    if (interaction.user.id != config.bot.owner)
      return await interaction.reply({
        content: `${nope} - You are **NOT** the owner of this bot!`,
        ephemeral: true,
      });
    client.stats.post();
    const success_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("Success!")
      .setDescription(
        `Successfully posted stats on **${client.user.username}** to Statcord!\nThere could've been a problem though, please check the console.`
      );
    await interaction.reply({ embeds: [success_embed], ephemeral: true });
  },
};
