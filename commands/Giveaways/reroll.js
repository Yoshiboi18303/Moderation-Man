const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reroll")
    .setDescription("Rerolls a giveaway")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The message ID of the giveaway")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "Calm it down on the rerolling!",
  },
  async execute(interaction) {
    var id = interaction.options.getString("id");
    var giveaway = client.giveaways.giveaways.find(
      (g) => g.guildId == interaction.guild.id && g.messageId == id
    );
    if (!giveaway)
      return await interaction.reply({
        content: "Sorry, there was no giveaway found for that ID.",
        ephemeral: true,
      });
    await client.giveaways
      .reroll(id, {
        congrat: `${emojis.yay} New winner(s): {winners}!\nCongratulations, you won the prize of **{prize}**!\n{messageURL}`,
        error:
          "There aren't enough vaild participations so I can't reroll this giveaway!",
      })
      .then(
        async () =>
          await interaction.reply({
            content: "The giveaway was successfully rerolled!",
          })
      )
      .catch(
        async () =>
          await interaction.reply({ content: "An error occurred, sorry!" })
      );
  },
};
