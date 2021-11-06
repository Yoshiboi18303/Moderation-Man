const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guilds")
    .setDescription("Shows the guilds the client is in"),
  async execute(interaction) {
    if(!admins.includes(interaction.user.id)) return await interaction.reply({ content: "This command is restricted to admins only!", ephemeral: true });
    var guilds = [];
    for(var guild of client.guilds.cache.toJSON()) {
      guilds.push(guild.name)
    };
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Guilds for ${client.user.username}`)
      .setDescription(`Here are all the guilds I am in.\n\n${guilds.join(", ")}`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}