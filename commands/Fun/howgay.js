const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("howgay")
    .setDescription("Check how gay someone is")
    .addUserOption((option) =>
      option.setName("user").setDescription("A user to use").setRequired(false)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    await interaction.deferReply();
    var color;
    var user = interaction.options.getUser("user") || interaction.user;
    var member = interaction.options.getMember("user") || interaction.member;
    var thumbnail = "https://some-random-api.ml/canvas/gay?avatar=%a".replace(
      "%a",
      user.displayAvatarURL({ dynamic: true, format: "png", size: 256 })
    );
    var how_gay = Math.round(Math.random() * 101);
    if (member.displayHexColor == "#000000") {
      color = "RANDOM";
    } else {
      color = member.displayHexColor;
    }
    const how_gay_embed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${user.username} Gay Meter`)
      .setDescription(`${user.username} is ${how_gay}% gay 🏳️‍🌈`)
      .setThumbnail(thumbnail)
      .setTimestamp();
    if (user.username != interaction.user.username) {
      how_gay_embed.setFooter(
        `${interaction.user.username} requested this`,
        user.displayAvatarURL({ dynamic: false, format: "png", size: 32 })
      );
    }
    await interaction.editReply({ embeds: [how_gay_embed] });
  },
};
