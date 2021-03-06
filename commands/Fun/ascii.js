const { MessageEmbed } = require("discord.js");
const figlet = require("figlet");
const figletAsync = require("util").promisify(figlet);
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Shows your text in Ascii!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription(
          "Type in the text you want to be turned into Ascii (max characters: 20)!"
        )
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    const text = interaction.options.getString("text");

    const result = await figletAsync(text);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Ascii Result")
      .setDescription("```" + result + "```")
      .setTimestamp();

    if (text.length > 20)
      return await interaction.reply({
        content: `Please make your text shorter! - The text limit is 20 characters.`,
        ephemeral: true,
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
