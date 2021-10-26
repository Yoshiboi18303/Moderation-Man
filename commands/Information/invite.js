const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Returns the link to invite Moderation Man!"),
  async execute(interaction) {
    var user = interaction.user
    var member = interaction.member
    var invite_link = client.generateInvite({
      scopes: [
        'applications.commands', 
        'bot'
      ],
      permissions: [
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "USE_EXTERNAL_EMOJIS",
        "MENTION_EVERYONE",
        "CHANGE_NICKNAME",
        "MANAGE_ROLES",
        "MANAGE_EMOJIS_AND_STICKERS",
        "USE_APPLICATION_COMMANDS"
      ]
    })
    invite_link += "&redirect_uri=https://moderation-man.ml/invited?referral=discord"
    const invite_embed = new MessageEmbed()
      .setColor(member.displayHexColor || "BLURPLE")
      .setTitle(`Invite ${client.user.username}`)
      .setDescription(`Click [this](${invite_link}) to invite me!`)
      .setFooter(`${user.username} requested this`, user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
      .setTimestamp()
    await interaction.reply({ embeds: [invite_embed] })
  }
}