const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("links")
    .setDescription("Shows some useful links for stuff according to the bot"),
  config: {
    timeout: ms("5s"),
    message: "Please don't spam these links...",
  },
  async execute(interaction) {
    var color = "";
    if (interaction.guild.me.displayHexColor == "#000000") color = "BLURPLE";
    else color = interaction.guild.me.displayHexColor;
    const links_embed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Links for ${client.user.username}`)
      .setDescription(
        `Hello ${interaction.user.username}, here are some useful links!`
      )
      .addFields([
        {
          name: "Support Server",
          value: "[Click Me!](https://discord.gg/nv4pyCXBnr)",
          inline: true,
        },
        {
          name: "GitHub Repository",
          value: "[Click Me!](https://github.com/Yoshiboi18303/Moderation-Man)",
          inline: true,
        },
        {
          name: "Top.gg Voting Page",
          value: "[Click Me!](https://top.gg/bot/891070722074611742/vote)",
          inline: true,
        },
      ]);
    await interaction.reply({
      embeds: [links_embed],
    });
  },
};
