const { SlashCommandBuilder } = require('@discordjs/builders');
const Channels = require('../../schemas/channelSchema');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel-set")
    .setDescription("Set a channel of your choice!")
    .addSubcommand(subcommand => subcommand.setName("audit").setDescription("Sets the audit log channel").addChannelOption(option => option.setName("channel").setDescription("Select the channel for the audit logs").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("welcome").setDescription("Sets the welcome channel").addChannelOption(option => option.setName("channel").setDescription("Select the channel for the welcome messages").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("reaction_role").setDescription("Sets the reaction roles channel!").addChannelOption(option => option.setName("channel").setDescription("The channel to target").setRequired(true))),
  async execute(interaction) {
    if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply({ content: "You don't have the `MANAGE_CHANNELS` permission, so this command is off limits for you!", ephemeral: true })
    await interaction.deferReply({ ephemeral: true })
    var subcommand = interaction.options.getSubcommand()
    if(subcommand == "audit") {
      var channel = interaction.options.getChannel("channel")
      if(channel.type != "GUILD_TEXT") return await interaction.editReply({ content: `Please provide a text channel (selected channel type: \`${channel.type}\`)!`, ephemeral: true })
      // console.log(typeof subcommand)
      // return await interaction.reply({ content: "Coming Soon!", ephemeral: true })
      Channels.findOne({ guild: interaction.guild.id }, async (err, data) => {
        if(err) throw err;
        if(!data) {
          data = new Channels({ guild: interaction.guild.id, c: { c_type: subcommand, c_channel: channel } })
          data.save()
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success!")
            .setDescription(`${emojis.yes} - Successfully set the ${subcommand} channel to <#${channel.id}>!`)
            .setFooter(`Channel successfully set!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
            .setTimestamp()
          await interaction.editReply({ embeds: [success_embed], ephemeral: true })
        } else {
          data = await Channels.findOneAndUpdate({ guild: interaction.guild.id }, { c: { c_type: subcommand, c_channel: channel } })
          data.save()
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success!")
            .setDescription(`${emojis.yes} - Successfully set the ${subcommand} channel to <#${channel.id}>!`)
            .setFooter(`Channel successfully set!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
            .setTimestamp()
          await interaction.editReply({ embeds: [success_embed], ephemeral: true })
        }
      })
    } else if(subcommand == "welcome") {
      var channel = interaction.options.getChannel("channel")
      if(channel.type != "GUILD_TEXT") return await interaction.editReply({ content: `Please provide a text channel (selected channel type: \`${channel.type}\`)!`, ephemeral: true })
      // console.log(typeof subcommand)
      // return await interaction.reply({ content: "Coming Soon!", ephemeral: true })
      Channels.findOne({ guild: interaction.guild.id }, async (err, data) => {
        if(err) throw err;
        if(!data) {
          data = new Channels({ guild: interaction.guild.id, c: { c_type: subcommand, c_channel: channel } })
          data.save()
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success!")
            .setDescription(`${emojis.yes} - Successfully set the ${subcommand} channel to <#${channel.id}>!`)
            .setFooter(`Channel successfully set!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
            .setTimestamp()
          await interaction.editReply({ embeds: [success_embed], ephemeral: true })
        } else {
          data = await Channels.findOneAndUpdate({ guild: interaction.guild.id }, { c: { c_type: subcommand, c_channel: channel } })
          data.save()
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success!")
            .setDescription(`${emojis.yes} - Successfully set the ${subcommand} channel to <#${channel.id}>!`)
            .setFooter(`Channel successfully set!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
            .setTimestamp()
          await interaction.editReply({ embeds: [success_embed], ephemeral: true })
        }
      })
    } else if(subcommand == 'reaction_role') {
      var channel = await interaction.options.getChannel("channel")
      if(channel.type != "GUILD_TEXT") return await interaction.editReply({ content: `Please provide a text channel (selected channel type: \`${channel.type}\`)!`, ephemeral: true })
      // console.log(typeof subcommand)
      // return await interaction.reply({ content: "Coming Soon!", ephemeral: true })
      Channels.findOne({ guild: interaction.guild.id }, async (err, data) => {
        if(err) throw err;
        if(!data) {
          data = new Channels({ guild: interaction.guild.id, c: { c_type: subcommand, c_channel: channel } })
          data.save()
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success!")
            .setDescription(`${emojis.yes} - Successfully set the ${subcommand} channel to <#${channel.id}>!`)
            .setFooter(`Channel successfully set!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
            .setTimestamp()
          await interaction.editReply({ embeds: [success_embed], ephemeral: true })
        } else {
          data = await Channels.findOneAndUpdate({ guild: interaction.guild.id }, { 
            $set: {
              c: { c_channel: channel }
            }
           })
          data.save()
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success!")
            .setDescription(`${emojis.yes} - Successfully set the ${subcommand} channel to <#${channel.id}>!`)
            .setFooter(`Channel successfully set!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
            .setTimestamp()
          await interaction.editReply({ embeds: [success_embed], ephemeral: true })
        }
      })
    }
  }
}