const { MessageEmbed } = require('discord.js');
const Options = require('../schemas/optionsSchema');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    // var guild_options = Options.findOne({ guild: message.guild.id })
    // console.log(guild_options)
    if(!message.author.bot && !message.channel.type == "DM" && message.mentions.members.first() === message.guild.me) {
      const embed = new MessageEmbed()
        .setColor("YELLOW")
        .setTitle(`Welcome to ${client.user.username}!`)
        .setDescription(`Hello ${message.author.username}, I see you have mentioned me.\nAre you lost? Check all my commands by starting with \`/\`!`)
      await message.channel.send({ embeds: [embed] })
    }/* else if(message.guild && !message.author.bot && guild_options.leveling) {
      const randomXP = Math.floor(Math.random() * 9) + 1;
      const hasLeveledUp = Levels.appendXp(message.author.id, message.guild.id, randomXP);
      if(hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        await message.channel.send({ content: `You have successfully leveled up to level **${user.level}**, keep up the great work! :rocket:`, ephemeral: true })
      }
    }*/
  }
}