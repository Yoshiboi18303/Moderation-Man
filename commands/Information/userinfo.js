const { SlashCommandBuilder } = require("@discordjs/builders");
const { utc } = require("moment");
const { MessageEmbed, Permissions } = require("discord.js");
const Users = require("../../schemas/userSchema");
const { returnUserStatusText } = require("../../utils/");

const flags = {
  DISCORD_EMPLOYEE: "Discord Employee",
  DISCORD_PARTNER: "Discord Partner",
  BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
  BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
  HYPESQUAD_EVENTS: "HypeSquad Events",
  HOUSE_BRAVERY: "House of Bravery",
  HOUSE_BRILLIANCE: "House of Brilliance",
  HOUSE_BALANCE: "House of Balance",
  EARLY_SUPPORTER: "Early Supporter",
  TEAM_USER: "Team User",
  SYSTEM: "System",
  VERIFIED_BOT: "Verified Bot",
  VERIFIED_DEVELOPER: "Verified Bot Developer",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Shows info of a user (or yourself)!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Choose a user to look for")
        .setRequired(false)
    ),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    Users.findOne({ id: user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        data = new Users({ id: user.id });
        data.save();
        return await interaction.editReply({
          content: `I've made some data for ${user.username}, please execute the command again.`,
          ephemeral: true,
        });
      } else {
        function checkBot(u) {
          if (u.bot) return "Yes";
          else return "No";
        }

        function returnMessageCount() {
          var messages_sent = 0;
          for (var channel of interaction.guild.channels.cache.toJSON()) {
            if (channel.type == "GUILD_TEXT") {
              for (var message of channel.messages.cache.toJSON()) {
                if (message.author.id == interaction.user.id) {
                  messages_sent = messages_sent + 1;
                }
              }
            }
          }
          return messages_sent;
        }

        const roles = member.roles.cache
          .sort((a, b) => b.position - a.position)
          .map((role) => role.toString())
          .slice(0, -1);
        var role_array = [];
        member.roles.cache.forEach((r) => role_array.push(`<@&${r.id}>`));
        role_array.splice(member.roles.cache.size - 1, 1);
        const userFlags = user.flags.toArray();
        const userArray = [
          `**❯ Username:** ${user.username}`,
          `**❯ Discriminator:** ${user.discriminator}`,
          `**❯ Tag:** ${user.tag}`,
          `**❯ ID:** ${user.id}`,
          `**❯ Is Bot?** ${checkBot(user)}`,
          `**❯ Flags:** ${
            userFlags.length
              ? userFlags.map((flag) => flags[flag]).join(", ")
              : "None"
          }`,
          `**❯ Time Created:** ${utc(user.createdTimestamp).format(
            "LT"
          )} - ${utc(user.createdTimestamp).format("LL")} **|** ${utc(
            user.createdTimestamp
          ).fromNow()}`,
          `**❯ Commands Used:** ${data.commandsUsed}`,
          `\u200b`,
        ];
        const memberArray = [
          `**❯ Nickname:** ${
            member.nickname != null ? member.nickname : "None"
          }`,
          `**❯ Messages Sent (after last restart):** ${returnMessageCount()}`,
          `**❯ Roles (except everyone):** ${
            role_array.length > 1 ? role_array.join(", ") : "None"
          }`,
          `**❯ Highest Role:** ${
            member.roles.highest.id === interaction.guild.id
              ? "None"
              : member.roles.highest.name
          }`,
          `**❯ Joined Server On:** ${utc(member.joinedAt).format(
            "LL - LTS"
          )} **|** ${utc(member.joinedAt).fromNow()}`,
          `**❯ Hoisted Role:** ${
            member.roles.hoist ? member.roles.hoist.name : "No hoisted role"
          }`,
          `**❯ Status:** ${
            member.presence != null
              ? returnUserStatusText(member)
              : `${emojis.offline} **-** Offline`
          }`,
        ];
        const embed = new MessageEmbed()
          .setTitle(`Info on ${user.username}`)
          .setColor(member.displayHexColor || "BLUE")
          .addField("User", `${userArray.join("\n")}`)
          .addField("Member", `${memberArray.join("\n")}`);
        await interaction.followUp({
          embeds: [embed],
        });
      }
    });
  },
};
