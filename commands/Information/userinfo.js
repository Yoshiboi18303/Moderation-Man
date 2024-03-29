const { SlashCommandBuilder } = require("@discordjs/builders");
const { utc } = require("moment");
const { MessageEmbed, Permissions, CommandInteraction } = require("discord.js");
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
        .setDescription("The user to reference")
        .setRequired(false)
    ),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  /**
   * @param {CommandInteraction} interaction
   */
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
        var is_admin = data.admin;
        var is_owner = data.owner;
        function checkBot(u) {
          if (u.bot) return "Yes";
          else return "No";
        }

        function returnMessageCount() {
          var messages_sent = 0;
          interaction.guild.channels.cache
            .filter((channel) => channel.type === "GUILD_TEXT")
            .forEach((channel) => {
              channel.messages.fetch().then((messages) => {
                messages.forEach((message) => {
                  if (message.author.id === user.id) {
                    messages_sent++;
                  }
                });
              });
            });
          return messages_sent;
        }

        const returnStaffEmotes = (action) => {
          if (action == "admin") {
            if (is_admin == true) {
              return `${emojis.admin} ||**Admin**||⠀`;
            } else return "⠀";
          } else if (action == "owner") {
            if (is_owner == true) {
              return `${emojis.owner} ||**Owner**||⠀`;
            } else return "⠀";
          }
        };

        const returnBughunterState = () => {
          var final = "";
          var level = data.bughunterlvl;
          switch (level) {
            case 0:
              final = "0 / None";
              break;
            case 1:
              final = `${emojis.bughunterlvl1} ||**Level 1**||`;
              break;
            case 2:
              final = `${emojis.bughunterlvl2} ||**Level 2**||`;
              break;
          }
          return final;
        };

        const returnBughunterEmoji = () => {
          var final = "";
          var level = data.bughunterlvl;
          switch (level) {
            case 0:
              final = final;
              break;
            case 1:
              final = `${emojis.bughunterlvl1}`;
              break;
            case 2:
              final = `${emojis.bughunterlvl2}`;
              break;
          }
          return final;
        };

        const returnIfSuggestionAccepted = () => {
          var final = "";
          var one_sug_accept = data.acceptedsuggestion;
          if (one_sug_accept || one_sug_accept == true) {
            final = `${emojis.suggestion} ||**Suggestor**||`;
          }
          return final;
        };

        const returnIfUserBlacklisted = () => {
          var final = "";
          if (data.blacklisted) final = "Yes";
          else final = "No";
          return final;
        };

        function returnIfWellKnownFriend() {
          var final = "";
          var wk_friend = data.wellknownfriend;
          if (wk_friend || wk_friend === true)
            final = `${emojis.wkfriend} ||**Well Known Friend To Developer**||`;
          return final;
        }

        const roles = member.roles.cache
          .sort((a, b) => b.position - a.position)
          .map((role) => role.toString())
          .slice(0, -1);
        var role_array = [];
        member.roles.cache.forEach((r) => role_array.push(`<@&${r.id}>`));
        role_array.splice(member.roles.cache.size - 1, 1);
        var t = `**❯ Roles${
          role_array.length > 15 ? " ||First 15||" : ""
        } (except everyone):**`;
        if (role_array.length > 15)
          role_array.splice(15, member.roles.cache.size - 15);
        const userFlags = user.flags.toArray();
        const userArray = [
          `**❯ Username:** ${user.username}`,
          `**❯ Discriminator:** ${user.discriminator}`,
          `**❯ Tag:** ${user.tag}`,
          `**❯ ID:** ${user.id}`,
          `**❯ Is Bot?** ${checkBot(user)}`,
          `**❯ Is Blacklisted?** ${returnIfUserBlacklisted()}`,
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
          `**❯ Bug Hunter Level:** ${returnBughunterState()}`,
          "\u200b",
        ];
        const memberArray = [
          `**❯ Nickname:** ${
            member.nickname != null ? member.nickname : "None"
          }`,
          `**❯ Messages Sent (all time in this guild):** ${returnMessageCount()}`,
          `${t} ${role_array.length > 1 ? role_array.join(", ") : "None"}`,
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
          "\u200b",
        ];
        const embed = new MessageEmbed()
          .setTitle(`Info on ${user.username}`)
          .setColor(member.displayHexColor || "BLUE")
          .addField("User", `${userArray.join("\n")}`)
          .addField("Member", `${memberArray.join("\n")}`)
          .addField(
            "Acknowledgements",
            `${returnStaffEmotes("admin")}${
              returnStaffEmotes("admin").includes(`${emojis.admin}`) &&
              returnStaffEmotes("owner").includes(`${emojis.owner}`)
                ? "\n"
                : ""
            }${returnStaffEmotes("owner")}${
              returnStaffEmotes("admin").includes(`${emojis.admin}`) &&
              returnStaffEmotes("owner").includes(`${emojis.owner}`)
                ? "\n"
                : ""
            }${
              data.foundbug == true
                ? `${returnBughunterEmoji()} ||**Bug Hunter**||`
                : ""
            }\n${
              returnIfSuggestionAccepted().includes(`${emojis.suggestion}`)
                ? `${returnIfSuggestionAccepted()}`
                : ""
            }\n${returnIfWellKnownFriend()}`
          );
        await interaction.followUp({
          embeds: [embed],
        });
      }
    });
  },
};
