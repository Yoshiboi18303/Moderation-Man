const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoose = require("mongoose");
const { wait, yes, nope } = require("../../emojis.json");
const CP = require("../../items/classes/CloseProcess");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restarts the client!")
    .addBooleanOption((option) =>
      option
        .setName("close_process")
        .setDescription("Should the process be closed?")
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: `${nope} - You are **NOT** an owner of **${client.user.username}**!`,
        ephemeral: true,
      });
    var close_the_process =
      interaction.options.getBoolean("close_process") || false;
    if (close_the_process == true) {
      await interaction.reply({
        content:
          "Okay, not restarting the client, just gonna close the process, see you soon then!",
        ephemeral: true,
      });
      setTimeout(
        () => new CP("Restart Command said to close the process"),
        10000
      );
    } else {
      await interaction.reply({
        content: `Restarting... ${wait}`,
        ephemeral: true,
      });
      await client.user.setActivity("Restarting...", {
        type: "PLAYING",
      });
      client.destroy();
      client.login(process.env.TOKEN);
      require("../../events/ready");
      require("../../client");
      setTimeout(async () => {
        await interaction.editReply({
          content: `Restart Successful! ${yes}`,
          ephemeral: true,
        });
      }, 1500);
      await client.user.setActivity("Restart Completed!", {
        type: "PLAYING",
      });
    }
  },
};
