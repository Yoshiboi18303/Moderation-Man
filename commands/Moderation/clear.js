const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(
      "Purge a certain number of messages from the current channel!"
    )
    .addIntegerOption((option) =>
      option
        .setName("messages")
        .setDescription("Type in a number of messages to purge")
        .setRequired(true)
    ),
  config: {
    timeout: ms("20s"),
    message: "Could you not spam moderate?",
  },
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
      return await interaction.reply({
        content:
          "You don't have the `MANAGE_MESSAGES` permission, so you can't run this command!",
        ephemeral: true,
      });
    if (
      !interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
    )
      return await interaction.reply({
        content: "I require the `MANAGE_MESSAGES` permission for this command!",
        ephemeral: true,
      });
    const number_to_delete = interaction.options.getInteger("messages");
    if (number_to_delete > 100)
      return await interaction.reply(
        "You can only purge 100 messages at a time!"
      );
    if (number_to_delete <= 0)
      return await interaction.reply({
        content: "You need to delete at least 1 message!",
      });
    try {
      interaction.channel.bulkDelete(number_to_delete).then(async () => {
        await interaction.reply(
          `Purged ${number_to_delete} messages from <#${interaction.channel.id}>!`
        );
      });
    } catch (e) {
      await interaction.reply({
        content: "An error occurred while trying to purge messages!",
      });
    }
  },
};
