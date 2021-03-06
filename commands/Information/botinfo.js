const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, version: djsversion } = require("discord.js");
const { version } = require("../../package.json");
const config = require("../../config.json");
const OS = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Shows some info on the client!")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of info you want to see")
        .setRequired(false)
        .addChoice("main", "main")
        .addChoice("partners", "partners")
    ),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    const type = interaction.options.getString("type") || "main";
    var color = "";
    if (interaction.guild.me.displayHexColor === "#000000")
      color = color_array[Math.floor(Math.random() * color_array.length)];
    else color = interaction.guild.me.displayHexColor;
    switch (type) {
      case "main":
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
          `**Last Ready On:** ${moment
            .utc(client.readyAt)
            .format("LL LTS AT")} ||(${moment
            .utc(client.readyAt)
            .fromNow()})||`,
          "\u200b",
        ];
        const system_info_array = [
          `**Platform:** ${process.platform}`,
          `**CPU Count:** ${cpus.length}`,
        ];
        const embed = new MessageEmbed()
          .setColor(color)
          .setTitle(`Info on ${client.user.username}`)
          .setDescription(
            `Hello ${interaction.user.username}, thanks for calling upon this command! Here's some info on me!`
          )
          .addField("Main Information", `\n${main_info_array.join("\n")}`)
          .addField("System Information", `\n${system_info_array.join("\n")}`);
        await interaction.reply({ embeds: [embed] });
        break;
      case "partners":
        const map = partners.map(
          (partner) =>
            `**${partner.name}** \`=>\` Type: ${partner.type}, [${
              partner.type.includes("Server") ? "Join" : "Invite"
            } ${partner.name}](${partner.invite}), Owned by: \`${
              client.users.cache.get(partner.owner).username
            }\``
        );
        const partners_embed = new MessageEmbed()
          .setColor(color)
          .setTitle(`${client.user.username} Partners!`)
          .setDescription(`${map.join(",\n")}`);
        await interaction.reply({
          embeds: [partners_embed],
        });
        break;
    }
  },
};
