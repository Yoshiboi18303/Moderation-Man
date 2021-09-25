const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Nukes the current channel (which deletes it) and rebuilds it fresh!"),
  async execute(interaction) {
    if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply({ content: 'You don\'t have the `MANAGE_CHANNELS` permission, so you can\'t run this command!', ephemeral: true })
    const channel = interaction.channel
    // console.log(interaction.channel)
    // interaction.reply({ content: 'Check the console!', ephemeral: true })
    await interaction.reply("Nuking channel...")
    await interaction.channel.clone()
    .then(async (cnl) => {
      await cnl.setParent(channel.parent.id)
      await cnl.setPosition(channel.position)
      await channel.delete()
  })
 }
}