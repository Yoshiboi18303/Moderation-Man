const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildCreate",
  once: false,
  async execute(guild) {
    const log_channel = client.channels.cache.get("904421522205204531");
    var guild_channel = guild.channels.cache.find(
      (channel) => channel.type == "GUILD_TEXT" && channel.name == "bot-hell"
    );
    // console.log(guild_channel)
    const new_guild_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("__New Guild!__")
      .setDescription(`**${client.user.username}** was added to a new guild!`)
      .addFields([
        {
          name: "Guild Name",
          value: `${guild.name}`,
          inline: true,
        },
        {
          name: "Guild Member Count",
          value: `${guild.memberCount}`,
          inline: true,
        },
      ]);
    const added_embed = new MessageEmbed()
      .setColor(colors.mint_green)
      .setTitle(`__Hello!__`)
      .setDescription(
        `Hello everyone in **${guild.name}**, I'm **${client.user.username}**!\nAnd I'm happy to be here!\nFor adding me, I need to give you some info about me.\n\nFAQ:\n\n\u3000**Q:** What is my prefix?\n\u3000**A:** My prefix is \`/\`\n\n\u3000**Q:** What commands are supported?\n\u3000**A:** Currently this bot is Slash Commands only.\n\n\u3000**Q:** How long does it take for the Slash Commands to appear?\n\u3000**A:** Currently due to Discord Slash Command caching, it may take up to one hour for all commands to be loaded in your guild.\n\n\u3000**Q:** How can I see all the commands?\n\u3000**A:** Once your Slash Commands are all loaded, run \`/help\` in your bot channel to see all the commands for me!\n\n\u3000**Q:** What was this bot made for?\n\u3000**A:** This bot has been made by Yoshiboi18303 (as suggested by Burn) for making a safer Discord Server for you, and your friends!\n\nAnyway, have fun with me!`
      );
    await log_channel.send({
      embeds: [new_guild_embed],
    });
    if (!guild_channel || typeof guild_channel == "undefined") return;
    try {
      await guild_channel.send({
        embeds: [added_embed],
      });
    } catch (err) {
      console.error(err);
    }
  },
};
