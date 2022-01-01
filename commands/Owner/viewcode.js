const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("viewcode")
    .setDescription("View the code of a file in the environment (admins only)")
    .addStringOption((option) =>
      option
        .setName("path")
        .setDescription(
          "The path towards the file (starts from root directory)"
        )
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Calm down with the code viewing",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id)) {
      const unauthorized_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Error")
        .setDescription(
          `${emojis.nope} \`403\` **-** You are \`Unauthorized\` for this command!`
        )
        .setTimestamp();
      return await interaction.reply({
        embeds: [unauthorized_embed],
      });
    }
    const path = interaction.options.getString("path");
    try {
      var dirfile = fs.readFileSync(path);
      console.log(dirfile);
      var code = dirfile.toString();
      if (code.length > 4096) {
        var buffer = Buffer.from(code);
        const cmdfile = new MessageAttachment(buffer, `code.txt`);
        return await interaction.reply({
          content:
            "The code for this file is too long for an embed, so here's a file with the **EXACT SAME** code.",
          files: [cmdfile],
        });
      }
      const code_embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("File code")
        .setDescription(`\`\`\`\n${code}\n\`\`\``)
        .setTimestamp();
      await interaction.reply({
        embeds: [code_embed],
      });
    } catch (e) {
      return await interaction.reply({
        content: `\`${e}\``,
      });
    }
  },
};
