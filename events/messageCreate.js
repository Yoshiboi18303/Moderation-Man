const { MessageEmbed } = require("discord.js");
const Options = require("../schemas/optionsSchema");

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
      await message.channel.send({ embeds: [embed] });
    }
  },
};
