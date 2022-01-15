const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const { wait, yes } = require("../../emojis.json");
const hold = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changestatus")
    .setDescription("Change the status of the client (admins only)")
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
        .addChoice("streaming", "STREAMING")
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription(
          "The URL for this status (required for the streaming type)"
        )
        .setRequired(false)
    ),
  config: {
    timeout: ms("25s"),
    message: "Stop hurting the Discord API.",
  },
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are **NOT** an owner of this bot!",
        ephemeral: true,
      });
    var status = interaction.options.getString("status");
    var type = interaction.options.getString("type") || "PLAYING";
    var url = interaction.options.getString("url") || "";
    if (type != "STREAMING" && url.length >= 1)
      return await interaction.reply({
        content: "You don't need a URL for that status!",
        ephemeral: true,
      });
    if (type == "STREAMING" && url.length < 1)
      return await interaction.reply({
        content: "Please define a URL for this status type!",
        ephemeral: true,
      });
    await interaction.reply({
      content: `Setting status... ${wait}`,
      ephemeral: true,
    });
    await hold(3500);
    await client.user.setActivity(`${status}`, {
      type,
      url,
    });
    await interaction.editReply({
      content: `${yes} - Successfully set my status to ${status} with the \`${type}\` type!`,
      ephemeral: true,
    });
  },
};
