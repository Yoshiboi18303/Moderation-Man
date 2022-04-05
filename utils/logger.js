const mongoose = require("mongoose");

const Guilds = require("../schemas/guildSchema");

const { Client, Guild, MessageEmbed, GuildMember } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Guild} guild
 * @param {Number} action
 * @param {Object} data
 * @param {GuildMember} data.member
 * @param {String} data.reason
 * @param {GuildMember} data.moderator
 * @param {String} data.message
 */
module.exports = async (client, guild, action, data) => {
  var Guild = await Guilds.findOne({ id: guild.id });

  // var channel = guild.channels.cache.get(Guild.channels.modlog);

  const em = new MessageEmbed()
    .setTitle(`${bot.user.username} Logger`)
    .setAuthor(
      `${bot.user.username}`,
      bot.user.avatarURL().replace("webp", "png")
    )
    .setTimestamp();

  switch (action) {
    case Enum.Log.Info:
      em.setDescription(
        `A message from the developer has been sent to **${guild.name}**.`
      )
        .addField(`Message`, `**${data.message}**`)
        .setColor(colors.blue);
      break;

    case Enum.Log.Error:
      em.setDescription(
        `An error has occurred while using ${
          client.ready ? client.user.username : "Moderation Man"
        } in **${guild.name}**.`
      )
        .addField(`Error`, `**${data.message}**`)
        .setColor(colors.dred);
      break;

    case Enum.Log.Kick:
      em.setDescription(`A member has been kicked from **${guild.name}**.`)
        .addField(`Member Kicked`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.yellow);
      break;

    case Enum.Log.Ban:
      em.setDescription(`A member has been banned from **${guild.name}**.`)
        .addField(`Member Banned`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.red);
      break;

    case Enum.Log.Mute:
      em.setDescription(`A member has been muted in **${guild.name}**.`)
        .addField(`Member Muted`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.navy);
      break;

    case Enum.Log.Softban:
      em.setDescription(`A member has been softbanned from **${guild.name}**.`)
        .addField(`Member Softbanned`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.red);
      break;

    case Enum.Log.Tempban:
      em.setDescription(`A member has been tempbanned from **${guild.name}**.`)
        .addField(`Member Tempbanned`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.red);
      break;
  }

  var channel = client.channels.cache.get("904421522205204531");

  if (!channel) channel = guild.systemChannel;

  if (!channel)
    channel = guild.channels.cache
      .filter(
        (c) =>
          c.type == "GUILD_TEXT" &&
          c.permissionsFor(guild.me).has(["SEND_MESSAGES"])
      )
      .first();

  channel?.send({
    embeds: [em],
  });
};
