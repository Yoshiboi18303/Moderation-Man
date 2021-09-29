const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    if(!member.user.bot) {
      var user = member.user;
      var guild = member.guild;
      var owner = client.users.cache.get(guild.ownerId);
      const user_left_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("New Member Joined!")
        .setDescription(`**${user.username}** left **${guild.name}**, see you later old buddy... 😦`)
      client.channels.cache.get("892582945834033192").send({ embeds: [user_left_embed] })
      user.send({ content: `Sad to see you leave **${guild.name}**... hope you come back soon!` })
    } else {
      var user = member.user;
      var guild = member.guild;
      const bot_left_embed = new MessageEmbed()
        .setColor(colors.blue)
        .setTitle("New Bot Joined!")
        .setDescription(`**${user.username}** left **${guild.name}**, see you later bot... 😦`)
      client.channels.cache.get("892582945834033192").send({ embeds: [bot_left_embed] })
    }
  }
}