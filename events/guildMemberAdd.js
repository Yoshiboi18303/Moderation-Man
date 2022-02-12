const { MessageEmbed, Permissions, MessageAttachment, GuildMember } = require("discord.js");
const colors = require("../colors.json");
const log_id = "892607019138310205";
const guild_id = "892603177248096306";
const user_role_id = "892610872428613673";
const bot_role_id = "892611367461326859";
const attempt_max = 10;
const BotError = require("../items/classes/BotError");
const Canvas = require("canvas");

const Guilds = require("../schemas/guildSchema");
const { applyText } = require("../utils/");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   */
  async execute(member) {
    var guild = Guilds.findOne({ id: member.guild.id });

    const fetch = await import("node-fetch");
    var f = await fetch.default("https://captcha.dogemod.ml/generate", {
      method: "GET",
    });
    var data = await f.json();
    try {
      const canvas = Canvas.createCanvas(700, 250)
      var ctx = canvas.getContext("2d")
      var background = await Canvas.loadImage(process.env.WELCOME_IMAGE_URL)
      var avatar = await Canvas.loadImage(member.user.displayAvatarURL({ dynamic: true, format: "jpg" }))
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "#002e62"
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(avatar, 25, 25, 200, 200)
      ctx.beginPath()
      ctx.arc(125, 125, 100, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.font = "28px sans-serif"
      ctx.fillStyle = colors.cyan
      ctx.fillText("Welcome", canvas.width / 2.5, canvas.height / 3.5)
      ctx.font = applyText(canvas, `${member.displayName}!`)
      ctx.fillStyle = "#ffffff"
      ctx.fillText(`${member.displayName}!`, 700 / 2.5, 250 / 1.8)
      /* Testing Purposes */ if (member.guild.id == guild_id) {
        var attachment = new MessageAttachment(canvas.toBuffer(), "welcome.png")
        if (!member.user.bot) {
          var user = member.user;
          var guild = member.guild;
          var owner = client.users.cache.get(guild.ownerId);
          const new_user_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("New Member Joined!")
            .setDescription(
              `**${user.username}** joined **${guild.name}**, welcome to the server! 👋`
            )
            .setImage("attachment://welcome.png");
          client.channels.cache.get(log_id).send({ embeds: [new_user_embed], files: [attachment] });
          const captcha_embed = new MessageEmbed()
            .setColor(colors.yellow)
            .setTitle("__Verification__")
            .setDescription(
              `Please enter the code in the following image (case-sensitive).`
            )
            .setImage(data.path)
            .setFooter(`${member.guild.name} Captcha Verification`)
            .setTimestamp();
          // member.roles.add(user_role_id);
          let attempts = 0;
          user
            .send({
              content: `Welcome to **${
                guild.name
              }**, thanks so much for joining!\nThe current owner is **<@${
                guild.ownerId
              }> (${owner.tag})**, and they joined Discord on ${moment
                .utc(owner.createdTimestamp)
                .format("LL LTS")} which was ${moment
                .utc(owner.createdTimestamp)
                .fromNow()}!\n\n**You now need to verify yourself before being able to talk in __${
                member.guild.name
              }__, please look at the following embed.**`,
              embeds: [captcha_embed],
            })
            .then(() => {
              bot.on("messageCreate", async (message) => {
                if (member.user.id == message.author.id && !message.guild) {
                  if (message.content.includes(data.code)) {
                    user
                      .send({
                        content: `Correct code! You are now verified in **${member.guild.name}**!`,
                      })
                      .then(() => {
                        member.roles.add(
                          /* member.guild.roles.cache.find(r => r.name == "Verified" || r.id == guild.verified) */ member.guild.roles.cache.get(
                            user_role_id
                          )
                        );
                      });
                  } else {
                    var new_attempts = attempt_max - attempts;
                    user.send({
                      content: `Incorrect code, please look more carefully.\n\n**You have ${new_attempts} ${
                        new_attempts < 2 && new_attempts != 0
                          ? "attempt"
                          : "attempts"
                      } left.**\n\n**Tip: The code is case-sensitive, please look REALLY carefully at the image.**`,
                    });
                    if (attempts >= 10) {
                      const failure_embed = new MessageEmbed()
                        .setColor(colors.red)
                        .setTitle("Verification Failure...")
                        .setDescription(
                          `I have failed to verify you due to "Too many incorrect answers!", you have been kicked from **${member.guild.name}**!`
                        );
                      await user.send({
                        embeds: [failure_embed],
                      });
                      attempts = 0;
                      return member.kick({
                        reason:
                          "Too many incorrect attempts on Captcha Verification!",
                      });
                    } else {
                      attempts = attempts + 1;
                    }
                  }
                }
              });
            })
            .catch((e) => console.error(e));
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

        channel = await member.guild.channels.fetch(guild.welcome);

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
    } catch (e) {
      return new BotError(
        "An error occurred while working the guildMemberAdd event...",
        e,
        false
      );
    }
  }, // inviteme back
};
