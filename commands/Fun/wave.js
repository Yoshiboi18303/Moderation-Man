const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const key = process.env.FP_KEY;
const link = `https://gallery.fluxpoint.dev/api/album/57`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wave")
    .setDescription("Wave at someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to wave at")
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    /* if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId)}** for the moment!`, ephemeral: true }); */
    await interaction.deferReply();
    var user = interaction.options.getUser("user");
    const fetch = await import("node-fetch");
    var f = await fetch.default(link, {
      method: "GET",
      headers: {
        Authorization: key,
      },
    });
    var { file } = await f.json();
    /*
    console.log(data)
    await interaction.reply({ content: "Check the console!", ephemeral: true })
    */
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Hello!")
      .setDescription(
        `**${interaction.user.username}** waved at **${user.username}**. 👋`
      )
      .setImage(file)
      .setTimestamp();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
