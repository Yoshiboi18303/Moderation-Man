const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription(
      "Bet some of your money to win more money (1 in 7 chance of success)"
    )
    .addNumberOption((option) =>
      option
        .setName("betting_amount")
        .setDescription("The amount to bet")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
        ephemeral: true,
      });
    var amount = interaction.options.getNumber("betting_amount");
    if (amount < 400)
      return await interaction.reply({
        content: "You can't bet less than 400 coins, sorry not sorry.",
        ephemeral: true,
      });
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            "You don't have any data in the database!\nRun `/start` to get some!"
          );
        return await interaction.reply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        var coins = data.coins;
        if (coins < amount)
          return await interaction.reply({
            content: "You're betting more than you already have!",
            ephemeral: true,
          });
        var chance = Math.random() > 0.7;
        if (chance == true) {
          var money_earned = amount * 3;
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $inc: {
                coins: money_earned,
              },
            }
          );
          data.save();
          const bet_success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Successful Bet")
            .setDescription(
              `Your bet was a success and you earned 3 times the amount you just betted (${money_earned} coins)!`
            )
            .setFooter(
              `${interaction.user.username} is lucky!`,
              interaction.user.displayAvatarURL({
                dynamic: false,
                format: "png",
                size: 32,
              })
            )
            .setTimestamp();
          await interaction.reply({
            embeds: [bet_success_embed],
          });
        } else {
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                coins: coins - amount,
              },
            }
          );
          data.save();
          const bet_fail_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Failed Bet")
            .setDescription("Your bet was a fail and you lost your bet.")
            .setFooter("Imagine sucking with luck.")
            .setTimestamp();
          await interaction.reply({
            embeds: [bet_fail_embed],
          });
        }
      }
    });
  },
};
