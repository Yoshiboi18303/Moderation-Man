const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Returns the link(s) to vote for Moderation Man"),
  async execute(interaction) {
    var topgg_link = "https://top.gg/bot/891070722074611742/vote";
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Vote for ${client.user.username}`)
      .setDescription(
        `Hello ${
          interaction.user.username
        }, I see you want to vote for me! Well... here are some links!\n\`Top.gg\`: [Vote](${topgg_link})\n\nAfter voting you will get: **${voteRewards.join(
          ", "
        )}**`
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
