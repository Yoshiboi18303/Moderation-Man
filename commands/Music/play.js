const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { joinVoiceChannel, createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const { player } = require("../../voice_client/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from YouTube!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("The YouTube link to search for")
        .setRequired(true)
    ),
  async execute(interaction) {
    return await interaction.reply({
      content: "This command is broken for right now, this will be fixed soon.",
      ephemeral: true,
    });
    var link = interaction.options.getString("link");
    // if(!link.includes("https://www.youtube.com") || !link.includes("youtu.be")) return await interaction.reply({ content: "Invalid YouTube Link.", ephemeral: true })
    var cvc = interaction.guild.me.voice.channel;
    var cv = interaction.guild.me.voice;
    var vc = interaction.member.voice.channel;
    if (!vc)
      return await interaction.reply({
        content: "Please join a Voice Channel!",
      });
    if (!cvc)
      return await interaction.reply({
        content:
          "I'm not connected to a Voice Channel, please connect me to one by running `/join`!",
        ephemeral: true,
      });
    if (vc.id != cvc.id)
      return await interaction.reply({
        content: "You need to be in my Voice Channel to execute this command!",
        ephemeral: true,
      });
    var yt = await ytdl(link);
    var resource = await createAudioResource(yt, {
      inlineVolume: true,
    });
    resource.volume.setVolume(0.6);
    var VoiceConnection = joinVoiceChannel({
      channelId: vc.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    VoiceConnection.subscribe(player);
    player.play(resource);
    await interaction.reply({ content: "Now playing music!" });
  },
};
