const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stickers")
    .setDescription(
      "Shows the stickers in your guild (you'll need the MANAGE_EMOJIS_AND_STICKERS permission to run this)"
    ),
  config: {
    timeout: ms("10s"),
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
        )
        .setTimestamp();
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
    guild.stickers.fetch().then(async (data) => {
      if (data.size === 0) {
        const no_stickers_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(`There are no stickers in **__${guild.name}__**!`)
          .setTimestamp();
        return await interaction.editReply({
          embeds: [no_stickers_embed],
        });
      }
      var frmt = "";
      var sticker_map = data.map(
        (sticker) =>
          `**${sticker.name}** => URL: \`${sticker.url}\`, Format Type: ${
            sticker.format == "PNG"
              ? "PNG"
              : sticker.format == "APNG"
              ? "Animated PNG"
              : "Lottie (JSON)"
          }, Tags: \`${sticker.tags.join(", ")}\``
      );
      const stickers_embed = new MessageEmbed()
        .setColor(interaction.member.displayHexColor)
        .setTitle(`Stickers in __${guild.name}__`)
        .setDescription(`${sticker_map.join(",\n")}`)
        .setThumbnail(`${data.first()?.url}`)
        .setTimestamp();
      await interaction.editReply({
        embeds: [stickers_embed],
      });
    });
  },
};
