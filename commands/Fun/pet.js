const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pet")
    .setDescription("*insert ending theme*")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to pet")
        .setRequired(false)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    var link = `https://some-random-api.ml/premium/petpet?avatar=${user.displayAvatarURL(
      { dynamic: false, format: "png", size: 512 }
    )}&key=${process.env.KEY}`;
    var attachment = new MessageAttachment(link, "petpet.gif");
    await interaction.reply({ files: [attachment] });
  },
};
