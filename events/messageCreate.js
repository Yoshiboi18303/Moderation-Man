const { MessageEmbed } = require("discord.js");
const commandFolder = fs.readdirSync("commands/");
const { prefix } = require("../config.json").bot;

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
        .setColor("YELLOW")
        .setTitle(`Welcome to ${client.user.username}!`)
        .setDescription(
          `Hello ${message.author.username}, I see you have mentioned me.\nAre you lost? Check all my commands by starting with \`/help\`!`
        );
      await message.reply({ embeds: [embed] });
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
