const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");

var costs = {
  2: 4500,
  3: 7610,
  4: 9769,
  5: 15000,
  6: 22500,
  7: 35673,
  8: 46783,
  9: 55569,
  10: 69420,
  11: 71450,
  12: 91069,
  13: 112567,
  14: 120233,
  15: 145133,
  16: 169691,
  17: 200000,
  18: 250000,
  19: 300000,
  20: 350000,
};

var vms = {
  2: 4000,
  3: 6000,
  4: 8000,
  5: 10000,
  6: 20000,
  7: 33341,
  8: 45792,
  9: 54329,
  10: 68420,
  11: 70225,
  12: 90033,
  13: 106233,
  14: 110133,
  15: 123133,
  16: 169969,
  17: 225000,
  18: 275000,
  19: 325000,
  20: 375000,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upgrade")
    .setDescription("Upgrade your vault capacity!"),
  async execute(interaction) {
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
          var coins = data.coins;
          var vm = data.vault_max;
          var vl = data.vault_level;
          var cost = costs[vl + 1];
          var new_vm = vms[vl + 1];
          if (coins < cost)
            return await interaction.reply({
              content: `You don't have enough money! You need ${cost} coins to pay for the upgrade, which means you need ${
                cost - coins
              } more coins!`,
              ephemeral: true,
            });
          if (vl + 1 > 20)
            return await interaction.reply({
              content: `This is the maximum upgrade, you are now **OP** and don't need this command anymore!`,
              ephemeral: true,
            });
          var new_vl = vl + 1;
          var new_coins = coins - cost;
          // console.log(new_coins)
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                vault_max: new_vm,
                vault_level: new_vl,
                coins: new_coins,
              },
            }
          );
          data.save();
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Vault Upgraded!")
            .setDescription(
              `Your vault has been successfully upgraded to level ${new_vl}! It can now hold ${new_vm} coins and you have ${new_coins} coins left!`
            );
          await interaction.reply({ embeds: [success_embed], ephemeral: true });
        }
      }
    );
  },
};
