const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("passed")
    .setDescription("Respect +100"),
  async execute(interaction) {
    var link = "https://some-random-api.ml/canvas/passed";
    var user = interaction.user;
    link += `?avatar=${user.displayAvatarURL({
      dynamic: false,
      format: "png",
      size: 512,
    })}`;
    const attachment = new MessageAttachment(link, "mission_passed.png");
    await interaction.reply({ files: [attachment] });
  },
};
