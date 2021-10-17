const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Profiles = require('../../schemas/profileSchema');
const colors = require('../../colors.json');

var jobs = [
  "Bot Developer",
  "Cashier",
  "Chef",
  "Scientist",
  "Moderator"
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to make money!"),
  async execute(interaction) {
    var profile = Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if(err) throw err
      if(!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription("You don't have any data on this bot! Please run `/start` to get some data on this bot!")
          .setFooter(`${interaction.user.username} needs some data lmao.`, interaction.user.displayAvatarURL({ dynamic: true, size: 32 }))
          .setTimestamp()
        return await interaction.reply({ embeds: [no_data_embed], ephemeral: true })
      } else {
        var coins = data.coins
        var random_coins = Math.floor(Math.random() * 250)
        var random_job = jobs[Math.floor(Math.random() * jobs.length)]
        data = await Profiles.findOneAndUpdate({
          id: interaction.user.id
        },
        {
          $inc: {
            coins: random_coins
          }
        })
        data.save()
        const success_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Success")
          .setDescription(`You worked as a ${random_job} and earned ${random_coins} coins out of it!`)
        await interaction.reply({ embeds: [success_embed], ephemeral: true })
      }
    })
  }
}