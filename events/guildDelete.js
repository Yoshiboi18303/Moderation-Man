const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildDelete",
  once: false,
  async execute(guild) {
    const log_channel = client.channels.cache.get("904421522205204531");
    const left_guild_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("Left a Guild...")
      .setDescription(`**${client.user.username}** was removed from a guild!`);
    await log_channel.send({
      embeds: [left_guild_embed],
    });
  },
};
