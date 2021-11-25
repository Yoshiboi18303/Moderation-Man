const { SlashCommandBuilder } = require("@discordjs/builders");
const { reverseString } = require("../../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reverse")
    .setDescription("Reverses text. No, really.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to reverse")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "Could you not spam reverse strings, it hurts the API.",
  },
  async execute(interaction) {
    // if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment.`, ephemeral: true })
    await interaction.deferReply();
    var text = interaction.options.getString("text");

    var reversed_text = await reverseString(text);

    await interaction.editReply({
      content: `\`\`\`\n${reversed_text}\n\`\`\``,
    });
  },
};
