const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const key = process.env.FP_KEY;
const link = "https://gallery.fluxpoint.dev/api/album/30"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone for being an idiot")
    .addUserOption((option) => option.setName("user").setDescription("The user to slap").setRequired(true)),
  async execute(interaction) {
    /* if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment.`, ephemeral: true }); */
    var user = interaction.options.getUser("user")
    const fetch = await import("node-fetch");
    await interaction.deferReply()
    var img_fetch = await fetch.default(link, {
      method: "GET",
      headers: {
        Authorization: key
      }
    })
    const { file } = await img_fetch.json();
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Slappy Slap")
      .setDescription(`**${interaction.user.username}** slapped **${user.username}** hard. Ouch.`)
      .setImage(file)
      .setTimestamp()
    await interaction.editReply({
      embeds: [embed]
    })
  }
}