const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');
const { wait, yes, nope } = require('../../emojis.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restarts the client!"),
  async execute(interaction) {
    if(interaction.user.id != config.bot.owner) return await interaction.reply({ content: `${nope} - You are **NOT** the owner of **${client.user.username}**!`, ephemeral: true })
    await interaction.reply({ content: `Restarting... ${wait}`, ephemeral: true })
    await client.user.setActivity("Restarting...", {
      type: "PLAYING"
    })
    client.destroy()
    client.login(process.env.TOKEN)
    require('../../events/ready');
    require('../../index');
    setTimeout(async () => {
      await interaction.editReply({ content: `Restart Successful! ${yes}`, ephemeral: true })
    }, 1500)
  }
}