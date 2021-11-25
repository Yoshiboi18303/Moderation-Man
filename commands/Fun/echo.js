const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Echos what you type in an ephemeral message!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Type in the text to echo back!")
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    const text = interaction.options.getString("text");
    await interaction.reply({ content: `${text}`, ephemeral: true });
  },
};
