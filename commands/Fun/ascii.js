const { MessageEmbed } = require("discord.js");
const figlet = require("figlet");
const { promisify } = require("util");
const figletAsync = promisify(figlet);
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription("Shows your text in Ascii!")
    .addStringOption(option => option.setName('text').setDescription("Type in the text you want to be turned into Ascii (max characters: 20)!").setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text')

    const result = await figletAsync(text);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Ascii Text")
      .setDescription("```" + result + "```")
      .setTimestamp();

    if (text.length > 20)
      return await interaction.reply({ content: `Please make your text shorter! - The text limit is 20.`, ephemeral: true });

    await interaction.reply({
      embeds: [
        embed
      ]
    })
  }
}