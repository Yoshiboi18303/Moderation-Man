const { SlashCommandBuilder } = require("@discordjs/builders");
const { player } = require("../../voice_client/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the music!"),
  async execute(interaction) {
    var vc = interaction.member.voice.channel;
    var cvc = interaction.guild.me.voice.channel;

    if (!vc)
      return await interaction.reply({
        content: "Please join a Voice Channel!",
        ephemeral: true,
      });
    if (!cvc)
      return await interaction.reply({
        content: "I'm not in a Voice Channel!",
        ephemeral: true,
      });
    if (vc.id != cvc.id)
      return await interaction.reply({
        content: `You need to be in my Voice Channel (<#${cvc.id}>) to execute this command!`,
        ephemeral: true,
      });

    try {
      player.stop();
      await interaction.reply({
        content: "Successfully stopped the music!",
        ephemeral: true,
      });
    } catch (e) {
      await interaction.reply({
        content: "There's nothing playing!",
        ephemeral: true,
      });
    }
  },
};
