const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, version: djsversion } = require("discord.js");
const { version } = require("../../package.json");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Shows some info on the client!"),
  async execute(interaction) {
    const fetch = await import("node-fetch");
    var color_array = [
      "#1DA619",
      "#192CA6",
      "#D4E10F",
      "#D51616",
      "#D5A116",
      "#8716D5",
      "#00FFFB",
      "#8BFF8D",
      "#7289DA",
    ];
    var random_color =
      color_array[Math.floor(Math.random() * color_array.length)];
    var state = config.bot.state.replace("::", "-");
    const embed = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor || random_color)
      .setTitle(`Info on ${client.user.username}`)
      .setDescription(
        `Hello ${interaction.user.username}, thanks for calling upon this command! Here's some info on me!`
      )
      .addFields([
        {
          name: "Client Tag",
          value: `${client.user.tag}`,
          inline: true,
        },
        {
          name: "Bot Version",
          value: `v${version}`,
          inline: true,
        },
        {
          name: "Bot State",
          value: `${state}`,
          inline: true,
        },
        {
          name: "Running on discord.js version:",
          value: `${djsversion}`,
          inline: true,
        },
        {
          name: "NodeJS Version",
          value: `${process.version}`,
          inline: true,
        },
        {
          name: "Date Created",
          value: `${moment
            .utc(client.user.createdTimestamp)
            .format("LL LTS AT")}`,
          inline: true,
        },
        {
          name: "Time Away from Creation",
          value: `${moment.utc(client.user.createdTimestamp).fromNow()}`,
          inline: true,
        },
        {
          name: "Guild Count",
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: "User Count",
          value: `${client.users.cache.size}`,
          inline: true,
        },
        {
          name: "Command Count",
          value: `${client.commands.size}`,
          inline: true,
        },
        {
          name: "Channel Count",
          value: `${client.channels.cache.size}`,
          inline: true,
        },
      ]);
    await interaction.reply({ embeds: [embed] });
  },
};
