const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const link = `https://weebyapi.xyz/gif/punch?token=${process.env.WEEBY_KEY}`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("punch")
    .setDescription("Punch someone lmao")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to punch")
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    /* if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment.`, ephemeral: true }); */
    var user = interaction.options.getUser("user");
    const fetch = await import("node-fetch");
    await interaction.deferReply();
    var img_fetch = await fetch.default(link, {
      method: "GET",
    });
    const data = await img_fetch.json();
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Punchy Punch")
      .setDescription(
        `**${interaction.user.username}** punched **${user.username}** hard.`
      )
      .setImage(data.url)
      .setTimestamp();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
