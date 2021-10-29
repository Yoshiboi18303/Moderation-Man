const { MessageEmbed, Permissions } = require("discord.js");
const colors = require("../colors.json");
const log_id = "892607019138310205";
const guild_id = "892603177248096306";
const user_role_id = "892610872428613673";
const bot_role_id = "892611367461326859";

const Guilds = require("../schemas/guildSchema");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    if (member.guild.id == guild_id) {
      if (!member.user.bot) {
        var user = member.user;
        var guild = member.guild;
        var owner = client.users.cache.get(guild.ownerId);
        const new_user_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("New Member Joined!")
          .setDescription(
            `**${user.username}** joined **${guild.name}**, welcome to the server! 👋`
          );
        client.channels.cache.get(log_id).send({ embeds: [new_user_embed] });
        member.roles.add(user_role_id);
        user.send({
          content: `Welcome to **${
            guild.name
          }**, thanks so much for joining!\nThe current owner is **<@${
            guild.ownerId
          }>**, and they joined Discord on ${moment
            .utc(owner.createdTimestamp)
            .format("LL LTS")} which was ${moment
            .utc(owner.createdTimestamp)
            .fromNow()}!`,
        });
      } else {
        var user = member.user;
        var guild = member.guild;
        const new_bot_embed = new MessageEmbed()
          .setColor(colors.purple)
          .setTitle("New Bot Joined!")
          .setDescription(
            `**${user.username}** joined **${guild.name}**, welcome to the server! 👋`
          );
        client.channels.cache.get(log_id).send({ embeds: [new_bot_embed] });
        member.roles.add(bot_role_id);
      }
    }

    var guild = await Guilds.findOne({ id: member.guild.id });
    if (!guild)
      guild = new Guilds({
        id: member.guild.id,
      });

    if (guild.welcome !== "") {
      var channel;

      try {
        channel = await member.guild.channels.fetch(guild.welcome);
      } catch (err) {
        return console.error(err);
      }

      if (!channel) return;

      // This line isn't necessary, but it's not too bad to not include.
      if (!channel.isText() || channel.type !== "GUILD_TEXT") return;

      if (
        !member.guild.me
          .permissionsIn(channel)
          .has(Permissions.FLAGS.SEND_MESSAGES)
      )
        return;

      var embed = new MessageEmbed()
        .setTitle(`Welcome, __${member.user.username}__`)
        .setDescription(
          `Welcome to **${member.guild.name}**, **${member.displayName}**!`
        )
        .setThumbnail(
          member.user.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 512,
          })
        )
        .setTimestamp()
        .setColor(colors.green)
        .setFooter(`${member.user.displayName} joined`);

      channel.send({ embeds: [embed] });
    } else return;
  }, // inviteme back
};
