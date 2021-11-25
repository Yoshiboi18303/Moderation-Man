const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("passed")
    .setDescription("Respect +100")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to put on the image")
        .setRequired(false)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    await interaction.deferReply();
    var link = "https://some-random-api.ml/canvas/passed";
    var user = interaction.options.getUser("user") || interaction.user;
    link += `?avatar=${user.displayAvatarURL({
      dynamic: false,
      format: "png",
      size: 512,
    })}`;
    const attachment = new MessageAttachment(link, "mission_passed.png");
    await interaction.editReply({ files: [attachment] });
  },
};
