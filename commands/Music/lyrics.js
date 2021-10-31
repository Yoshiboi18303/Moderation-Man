const {
  SlashCommandBuilder,
  hyperlink,
  hideLinkEmbed,
} = require("@discordjs/builders");
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
        .setDescription("Should the lyrics be cancerous?")
        .setRequired(false)
    ),
  async execute(interaction) {
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
      return await interaction.reply({
        content: `There were no lyrics found for **${song}**!`,
        ephemeral: true,
      });
    await interaction.deferReply();
    var lyrics_link = hyperlink("here", data.links.genius);
    lyrics_link = hideLinkEmbed(lyrics_link);
    if (data.lyrics > 2000)
      return await interaction.editReply({
        content: `The lyrics for **${song}** are too long to be shown on Discord, please go **${lyrics_link}** to see the full lyrics.`,
        ephemeral: true,
      });
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
