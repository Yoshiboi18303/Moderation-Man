const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Find the lyrics of a certain song!")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The song to search for")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("enable_cancer")
        .setDescription("Should the lyrics be cancerous? (default: false)")
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const fetch = await import("node-fetch");
    var song = interaction.options.getString("song");
    var lyrics_are_cancerous =
      interaction.options.getBoolean("enable_cancer") || false;
    var link = `https://some-random-api.ml/lyrics?title=${song}&cancer=${lyrics_are_cancerous}`;
    var f = await fetch.default(link, {
      method: "GET",
    });
    var data = await f.json();
    if (data.error)
      return await interaction.editReply({
        content: `There were no lyrics found for **${song}**!`,
        ephemeral: true,
      });
    if (data.lyrics.length > 2000) {
      const too_long_embed = new MessageEmbed()
        .setColor(colors.orange)
        .setTitle("Lyrics too long")
        .setDescription(
          `The lyrics for **${
            data.title
          }** (with cancerous being \`${lyrics_are_cancerous}\`) are too long to be shown on Discord, please go [here](${
            data.links.genius
          }) to see the full lyrics ${
            lyrics_are_cancerous == true ? `(without the cancerous lyrics)` : ""
          }.`
        );
      return await interaction.editReply({
        embeds: [too_long_embed],
        ephemeral: true,
      });
    }
    const lyrics_embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${data.author}`)
      .setTitle(`Lyrics of ${data.title}`)
      .setDescription(`${data.lyrics}`)
      .setThumbnail(data.thumbnail.genius)
      .setFooter(
        `${interaction.user.username} requested this`,
        interaction.user.displayAvatarURL({
          dynamic: false,
          format: "png",
          size: 32,
        })
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [lyrics_embed] });
  },
};
