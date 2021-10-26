const { SlashCommandBuilder } = require('@discordjs/builders');
const Channels = require('../../schemas/channelSchema');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setreaction")
    .setDescription("Set the reaction roles channel")
    .addChannelOption(option => option.setName("channel").setDescription("The channel to set (needs to be a text channel)").setRequired(true)),
  async execute(interaction) {
    if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply({ content: "You don't have the `MANAGE_CHANNELS` permission!", ephemeral: true })
    var channel = interaction.options.getChannel("channel")

    if(channel.type != "GUILD_TEXT") return await interaction.reply({ content: "Invalid Channel Type. The channel needs to be of type `GUILD_TEXT` (Text)", ephemeral: true })
    await interaction.deferReply({ ephemeral: true })
    Channels.findOne({ guild: interaction.guild.id, channelType: "REACTION" }, async (err, data) => {
      if(err) throw err
      if(!data) {
        data = new Channels({
          guild: interaction.guild.id,
          channelType: "REACTION",
          channelId: channel.id
        })
        data.save()
        await interaction.editReply({ content: `Successfully set the Reaction Roles channel to ${channel}!`, ephemeral: true })
      } else {
        data = await Channels.findOneAndUpdate({
          guild: interaction.guild.id
        },
        {
          channelId: channel.id
        })
        await interaction.editReply({ content: `Successfully changed the Reaction Roles to ${channel}!`, ephemeral: true })
      }
    })
  }
}