const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendinfo")
    .setDescription("Send info to every server on the bot")
    .addStringOption((option) =>
      option
        .setName("info")
        .setDescription("The info to send")
        .setRequired(true)
    ),
  config: {
    timeout: ms("11s"),
    message: "Don't spam info",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are not an owner of this bot!",
        ephemeral: true,
      });
    var info = interaction.options.getString("info");
    await Log(client, interaction.guild, Enum.Log.Info, {
      member: interaction.user,
      message: info,
      moderator: interaction.user,
    });
    await interaction.reply({
      content: "Info sent!",
      ephemeral: true,
    });
  },
};
