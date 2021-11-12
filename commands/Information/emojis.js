const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojis")
    .setDescription("Shows the emojis in your guild"),
  async execute(interaction) {
    await interaction.deferReply();
    var guild = interaction.guild;
    const emojis_embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Emojis in ${guild.name}`);
    for (const emoji of guild.emojis.cache.toJSON()) {
      const emoji_tag = emoji.animated
        ? `<a:${emoji.name}:${emoji.id}>`
        : `<:${emoji.name}:${emoji.id}>`;
      emojis_embed.addField(
        `${emoji.name}`,
        `${emoji_tag}\n\`${emoji_tag}\`\nAdded by **${
          emoji.author != null ? emoji.author.username : "No one"
        }**`,
        true
      );
    }
    await interaction.editReply({
      embeds: [emojis_embed],
    });
  },
};
