const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("host")
    .setDescription("Shows how Moderation Man is hosted"),
  async execute(interaction) {
    const host_provider_embed = new MessageEmbed()
      .setColor(interaction.member.displayHexColor || "BLUE")
      .setTitle(`${client.user.username} Hosting!`)
      .setDescription(`${client.user.username} is hosted on [SoloNodes](https://solonodes.xyz/)! Go and check out their hosting if you want a free way to host your bot!`)
      .setFooter(`${interaction.user.username} requested this!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
      .setTimestamp()
    await interaction.reply({ embeds: [host_provider_embed] })
  }
}