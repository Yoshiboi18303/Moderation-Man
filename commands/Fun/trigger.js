const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trigger')
    .setDescription('Trigger yourself (or another user)!')
    .addUserOption(option => option.setName("user").setDescription("Select a user for this command to reference (optional).").setRequired(false)),
  options: {
    guildOnly: false
  },
  async execute(interaction) {
    await interaction.deferReply()
    const user = interaction.options.getUser("user") || interaction.user
    const user_avatar = user.displayAvatarURL({ dynamic: false, format: 'png', size: 512 })
    const link = "https://some-random-api.ml/canvas/triggered?avatar=" + user_avatar
    const attachment = new MessageAttachment(link, "triggered.gif")
    await interaction.editReply({
      files: [
        attachment
      ]
    })
  }
}