const { MessageEmbed } = require("discord.js");
const commandFolder = fs.readdirSync("commands/");
const { prefix } = require("../config.json").bot;
const AFKUsers = require("../schemas/afkSchema");
const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
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
    } else if(message.mentions.members.first() && message.mentions.members.first() != message.guild.me) {
      var member = message.mentions.members.first();
      AFKUsers.findOne({
        user: member.user.id
      }, async (err, data) => {
        if(err) throw err;
        if(!data) {
          return;
        } else {
          if(data.message != "" && data.user != message.author.id) {
            const user_is_afk_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("User Is AFK")
              .setDescription(`<@${data.user}> is AFK currently for "**${data.message}**"`)
              .setTimestamp()
            await message.reply({
              embeds: [user_is_afk_embed]
            })
          }
        }
      })
    } else if(!message.mentions.members.first() && message.author.id === message.author.id) {
      AFKUsers.findOne({
        user: message.author.id
      }, async (err, data) => {
        if(err) throw err;
        if(!data) {
          return;
        } else {
          if(data.message != "") {
            const wb_embed = new MessageEmbed()
              .setColor(colors.blue)
              .setTitle("Welcome Back!")
              .setDescription(`Hello and welcome back <@${message.author.id}>, I have removed your AFK.`)
              .setTimestamp()
            data = await AFKUsers.findOneAndUpdate({
              user: message.author.id
            },
            {
              message: ""
            })
            data.save()
            var msg = await message.reply({
              embeds: [wb_embed]
            })
            await wait(15000).then(async () => await msg.delete())
          }
        }
      })
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
