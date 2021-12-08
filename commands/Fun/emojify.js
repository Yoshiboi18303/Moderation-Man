const { SlashCommandBuilder } = require("@discordjs/builders");
const { emojifyText } = require("../../utils/");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojify")
    .setDescription("Emojify some text")
    .addStringOption((option) => option.setName("text").setDescription("The text to emojify").setRequired(true)),
  config: {
    timeout: ms("5s"),
    message: "Calm it down, you're scaring the Discord API."
  },
  async execute(interaction) {
    await interaction.deferReply();
    var text = interaction.options.getString("text")
    var result = await emojifyText(`${text}`)
    await interaction.editReply({
      content: `${result}`
    })
  }
}