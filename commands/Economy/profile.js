const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Profiles = require('../../schemas/profileSchema');
const colors = require('../../colors.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your profile (or one of another user)!")
    .addUserOption(option => option.setName("user").setDescription("Select a user to view").setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })
    var user = interaction.options.getUser("user") || interaction.user;
    if(user.bot) return await interaction.editReply({ content: "The user is a bot, which can't be used in this system!", ephemeral: true })
    var username_string;
    var usage_string;
    if(user.id == interaction.user.id) {
      username_string = "You don't"
      usage_string = ""
    } else {
      username_string = user.username + " doesn't"
      usage_string = "beg them to"
    }
    var profile = Profiles.findOne({ id: user.id }, async (err, data) => {
      // console.log(data)
      if(err) throw err
      if(!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(`Whoops! ${username_string} have any data! Please go ahead and ${usage_string} run \`/start\` if you want to have this command work!`)
        return await interaction.editReply({ embeds: [no_data_embed], ephemeral: true })
      } else {
        var cafvc_vc = data.vault_max - data.vault_coins
        if(cafvc_vc < 0) cafvc_vc = 0
        var cafvc_pc = data.vault_max - data.coins
        if(cafvc_pc < 0) cafvc_pc = 0
        const profile_embed = new MessageEmbed()
          .setColor(data.color)
          .setTitle(`${data.nickname}'s Profile!`)
          .addFields([
            {
              name: 'Coins',
              value: `${data.coins}`,
              inline: true
            },
            {
              name: 'Vault Amount',
              value: `${data.vault_coins}`,
              inline: true
            },
            {
              name: 'Vault Max',
              value: `${data.vault_max}`,
              inline: true
            },
            {
              name: 'Vault Level',
              value: `${data.vault_level}`,
              inline: true
            },
            {
              name: 'Computers',
              value: `${data.inventory.items.computers}`,
              inline: true
            },
            {
              name: 'Started At',
              value: `${moment.utc(data.startedAt).format("LL - LTS")}`,
              inline: true
            },
            {
              name: 'Coins Away From Max Vault Capacity (vault coins)',
              value: `${cafvc_vc}`,
              inline: true
            },
            {
              name: 'Coins Away From Max Vault Capacity (pocket coins)',
              value: `${cafvc_pc}`,
              inline: true
            }
          ])
        await interaction.editReply({ embeds: [profile_embed] })
      }
    })
  }
}