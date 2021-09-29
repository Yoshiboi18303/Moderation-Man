const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    if(!member.user.bot) {
      var user = member.user;
      var guild = member.guild;
      var owner = client.users.cache.get(guild.ownerId);
      const new_user_embed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("New Member Joined!")
        .setDescription(`**${user.username}** joined **${guild.name}**, welcome to the server! 👋`)
      client.channels.cache.get("892582945834033192").send({ embeds: [new_user_embed] })
      user.send({ content: `Welcome to **${guild.name}**, thanks so much for joining!\nThe current owner is **<@${guild.ownerId}>**, and they joined Discord on ${moment.utc(owner.createdTimestamp).format("LL LTS")} which was ${moment.utc(owner.createdTimestamp).fromNow()}!` })
    } else {
      var user = member.user;
      var guild = member.guild;
      const new_bot_embed = new MessageEmbed()
        .setColor(colors.purple)
        .setTitle("New Bot Joined!")
        .setDescription(`**${user.username}** joined **${guild.name}**, welcome to the server! 👋`)
      client.channels.cache.get("892582945834033192").send({ embeds: [new_bot_embed] })
    }
  }
}