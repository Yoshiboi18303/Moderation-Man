const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');
const log_id = "892607019138310205";
const guild_id = "892603177248096306";
const Warnings = require('../schemas/warningSchema');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    if(member.guild.id == guild_id) {
      var user = member.user;
      var guild = member.guild;
      // Warnings.findOne({ id: user.id, guild: guild.id }, async (err, data) => {
      //   if(err) throw err
      //   if(data) {
      //     data.delete()
      //     console.log(`Deleted all warning data on ${user.username} in ${guild.name}!`)
      //     data.save()
      //   }
      // })
      var owner = client.users.cache.get(guild.ownerId);
      if(!member.user.bot) {
        const user_left_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("New Member Joined!")
          .setDescription(`**${user.username}** left **${guild.name}**, see you later old buddy... 😦`)
        client.channels.cache.get(log_id).send({ embeds: [user_left_embed] })
        user.send({ content: `Sad to see you leave **${guild.name}**... hope you come back soon!` })
      } else {
        const bot_left_embed = new MessageEmbed()
          .setColor(colors.blue)
          .setTitle("New Bot Joined!")
          .setDescription(`**${user.username}** left **${guild.name}**, see you later bot... 😦`)
        client.channels.cache.get(log_id).send({ embeds: [bot_left_embed] })
      }
    } else {
      return;
    }
  }
}