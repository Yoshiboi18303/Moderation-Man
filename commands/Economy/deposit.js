const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit some money to get it out of your pockets")
    .addIntegerOption((option) =>
      option
        .setName("money")
        .setDescription("Type in an amount of money to deposit")
        .setRequired(true)
    ),
  async execute(interaction) {
    var money_to_deposit = interaction.options.getInteger("money");
    if (money_to_deposit == 0)
      return await interaction.reply({
        content: "You need to deposit at least 1 coin!",
        ephemeral: true,
      });
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
          if (money_to_deposit > coins)
            return await interaction.reply({
              content: `You are depositing way too much!\nYour amount of coins is ${coins} right now.`,
              ephemeral: true,
            });
          var vc_plus = vc + money_to_deposit;
          var coins_minus = coins - money_to_deposit;
          if (vc_plus > vm)
            return await interaction.reply({
              content:
                "Your vault is (or will be) at max capacity! Run `/upgrade` to upgrade your vault capacity!",
              ephemeral: true,
            });
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                coins: coins_minus,
                vault_coins: vc_plus,
              },
            }
          );
          data.save();
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Success")
            .setDescription(
              `You have sucessfully deposited ${money_to_deposit} coins into your vault!\nYou now have ${vc_plus} coins in your vault, which means you have ${
                vm - vc_plus
              } coins left until max capacity!`
            );
          await interaction.reply({ embeds: [success_embed], ephemeral: true });
        }
      }
    );
  },
};
