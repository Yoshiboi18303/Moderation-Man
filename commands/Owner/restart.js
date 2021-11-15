const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoose = require("mongoose");
const { wait, yes, nope } = require("../../emojis.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restarts the client!"),
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: `${nope} - You are **NOT** an owner of **${client.user.username}**!`,
        ephemeral: true,
      });
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
  },
};
