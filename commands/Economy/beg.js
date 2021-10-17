const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Profiles = require('../../schemas/profileSchema');
const colors = require('../../colors.json');

const people = [
  'Grandmother',
  'Construction Worker',
  'Music Artist',
  'Bot Developer',
  'Teacher',
  'Bank Teller',
  'YouTuber',
  'Twitch Streamer',
  'YouTuber'
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription("Beg someone for money!"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if(err) throw err
      if(!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription("You don't have any data on this bot! Please run `/start` to get some data on this bot!")
          .setFooter(`${interaction.user.username} needs some data lmao.`, interaction.user.displayAvatarURL({ dynamic: true, size: 32 }))
          .setTimestamp()
        return await interaction.editReply({ embeds: [no_data_embed], ephemeral: true })
      } else {
        var coins = data.coins
        var person = people[Math.floor(Math.random() * people.length)]
        var earned_coins = Math.floor(Math.random() * 150) + 5
        const success_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Success!")
          .setDescription(`You begged a ${person} and earned ${earned_coins} coins!`)
          .setFooter(`${interaction.user.username} begged someone!`, interaction.user.displayAvatarURL({ dynamic: true, size: 32 }))
          .setTimestamp()
        data = await Profiles.findOneAndUpdate({
          id: interaction.user.id
        },
        {
          $set: {
            coins: coins + earned_coins
          }
        })
        data.save()
        await interaction.editReply({ embeds: [success_embed] })
      }
    })
  }
}