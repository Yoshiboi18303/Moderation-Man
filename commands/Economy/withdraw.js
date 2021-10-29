const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw some money from your vault!")
    .addIntegerOption((option) =>
      option
        .setName("money")
        .setDescription("Type in the amount of money to withdraw")
        .setRequired(true)
    ),
  async execute(interaction) {
    var money_to_withdraw = interaction.options.getInteger("money");
    var profile = Profiles.findOne(
      { id: interaction.user.id },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
          const no_data_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Error")
            .setDescription(
              "You don't have any data on this bot! Please run `/start` to get some data on this bot!"
            )
            .setFooter(
              `${interaction.user.username} needs some data lmao.`,
              interaction.user.displayAvatarURL({ dynamic: true, size: 32 })
            )
            .setTimestamp();
          return await interaction.reply({
            embeds: [no_data_embed],
            ephemeral: true,
          });
        } else {
          // console.log(data)
          var coins = data.coins;
          var vc = data.vault_coins;
          var vm = data.vault_max;
          if (money_to_withdraw > vc)
            return await interaction.reply({
              content: `There's not enough money in the vault to complete this transaction!\nThe max amount of money to withdraw is ${vc}`,
            });
          var vc_minus = vc - money_to_withdraw;
          var coins_plus = coins + money_to_withdraw;
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                coins: coins_plus,
                vault_coins: vc_minus,
              },
            }
          );
          data.save();
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success")
            .setDescription(
              `You have sucessfully withdrawn ${money_to_withdraw} coins from your vault!\nYou now have ${vc_minus} coins in your vault!`
            );
          await interaction.reply({ embeds: [success_embed], ephemeral: true });
        }
      }
    );
  },
};
