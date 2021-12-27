const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { utc } = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupstatsys")
    .setDescription("Setup the server stats"),
  config: {
    timeout: ms("2s"),
    message: "Slow it down with the command executing!",
  },
  async execute(interaction) {
    var guild = interaction.guild;
    if (guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
      });
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "You can't run this command!",
      });
    if (!guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "I need the `MANAGE_CHANNELS` permission!",
      });
    await interaction.deferReply();
    var category = await guild.channels.create(`📊 Stat Box 📊`, {
      type: "GUILD_CATEGORY",
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          allow: [Permissions.FLAGS.VIEW_CHANNEL],
          deny: [Permissions.FLAGS.CONNECT],
        },
        {
          id: guild.me.user.id,
          allow: [
            Permissions.FLAGS.VIEW_CHANNEL,
            Permissions.FLAGS.CONNECT,
            Permissions.FLAGS.MANAGE_CHANNELS,
          ],
        },
      ],
      position: 0,
    });
    await category.createChannel(`📅 ${utc(Date.now()).format("LL")}`, {
      type: "GUILD_VOICE",
    });
    await category.createChannel(`🕐 ${utc(Date.now()).format("LTS")} UTC`, {
      type: "GUILD_VOICE",
    });
    await category.createChannel(
      `🟢 ${
        guild.members.cache
          .filter((m) => !m.user.bot && m.presence != null)
          .filter((m) => m.presence.status == "online").size
      } ⛔ ${
        guild.members.cache
          .filter((m) => !m.user.bot && m.presence != null)
          .filter((m) => m.presence.status == "dnd").size
      } 🌙 ${
        guild.members.cache
          .filter((m) => !m.user.bot && m.presence != null)
          .filter((m) => m.presence.status == "idle").size
      }`,
      {
        type: "GUILD_VOICE",
      }
    );
    await category.createChannel(
      `Users: ${guild.members.cache.filter((m) => !m.user.bot).size}`,
      {
        type: "GUILD_VOICE",
      }
    );
    await category.createChannel(
      `Bots: ${guild.members.cache.filter((m) => m.user.bot).size}`,
      {
        type: "GUILD_VOICE",
      }
    );
    await category.createChannel(`Channels: ${guild.channels.cache.size}`, {
      type: "GUILD_VOICE",
    });
    await category.createChannel(`Roles: ${guild.roles.cache.size}`, {
      type: "GUILD_VOICE",
    });
    await interaction.editReply({
      content: "Stat system set up!",
    });
  },
};
