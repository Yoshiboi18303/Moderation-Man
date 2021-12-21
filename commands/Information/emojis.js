const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojis")
    .setDescription(
      "Shows the emojis in your guild (you'll need the MANAGE_EMOJIS_AND_STICKERS permission to run this)"
    ),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS
      ) &&
      interaction.user.id != config.bot.owner
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
    if (interaction.user.id === config.bot.owner) {
      await interaction.deferReply({ ephemeral: true });
    } else {
      await interaction.deferReply();
    }
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
        `${emoji_tag}\n\`${emoji_tag}\``,
        true
      );
    }
    await interaction.editReply({
      embeds: [emojis_embed],
    });
  },
};
