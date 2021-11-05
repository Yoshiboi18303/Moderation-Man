const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("Put someone in jail.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to put into the jail image")
        .setRequired(false)
    ),
  async execute(interaction) {
    var user = interaction.options.getUser("user") || interaction.user;
    await interaction.deferReply();
    var link = `https://some-random-api.ml/canvas/jail?avatar=${user.displayAvatarURL(
      { dynamic: false, format: "png", size: 512 }
    )}`;
    const attachment = new MessageAttachment(link, "wasted.png");
    await interaction.editReply({
      files: [attachment],
    });
  },
};
