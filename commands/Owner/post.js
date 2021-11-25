const { SlashCommandBuilder } = require("@discordjs/builders");
const { yes, nope } = require("../../emojis.json");
const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Posts stats to somewhere")
    .addSubcommand((sc) =>
      sc.setName("statcord").setDescription("Sends the data to Statcord")
    )
    .addSubcommand((sc) =>
      sc
        .setName("del")
        .setDescription("Sends the guild count and shard count to the DEL")
    ),
  config: {
    timeout: ms("10s"),
    message: "Stop posting in spam.",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are **NOT** an owner of this bot!",
        ephemeral: true,
      });
    await interaction.deferReply({ ephemeral: true });
    var subcommand = interaction.options.getSubcommand();
    if (subcommand === "statcord") {
      client.stats.post().then(async (status) => {
        if (!status) {
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success")
            .setDescription(
              `Successfully posted stats on **${client.user.username}** to Statcord!`
            );
          return await interaction.editReply({
            embeds: [success_embed],
            ephemeral: true,
          });
        } else {
          const error_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Error")
            .setDescription(
              `An error occurred while posting stats, please check the console.`
            );
          return await interaction.editReply({
            embeds: [error_embed],
            ephemeral: true,
          });
        }
      });
    } else if (subcommand === "del") {
      const fetch = await import("node-fetch");
      const botId = client.user.id;
      const guildCount = client.guilds.cache.size;
      const shardCount = client.ready ? client.shard.count : 1;
      const link = `https://api.discordextremelist.xyz/v2/bot/${botId}/stats`;
      const posting_headers = {
        Authorization: process.env.DEL_API_KEY,
      };
      const posting_body = {
        guildCount: guildCount,
        shardCount: shardCount,
      };
      var f = await fetch.default(link, {
        method: "POST",
        headers: posting_headers,
        body: JSON.stringify(posting_body),
      });
      /*
      var data = await f.json();
      console.log(data)
      */
      await interaction.editReply({
        content: `DEL Post sent.`,
      });
    }
  },
};
