const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojis")
    .setDescription(
      "Shows the emojis in your guild (you'll need the MANAGE_EMOJIS_AND_STICKERS permission to run this)"
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS
      )
    ) {
      const bad_permissions_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Error")
        .setDescription(
          `${emojis.nope} **-** You don't have the \`MANAGE_EMOJIS_AND_STICKERS\` permission!`
        );
      return await interaction.reply({
        embeds: [bad_permissions_embed],
        ephemeral: true,
      });
    }
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
