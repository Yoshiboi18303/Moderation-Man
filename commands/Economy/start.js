const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");
const { isHex, isHexColor } = require("ishex");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start your money making adventure!")
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("Type in a nickname for you on the Economy system")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Type in a hex code to use as a color")
        .setRequired(false)
    ),
  config: {
    timeout: ms("25s"),
    message: "Your spam starting can wait.",
  },
  async execute(interaction) {
    var user = Profiles.findOne(
      { id: interaction.user.id },
      async (err, data) => {
        if (err) throw err;
        if (data) {
          const already_started_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Error")
            .setDescription(
              `You have already started, my guy! Don't try again!`
            )
            .setFooter(
              `${interaction.user.username} forgot they already started lmao.`,
              interaction.user.displayAvatarURL({ dynamic: true, size: 32 })
            )
            .setTimestamp();
          return await interaction.reply({
            embeds: [already_started_embed],
            ephemeral: true,
          });
        } else {
          var nickname =
            interaction.options.getString("nickname") ||
            interaction.user.username;
          var color = interaction.options.getString("color") || "#000000";
          console.log(isHex(color), isHexColor(color));
          if (isHex(color) || isHexColor(color)) {
            if (isHex(color)) {
              color = `#${color}`;
            }
            data = new Profiles({
              id: interaction.user.id,
              nickname,
              color,
              startedAt: Date.now(),
            });
            data.save();
            const started_embed = new MessageEmbed()
              .setColor(colors.green)
              .setTitle("Success")
              .setDescription(
                "You have successfully started your money making adventure! Run `/work` to start making money!"
              )
              .setFooter(
                `${interaction.user.username} has successfully started!`,
                interaction.user.displayAvatarURL({ dynamic: true, size: 32 })
              )
              .setTimestamp();
            await interaction.reply({
              embeds: [started_embed],
              ephemeral: true,
            });
          } else {
            const invalid_color_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `${emojis.nope} **-** You have entered an invalid hexadecimal code.`
              )
              .setTimestamp();
            return await interaction.reply({
              embeds: [invalid_color_embed],
              ephemeral: true,
            });
          }
        }
      }
    );
  },
};
