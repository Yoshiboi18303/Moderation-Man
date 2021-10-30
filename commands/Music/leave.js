const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Makes the client leave your Voice Channel!"),
  async execute(interaction) {
    var cvc = interaction.guild.me.voice.channel;
    var cv = interaction.guild.me.voice;
    if (!cvc)
      return await interaction.reply({
        content: "I'm not connected to a Voice Channel!",
        ephemeral: true,
      });
    await interaction.reply({
      content: `Successfully disconnected from **${cvc.name}** (<#${cvc.id}>)!`,
      ephemeral: true,
    });
    await cv.disconnect();
  },
};
