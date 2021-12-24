const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setpassive")
    .setDescription("Change your profiles' passive setting")
    .addBooleanOption((option) =>
      option
        .setName("status")
        .setDescription("The status to set the option to")
        .setRequired(true)
    ),
  config: {
    message: ms("3s"),
    message: "Calm it down with the passive setting!",
  },
  async execute(interaction) {
    var final = interaction.options.getBoolean("status");
    Profiles.findOne(
      {
        id: interaction.user.id,
      },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
          const no_data_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Error")
            .setDescription(
              `${emojis.nope} **-** You don't have any data!\nRun \`/start\` to get some!`
            );
          return await interaction.reply({
            embeds: [no_data_embed],
          });
        } else {
          var old_passive = data.passive;
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                passive: final,
              },
            }
          );
          data.save();
          const done_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Finished!")
            .setDescription(
              `${emojis.yes} **-** Successfully set passive status from \`${old_passive}\` to \`${final}\``
            );
          await interaction.reply({
            embeds: [done_embed],
          });
        }
      }
    );
  },
};
