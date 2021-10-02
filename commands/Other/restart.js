const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { wait, yes } = require('../../emojis.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restarts the client!"),
  async execute(interaction) {
    await interaction.reply({ content: `Restarting... ${wait}` })
    client.destroy()
    client.login(process.env.TOKEN)
    client.user.setActivity("Restarting...", {
      type: "PLAYING"
    })
    require('../../events/ready');
    require('../../index');
    await interaction.editReply({ content: `Restart Successful! ${yes}` })
  }
}