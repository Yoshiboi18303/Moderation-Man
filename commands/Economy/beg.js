const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");

const people = [
  "Sans",
  "Default Jonesy",
  "Yoshiboi18303",
  "Carole Baskin",
  "Grandmother",
  "Mario",
  "Hannah Montana",
  "Danny DeVito",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg someone for money!"),
  config: {
    timeout: ms("1m"),
    message:
      "Your begging makes you look like a little baby, please calm it down.",
  },
  async execute(interaction) {
    await interaction.deferReply();
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
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
        return await interaction.editReply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        var chance = Math.random() > 0.61;
        var coins = data.coins;
        var person = people[Math.floor(Math.random() * people.length)];
        var earned_coins = Math.floor(Math.random() * 150) + 5;
        // var earned_coins = Math.floor(Math.random() * 300) + 5;
        var good_messages = [
          `Oh you poor little beggar, take ${earned_coins} coins.`,
          `Oh sure, I'll give you some money, take ${earned_coins} coins.`,
          `One second... Okay, here you go! ${earned_coins} coins from my wallet!`,
        ];
        var bad_messages = [
          "Lmao, imagine if I ever gave you anything.",
          "No.",
          "Get out of my face beggar.",
          "Fuck off peta.",
          "Go away.",
          "Honestly, why are you begging? Just get a damn job.",
          "Please stop.",
          "Jobs exist, get one.",
        ];
        if (chance == true) {
          var good_message =
            good_messages[Math.floor(Math.random() * good_messages.length)];
          const success_embed = new MessageEmbed()
            .setColor(colors.green)
            .setAuthor(`${person}`)
            .setDescription(`"${good_message}"`)
            .setFooter(
              `${interaction.user.username} begged someone!`,
              interaction.user.displayAvatarURL({ dynamic: true, size: 32 })
            )
            .setTimestamp();
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $inc: {
                coins: earned_coins,
              },
            }
          );
          data.save();
          await interaction.editReply({ embeds: [success_embed] });
        } else {
          var bad_message =
            bad_messages[Math.floor(Math.random() * bad_messages.length)];
          const failed_embed = new MessageEmbed()
            .setColor(colors.red)
            .setAuthor(`${person}`)
            .setDescription(`"${bad_message}"`)
            .setFooter("Imagine begging LMAO")
            .setTimestamp();
          await interaction.editReply({
            embeds: [failed_embed],
          });
        }
      }
    });
  },
};
