const { SlashCommandBuilder } = require('@discordjs/builders');
const Channels = require('../../schemas/channelSchema');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel-set")
    .setDescription("Set a channel of your choice!")
    .addSubcommand(subcommand => subcommand.setName("audit").setDescription("Sets the audit log channel").addChannelOption(option => option.setName("channel").setDescription("Select the channel for the audit logs").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("welcome").setDescription("Sets the welcome channel").addChannelOption(option => option.setName("channel").setDescription("Select the channel for the welcome messages").setRequired(true))),
  async execute(interaction) {
    if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply({ content: "You don't have the `MANAGE_CHANNELS` permission, so this command is off limits for you!", ephemeral: true })
    var subcommand = interaction.options.getSubcommand()
    if(subcommand == "audit") {
      var channel = interaction.options.getChannel("channel")
    } else if(subcommand == "welcome") {
      var channel = interaction.options.getChannel("channel")
    }
  }
}