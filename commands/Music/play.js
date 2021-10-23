const { createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { player } = require('../../voice_client/player');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;
const fs = require('fs');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song in the current VC")
    .addStringOption(option => option.setName("link").setDescription("The link to the song").setRequired(true))
    .addStringOption(option => option.setName("source").setDescription("The source of the song | default: youtube").setRequired(false).addChoice("youtube", "YT").addChoice("soundcloud", "SC")),
  async execute(interaction) {
    // return await interaction.reply({ content: "Coming Soon!", ephemeral: true })
    var link = interaction.options.getString("link")
    var source = interaction.options.getString("source") || "YT"
    var vc = interaction.member.voice.channel
    var cvc = interaction.guild.me.voice.channel
    if(!vc) return await interaction.reply({ content: "Please join a Voice Channel!", ephemeral: true })
    var VoiceConnection;
    if(cvc) {
      if(source == "YT") {
        if(!link.startsWith("https://")) return await interaction.reply({ content: 'Invalid Link for source: YouTube', ephemeral: true })
        var souce = await ytdl(link)
        const resource = await createAudioResource(souce, {
          inlineVolume: true
        })
        resource.volume.setVolume(0.8)
        player.play(resource)
        player.on('idle', () => {
          try {
            player.stop()
            VoiceConnection.destroy()
          } catch(e) {
            console.error(e)
          }
        })
      } else if(source == "SC") {}
    } else {
      await interaction.reply({ content: `I'm not in your VC, joining now...`, ephemeral: true })
      await wait(2500)
      VoiceConnection = await joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator
      })
      await interaction.editReply({ content: `Joined ${vc}!`, ephemeral: true })
      /*
      if(source == "YT") {
        if(!link.startsWith("https://")) return await interaction.reply({ content: 'Invalid Link for source: YouTube', ephemeral: true })
        var souce = await ytdl(link)
        const resource = await createAudioResource(souce, {
          inlineVolume: true
        })
        VoiceConnection.subscribe(player)
        resource.volume.setVolume(0.8)
        player.play(resource)
        // await interaction.reply()
        player.on('idle', () => {
          try {
            player.stop()
            VoiceConnection.destroy()
          } catch(e) {
            console.error(e)
          }
        })
      } else if(source == "SC") {}
      */
    }
  }
}