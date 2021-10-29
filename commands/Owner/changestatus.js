const { SlashCommandBuilder } = require("@discordjs/builders");
const { wait, yes, nope } = require("../../emojis.json");
const hold = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changestatus")
    .setDescription("Change the status of the client")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("The new status")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The optional type of status")
        .setRequired(false)
        .addChoice("playing", "PLAYING")
        .addChoice("listening", "LISTENING")
        .addChoice("competing", "COMPETING")
        .addChoice("watching", "WATCHING")
    ),
  async execute(interaction) {
    if (interaction.user.id != config.bot.owner)
      return await interaction.reply({
        content: "You are **NOT** the owner of this bot!",
        ephemeral: true,
      });
    var status = interaction.options.getString("status");
    var type = interaction.options.getString("type") || "PLAYING";
    await interaction.reply({
      content: `Setting status... ${wait}`,
      ephemeral: true,
    });
    await hold(3500);
    await client.user.setActivity(`${status}`, {
      type: type,
    });
    await interaction.editReply({
      content: `${yes} - Successfully set my status to ${status} with the \`${type}\` type!`,
      ephemeral: true,
    });
  },
};
