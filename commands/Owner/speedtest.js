const { SlashCommandBuilder } = require("@discordjs/builders");
const shell = require("shelljs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("speedtest")
    .setDescription("Shows how fast the network is on the client"),
  config: {
    timeout: ms("1m"),
    message: "Don't spam internet speed tests",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You aren't an owner of the client!",
        ephemeral: true,
      });
    await interaction.deferReply();
    var output = shell.exec("speedtest");
    await interaction.editReply({
      content: `\`\`\`\n${output}\n\`\`\``,
    });
  },
};
