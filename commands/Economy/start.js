const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");

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
          if (!color.includes("#"))
            return await interaction.reply({
              content:
                "Invalid Hex Code\nA actual Hexadecimal Code would be `#00FF48` for example.",
              ephemeral: true,
            });
          data = new Profiles({
            id: interaction.user.id,
            nickname: nickname,
            color: color,
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
          await interaction.reply({ embeds: [started_embed], ephemeral: true });
        }
      }
    );
  },
};
