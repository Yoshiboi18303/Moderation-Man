const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const colors = require('../../colors.json');
const hold = require('util').promisify(setTimeout);
const { yes, wait } = require('../../emojis.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestfeature")
    .setDescription("Suggest a feature for Moderation Man!")
    .addStringOption(option => option.setName("suggestion").setDescription("The feature to suggest").setRequired(true)),
  async execute(interaction) {
    await interaction.reply({ content: `Sending suggestion... ${wait}`, ephemeral: true })
    var suggestion = interaction.options.getString("suggestion")

    var channel = client.channels.cache.get('902031074979360818')

    const sent_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("Success")
      .setDescription(`${yes} - Successfully sent your suggestion: "${suggestion}" to **${client.guilds.cache.get('892603177248096306').name}**!`)
      .setFooter(`${interaction.user.username} suggested something!`, interaction.user.displayAvatarURL({ dynamic: false, format: 'png', size: 32 }))
      .setTimestamp()
    const suggestion_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("New Suggestion")
      .addFields([
        {
          name: 'Suggestion',
          value: `${suggestion}`,
          inline: true
        },
        {
          name: 'Guild Of Suggestion',
          value: `${interaction.guild.name}`,
          inline: true
        },
        {
          name: 'Suggester',
          value: `${interaction.user.username}`,
          inline: true
        }
      ])
    await hold(3000)
    await interaction.editReply({ content: "Suggestion successful!", embeds: [sent_embed], ephemeral: true })
    await channel.send({ embeds: [suggestion_embed] })
  }
}