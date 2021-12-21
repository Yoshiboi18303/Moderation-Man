const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Roasting moment")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("A user to roast")
        .setRequired(false)
    ),
  config: {
    timeout: ms("5s"),
    message: "Please calm it down with the roasts.",
  },
  async execute(interaction) {
    // if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!` })
    var user = interaction.options.getUser("user") || interaction.user;
    const fetch = await import("node-fetch");
    if (user.id != interaction.user.id) {
      await interaction.deferReply();
    } else {
      await interaction.deferReply({ ephemeral: true });
    }
    const link = `https://weebyapi.xyz/json/roast?token=${process.env.WEEBY_KEY}`;
    var f = await fetch.default(link, {
      method: "GET",
    });
    var data = await f.json();
    await interaction.editReply({
      content: `**${user.tag}**, ${data.response}`,
    });
  },
};
