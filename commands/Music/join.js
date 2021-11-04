const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require("@discordjs/voice");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Makes the client join your Voice Channel"),
  async execute(interaction) {
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.CONNECT))
      return await interaction.reply({
        content: "I don't have the `CONNECT` permission in this server!",
        ephemeral: true,
      });
    var vc = interaction.member.voice.channel;
    if (!vc)
      return await interaction.reply({
        content: "Please join a Voice Channel!",
        ephemeral: true,
      });
    await joinVoiceChannel({
      channelId: vc.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    await interaction.reply({
      content: `Joined **${vc.name}** (<#${vc.id}>)!`,
      ephemeral: true,
    });
  },
};
