const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, version: djsversion } = require("discord.js");
const { version } = require("../../package.json");
const config = require("../../config.json");
const OS = require("os");

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
    const cpus = OS.cpus();
    const main_info_array = [
      `**Client Tag:** ${client.user.tag}`,
      `**Bot Version:** \`v${version}\``,
      `**Bot State:** ${state}`,
      `**Running on discord.js version:** ${djsversion}`,
      `**NodeJS Version:** ${process.version}`,
      `**Date Created:** ${moment
        .utc(client.user.createdTimestamp)
        .format("LL LTS AT")}`,
      `**Time Away from Creation:** ${moment
        .utc(client.user.createdTimestamp)
        .fromNow()}`,
      `**Guild Count:** ${client.guilds.cache.size}`,
      `**User Count:** ${client.users.cache.size}`,
      `**Command Count:** ${client.commands.size}`,
      `**Channel Count:** ${client.channels.cache.size}`,
      "\u200b",
    ];
    const system_info_array = [
      `**Platform:** ${process.platform}`,
      `**CPU Count:** ${cpus.length}`,
    ];
    const embed = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor || random_color)
      .setTitle(`Info on ${client.user.username}`)
      .setDescription(
        `Hello ${interaction.user.username}, thanks for calling upon this command! Here's some info on me!`
      )
      .addField("Main Information", `\n${main_info_array.join("\n")}`)
      .addField("System Information", `\n${system_info_array.join("\n")}`);
    await interaction.reply({ embeds: [embed] });
  },
};
