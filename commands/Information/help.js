const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all the commands on Moderation Man!"),
  async execute(interaction) {
    await interaction.deferReply()
    var color_array = [
      "#1DA619",
      "#192CA6",
      "#D4E10F",
      "#D51616",
      "#D5A116",
      "#8716D5",
      "#00FFFB",
      "#8BFF8D",
      "7289DA"
    ]
    var random_color = color_array[Math.floor(Math.random() * color_array.length)]
    const help_embed = new MessageEmbed()
      .setColor(random_color)
      .setTitle(`${client.user.username} Commands!`)
      .setDescription(`Hello <@${interaction.user.id}>, here are all my commands!`)
    for(var [id, cmd] of client.commands) {
      help_embed.addField(`${cmd.data.name}`, `Description: ${cmd.data.description}\nUsage: \`/${cmd.data.name}\``, true)
    }
    var website_link = "https://Modetestion-Man.yoshiboi18303.repl.co"
    var support_link = "https://discord.gg/WVyUqBjVah"
    const link_row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setLabel("Website")
          .setURL(website_link),
        new MessageButton()
          .setStyle("LINK")
          .setLabel("Support Server")
          .setURL(support_link)
      )
    await interaction.editReply({ embeds: [help_embed], components: [link_row] })
  }
}