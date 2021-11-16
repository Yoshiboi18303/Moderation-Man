const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { utc } = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("View info on the current guild"),
  async execute(interaction) {
    // if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
    var guild = interaction.guild;
    var member = interaction.member;

    if (!guild.available)
      return await interaction.reply({
        content:
          "The Discord servers are down, so I can't access the info of this guild.",
        ephemeral: true,
      });

    await interaction.deferReply();

    var color;

    if (member.displayHexColor == "#000000") color = "RANDOM";
    else color = member.displayHexColor;

    const serverinfo_embed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Info on ${guild.name}`)
      .addFields([
        {
          name: "AFK Channel",
          value: `${guild.afkChannel != null ? guild.afkChannel : "None"}`,
          inline: true,
        },
        {
          name: "AFK Timeout",
          value: `${guild.afkTimeout}ms`,
          inline: true,
        },
        {
          name: "Ban Count",
          value: `${guild.bans.cache.size}`,
          inline: true,
        },
        {
          name: "Channel Count",
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        {
          name: "Created On",
          value: `${utc(guild.createdTimestamp).format("LL - LTS")}`,
          inline: true,
        },
        {
          name: "Time Away from Creation",
          value: `${utc(guild.createdTimestamp).fromNow()}`,
          inline: true,
        },
        {
          name: "Member Count",
          value: `${guild.members.cache.size}`,
          inline: true,
        },
        {
          name: "Owner",
          value: `${client.users.cache.get(guild.ownerId).username}`,
          inline: true,
        },
      ]);
    await interaction.editReply({
      embeds: [serverinfo_embed],
    });
  },
};
