const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rate")
    .setDescription("The client rates your content")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content to rate")
        .setRequired(true)
    ),
  async execute(interaction) {
    var content = interaction.options.getString("content");

    const rated_embed = new MessageEmbed()
      .setColor(hexColor)
      .setTitle(`${client.user.username} Rating!`)
      .setDescription(
        `${client.user.username}: "I rate ${content} a ${Math.floor(
          Math.random() * 11
        )}/10."`
      )
      .setFooter(
        `${interaction.user.username} requested this.`,
        interaction.user.displayAvatarURL({
          dynamic: false,
          format: "png",
          size: 32,
        })
      )
      .setTimestamp();
    await interaction.reply({ embeds: [rated_embed] });
  },
};
