const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const key = process.env.FP_KEY;
const link = "https://gallery.fluxpoint.dev/api/album/40";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stare")
    .setDescription("Stare at someone (weirdo)")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to stare at")
        .setRequired(true)
    ),
  async execute(interaction) {
    var user = interaction.options.getUser("user");
    const fetch = await import("node-fetch");
    await interaction.deferReply();
    var img_fetch = await fetch.default(link, {
      method: "GET",
      headers: {
        Authorization: key,
      },
    });
    const { file } = await img_fetch.json();
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("WATCHING!!!!!!!")
      .setDescription(
        `**${interaction.user.username}** stared at **${user.username}** creepily, Jesus Christ.`
      )
      .setImage(file)
      .setTimestamp();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
