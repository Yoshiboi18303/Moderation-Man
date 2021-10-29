const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Makes the client join your Voice Channel!"),
  async execute(interaction) {
    var vc = interaction.member.voice.channel;
    if (!vc)
      return await interaction.reply({
        content: "Please join a Voice Channel!",
        ephemeral: true,
      });
    joinVoiceChannel({
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
