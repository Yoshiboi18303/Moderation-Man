const { Canvas } = require('canvacord');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wanted")
    .setDescription("Dead or alive")
    .addUserOption(option => option.setName("user").setDescription("The user to use for the image").setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply()
    
    var user = interaction.options.getUser("user") || interaction.user

    var image = await Canvas.wanted(user.displayAvatarURL({ dynamic: false, format: 'png', size: 512 }))

    var attachment = new MessageAttachment(image, "wanted.png")

    await interaction.editReply({ files: [attachment] })
  }
}