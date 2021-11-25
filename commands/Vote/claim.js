const { SlashCommandBuilder } = require("@discordjs/builders");
const Users = require("../../schemas/userSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("claim")
    .setDescription("Claim your voting rewards"),
  config: {
    timeout: ms("1m") + ms("50s"),
    message: "Stop claiming vote rewards in spam.",
  },
  async execute(interaction) {
    Users.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        data = new Users({
          id: interaction.user.id,
        });
        await interaction.reply({
          content:
            "I have created some data for you, please run this command again.",
        });
      } else {
        const claimed_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Success")
          .setDescription("You have successfully claimed your rewards!");
        var topgg_link = `https://top.gg/bot/${client.user.id}/vote`;
        const no_rewards_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `You don't have any rewards to claim! Please vote for the bot [here](${topgg_link}).`
          );
        if (!data.voted)
          return await interaction.reply({
            embeds: [no_rewards_embed],
            ephemeral: true,
          });
        await interaction.reply({ embeds: [claimed_embed], ephemeral: true });
      }
    });
  },
};
