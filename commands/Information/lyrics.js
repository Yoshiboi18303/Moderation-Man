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
    ),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    /* if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: "This command is being testing, please wait until it's back up." }) */
    await interaction.deferReply();
    const fetch = await import("node-fetch");
    var song = interaction.options.getString("song");
    var link = `https://weebyapi.xyz/json/lyrics?query=${song}&token=${process.env.WEEBY_KEY}`;
    var f = await fetch.default(link, {
      method: "GET",
    });
    var data = await f.json();
    // console.log(data)
    if (data.status != 200) {
      const error_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Error")
        .setDescription(`\`${data.status}\` **-** "${data.message}"`)
        .setTimestamp();
      return await interaction.editReply({
        embeds: [error_embed],
      });
    }
    if (data.lyrics.length > 4096) {
      const too_long_embed = new MessageEmbed()
        .setColor(colors.orange)
        .setTitle("Lyrics too long")
        .setDescription(
          `The lyrics for **${data.track.name}** are too long to be shown on Discord, please go [here](${data.url}) to see the full lyrics.`
        );
      return await interaction.editReply({
        embeds: [too_long_embed],
        ephemeral: true,
      });
    }
    const lyrics_embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor({
        name: `${data.artist.name}`,
        iconURL: `${data.artist.thumbnail}`,
      })
      .setTitle(`Lyrics of __${data.track.name}__`)
      .setDescription(`${data.lyrics}`)
      .setThumbnail(data.track.thumbnail)
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
