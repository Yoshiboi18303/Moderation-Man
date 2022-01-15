const { MessageEmbed, Permissions } = require("discord.js");
const commandFolder = fs.readdirSync("commands/");
const { prefix } = require("../config.json").bot;
const AFKUsers = require("../schemas/afkSchema");
const wait = require("util").promisify(setTimeout);
const CountingSystem = require("../schemas/countSysSchema");
const Guilds = require("../schemas/guildSchema");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (!message.author.bot && message.guild) {
      AFKUsers.findOne(
        {
          user: message.author.id,
        },
        async (err, data) => {
          if (err) throw err;
          if (!data) {
            return;
          } else {
            if (data.message != "" && message.author.id === data.user) {
              const wb_embed = new MessageEmbed()
                .setColor(colors.blue)
                .setTitle("Welcome Back!")
                .setDescription(
                  `Hello and welcome back <@${message.author.id}>, I have removed your AFK.`
                )
                .setTimestamp();
              data = await AFKUsers.findOneAndUpdate(
                {
                  user: message.author.id,
                },
                {
                  message: "",
                }
              );
              data.save();
              if (
                message.guild.me
                  .permissionsIn(message.channel)
                  .has([
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                  ])
              ) {
                var msg = await message.reply({
                  embeds: [wb_embed],
                });
                wait(15000).then(async () => await msg.delete());
              }
            }
          }
        }
      );
      Guilds.findOne({ id: message.guild.id }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          data = new Guilds({
            id: message.guild.id,
          });
          data.save();
        } else {
          if (message.channel.id === data.suggestionChannel) {
            await message.react("✅");
            await message.react("❌");
          }
        }
      });
      var someone = message.content.includes("@someone");
      var date = new Date(Date.now());
      // console.log(date, date.getMonth(), date.getDate())
      var is1st = date.getMonth() == 3 && date.getDate() == 1;
      if (someone && is1st) {
        var ids = Array.from(message.guild.members.cache.keys());
        message.channel.send({
          content: `<@${ids[Math.floor(Math.random() * ids.length)]}>`,
        });
      }
    }
    var number_content = parseInt(message.content);
    if (
      !message.author.bot &&
      !message.channel.type == "DM" &&
      message.mentions.members.first() === message.guild.me
    ) {
      const embed = new MessageEmbed()
        .setColor(colors.yellow)
        .setTitle(`Welcome to ${client.user.username}!`)
        .setDescription(
          `Hello ${message.author.username}, I see you have mentioned me.\nAre you lost? Check all my commands by starting with \`/help\`!`
        );
      await message.reply({ embeds: [embed] });
    } else if (
      message.channel.type != "DM" &&
      message.mentions.members.first() &&
      message.mentions.members
    ) {
      var members = message.mentions.members;
      members.forEach((member) => {
        AFKUsers.findOne(
          {
            user: member.user.id,
          },
          async (err, data) => {
            if (err) throw err;
            if (!data) {
              return;
            } else {
              if (data.message != "" && data.user != message.author.id) {
                const user_is_afk_embed = new MessageEmbed()
                  .setColor(colors.yellow)
                  .setTitle("User Is AFK")
                  .setDescription(
                    `<@${data.user}> is currently AFK for "**${data.message}**"`
                  )
                  .setTimestamp();
                if (
                  message.guild.me
                    .permissionsIn(message.channel)
                    .has([
                      Permissions.FLAGS.VIEW_CHANNEL,
                      Permissions.FLAGS.SEND_MESSAGES,
                    ])
                ) {
                  await message.reply({
                    embeds: [user_is_afk_embed],
                  });
                }
              }
            }
          }
        );
      });
    } else if (
      !message.author.bot &&
      message.channel.type != "DM" &&
      !isNaN(number_content)
    ) {
      // if(message.guild.id !== config.bot.testServerId) return;
      CountingSystem.findOne({ guild: message.guild.id }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          return;
        } else {
          var string_days_old = moment
            .utc(message.author.createdTimestamp)
            .fromNow();
          var number_days_old = await parseInt(string_days_old[0]);
          if (message.channel.id != data.channel) return;
          // if(number_days_old < 7) return await message.reply({ content: "Sorry, your account needs to be at least 7 days old to participate in this system." })
          if (
            number_content === data.nextNumber &&
            message.author.id != data.lastNumUser
          ) {
            await message.react("<a:done:906374464571330688>");
            data = await CountingSystem.findOneAndUpdate(
              {
                guild: message.guild.id,
              },
              {
                $inc: {
                  currentNumber: 1,
                  nextNumber: 1,
                },
                $set: {
                  lastNumUser: message.author.id,
                },
              }
            );
            data.save();
          } else {
            var failure_reason = "";
            if (number_content != data.nextNumber) {
              failure_reason = `The next number was supposed to be ${data.nextNumber}, but you put ${number_content} instead!`;
            } else if (message.author.id == data.lastNumUser) {
              failure_reason = `One user can't enter in 2 numbers at once!`;
            }
            const ruined_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("You ruined it!")
              .setDescription(
                `<@${message.author.id}>, you ruined the streak at **${data.currentNumber}**!\n\nReason for the ruined streak: **${failure_reason}**\n\n-----\n\nTake it from the top!`
              )
              .setTimestamp();
            data = await CountingSystem.findOneAndUpdate(
              {
                guild: message.guild.id,
              },
              {
                $set: {
                  currentNumber: 0,
                  nextNumber: 1,
                  lastNumUser: "",
                },
              }
            );
            data.save();
            await message.react("<a:nope:906374698504421457>");
            return await message.reply({
              embeds: [ruined_embed],
            });
          }
        }
      });
    }
    /*
    for(const [id, cmd] of client.commands) {
      if(message.content == `${prefix}${cmd.data.name}`) {
        for(const arg of cmd.data.options) {
          if(!arg) {
            return message.reply({
              content: "This argument is required!"
            })
          }
        }
        try {
          await cmd.execute(message)
        } catch(e) {
          new CommandError(`An error occurred while trying to execute ${cmd.data.name}`, e)
        }
      }
    }
    */
  },
};
