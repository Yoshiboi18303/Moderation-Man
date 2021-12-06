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
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    var content = interaction.options.getString("content");

    var rating = Math.floor(Math.random() * 11);

    const rated_embed = new MessageEmbed()
      .setColor(hexColor)
      .setTitle(`${client.user.username} Rating!`)
      .setDescription(
        `${client.user.username}: "I rate ${content} a ${rating}/10."`
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
