const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Makes the client disconnect from its Voice Channel"),
  async execute(interaction) {
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.CONNECT))
      return await interaction.reply({
        content: "I don't have the `CONNECT` permission in this server!",
        ephemeral: true,
      });
    var vc = interaction.member.voice.channel;
    var cv = interaction.guild.me.voice;
    var cvc = interaction.guild.me.voice.channel;

    if (!vc)
      return await interaction.reply({
        content: "Please join a Voice Channel!",
        ephemeral: true,
      });
    if (!cvc)
      return await interaction.reply({
        content: "I'm not connected to a Voice Channel!",
        ephemeral: true,
      });
    if (vc.id != cvc.id)
      return await interaction.reply({
        content:
          "You need to be connected to my Voice Channel to execute this command!",
        ephemeral: true,
      });

    await interaction.reply({
      content: `Successfully disconnected from **${cvc.name}** (<#${cvc.id}>)!`,
      ephemeral: true,
    });
    await cv.disconnect();
  },
};
