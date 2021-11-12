const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const voice = require("../../items/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Makes the client join your Voice Channel"),
  async execute(interaction) {
    if (interaction.guild.id != "908319885736677386") return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.CONNECT))
      return await interaction.reply({
        content: "I don't have the `CONNECT` permission in this server!",
        ephemeral: true,
      });
    var vc = interaction.member.voice.channel
    if (!vc) {
      const no_vc_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Error")
        .setDescription(`${emojis.nope} **-** You need to be in a Voice Channel!`)
      return await interaction.reply({ embeds: [no_vc_embed] })
    }
    const player = voice.players.get(interaction.guild.id)
    await player.join(vc.id)
  },
};
