const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Profiles = require('../../schemas/profileSchema');
const colors = require('../../colors.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rmvmoney")
    .setDescription("Remove some money from someone's wallet")
    .addIntegerOption(option => option.setName("amount").setDescription("The amount of money to remove").setRequired(true))
    .addUserOption(option => option.setName("user").setDescription("The user to remove money from").setRequired(false)),
  async execute(interaction) {
    if(interaction.user.id != config.bot.owner) return await interaction.reply({ content: "You are **NOT** the owner of this bot!", ephemeral: true })
    await interaction.deferReply({ ephemeral: true })
    var amount = interaction.options.getInteger("amount")
    var user = interaction.options.getUser("user") || interaction.user

    if(amount < 1) return await interaction.editReply({ content: "You need to remove at least 1 coin!", ephemeral: true })

    Profiles.findOne({ id: user.id }, async (err, data) => {
      var username_string;
      var username_string_2;
      var usage_string;
      if(user.username == interaction.user.username) {
        username_string = "You don't"
        usage_string = ""
        username_string_2 = "your"
      } else {
        username_string = `**${user.username}**`
        usage_string = "beg them to"
        username_string_2 = `**${user.username}**'s`
      }
      if(err) throw err
      if(!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(`Whoops! ${username_string} have any data! Please go ahead and ${usage_string} run \`/start\` if you want to have this command work!`)
        return await interaction.editReply({ embeds: [no_data_embed], ephemeral: true })
      } else {
        var coins = data.coins
        if(amount > coins) return await interaction.editReply({ content: "That's way too much!", ephemeral: true })
        data = await Profiles.findOneAndUpdate({ id: user.id }, { 
          $set: {
            coins: coins - amount
          }
        })
        data.save()
        const success_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Success!")
          .setDescription(`Successfully removed $${amount} coins from ${username_string_2} wallet!`)
        await interaction.editReply({ embeds: [success_embed], ephemeral: true })
      }
    })
  }
}