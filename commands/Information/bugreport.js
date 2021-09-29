const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bugreport")
    .setDescription(`Report a bug on the client to the owner!`)
    .addStringOption(option => option.setName("bug").setDescription("Type in the bug to report").setRequired(true)),
  options: {
    guildOnly: false
  },
  async execute(interaction) {
    const owner = client.users.cache.get('697414293712273408')
    const bug = interaction.options.getString("bug")
    const new_bug_reported_embed = new MessageEmbed()
      .setColor("YELLOW")
      .setTitle("New Bug Reported!")
      .addFields([
        {
          name: 'Bug',
          value: `${bug}`
        },
        {
          name: 'Guild of Report',
          value: `${interaction.guild.name}`
        },
        {
          name: 'Bug Reporter',
          value: `${interaction.user.username}`
        }
      ])
    await interaction.reply("Reporting bug...")
    setTimeout(async function() {
      await owner.send({
        embeds: [
          new_bug_reported_embed
        ]
      })
      await interaction.editReply(`Your bug has been reported to **${owner.tag}**!`)
    }, 5000)
  }
}