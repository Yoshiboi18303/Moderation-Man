const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const shell = require("shelljs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exec")
    .setDescription("Executes a shell command")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to execute")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are **NOT** an owner of this bot!",
        ephemeral: true,
      });
    await interaction.deferReply();
    var cmd = interaction.options.getString("command");
    let output = shell.exec(cmd);
    if (output == "" && output.stderr != "") {
      output = `${output.stderr}`;
    } else if (output == "" && output.stderr == "") {
      output = "Command Completed (no output)";
    }
    // console.log(output)
    const executed_embed = new MessageEmbed()
      .setColor(colors.orange)
      .setTitle("Executed Callback")
      .setDescription(
        `This is what came back from your command...\n\nCommand: \`\`\`shell\n${cmd}\n\`\`\`\n\nOutput: \`\`\`\n${output}\n\`\`\``
      )
      .setFooter(
        `${interaction.user.username} requested this.`,
        interaction.user.displayAvatarURL({
          dynamic: false,
          format: "png",
          size: 32,
        })
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [executed_embed] });
  },
};
