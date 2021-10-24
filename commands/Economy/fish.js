const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Profiles = require('../../schemas/profileSchema');
const colors = require('../../colors.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fish")
    .setDescription("Use a fishing rod to get fish!"),
  async execute(interaction) {
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if(err) throw err
      if(!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription("You don't have any data on this bot! Please run `/start` to get some data on this bot!")
          .setFooter(`${interaction.user.username} needs some data lmao.`, interaction.user.displayAvatarURL({ dynamic: true, size: 32 }))
          .setTimestamp()
        return await interaction.reply({ embeds: [no_data_embed], ephemeral: true })
      } else if(data.inventory.items.fishing_rods == 0 || typeof data.inventory.items.fishing_rods == 'undefined') {
        const bad_item_count_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription("You don't have any fishing rods!\nPlease ask `Yoshiboi18303#4045` for one!")
          .setFooter(`${interaction.user.username} needs a fishing rod lmao.`, interaction.user.displayAvatarURL({ dynamic: true, size: 32 }))
          .setTimestamp()
        return await interaction.reply({ embeds: [bad_item_count_embed], ephemeral: true })
      } else {
        var fishing_rods = data.inventory.items.fishing_rods
        var fish = data.inventory.fish

        var fishes_to_catch = [
          "Blue Gill",
          "Goldfish",
          "Danios",
          "White Cloud",
          "Bloodfin Tetras",
          "Black Molly"
        ]
        var fish_caught = fishes_to_catch[Math.floor(Math.random() * fishes_to_catch.length)]

        data = await Profiles.findOneAndUpdate({
          id: interaction.user.id
        },
        {
          $set: {
            inventory: {
              items: {
                fishing_rods: fishing_rods - 1
              },
              fish: fish + 1
            }
          }
        })
        data.save()
        const success_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Success!")
          .setDescription(`You have caught a **${fish_caught}**!`)
          .setFooter(`${interaction.user.username} finished fishing!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
          .setTimestamp()
        await interaction.reply({ embeds: [success_embed] })
      }
    })
  }
}