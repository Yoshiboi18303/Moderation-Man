const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');
const log_id = "892607019138310205";
const guild_id = "892603177248096306";
const user_role_id = "892610872428613673";
const bot_role_id = "892611367461326859";

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if(member.guild.id == guild_id) {
      if(!member.user.bot) {
        var user = member.user;
        var guild = member.guild;
        var owner = client.users.cache.get(guild.ownerId);
        const new_user_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("New Member Joined!")
          .setDescription(`**${user.username}** joined **${guild.name}**, welcome to the server! 👋`)
        client.channels.cache.get(log_id).send({ embeds: [new_user_embed] })
        member.roles.add(user_role_id)
        user.send({ content: `Welcome to **${guild.name}**, thanks so much for joining!\nThe current owner is **<@${guild.ownerId}>**, and they joined Discord on ${moment.utc(owner.createdTimestamp).format("LL LTS")} which was ${moment.utc(owner.createdTimestamp).fromNow()}!` })
      } else {
        var user = member.user;
        var guild = member.guild;
        const new_bot_embed = new MessageEmbed()
          .setColor(colors.purple)
          .setTitle("New Bot Joined!")
          .setDescription(`**${user.username}** joined **${guild.name}**, welcome to the server! 👋`)
        client.channels.cache.get(log_id).send({ embeds: [new_bot_embed] })
        member.roles.add(bot_role_id)
      }
    } else {
      return;
    }
  }
}