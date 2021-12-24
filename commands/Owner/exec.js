const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const shell = require("shelljs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exec")
    .setDescription("Executes shell commands (admins only)")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to execute")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "Stop executing in spam.",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are **NOT** an owner of this bot!",
        ephemeral: true,
      });
    await interaction.deferReply();
    var cmd = interaction.options.getString("command");
    var secrets = [
      process.env.TOKEN,
      process.env.BACKUP_DLS_API_KEY,
      process.env.BOATS_KEY,
      process.env.CLIENT_SECRET,
      process.env.DEL_API_KEY,
      process.env.DISCORDBOTLIST,
      process.env.DISCORDLISTOLOGY,
      process.env.FP_KEY,
      process.env.INFINITY_API_TOKEN,
      process.env.KEY,
      process.env.KEY_TO_MOTION,
      process.env.MAIN_DLS_API_KEY,
      process.env.MONGO_CS,
      process.env.RADAR_KEY,
      process.env.SECRET,
      process.env.SERVICES_API_KEY,
      process.env.STATCORD_KEY,
      process.env.TEST_VOTE_WEBHOOK_TOKEN,
      process.env.TOPGG_API_KEY,
      process.env.VOTE_WEBHOOK_TOKEN,
      process.env.WEBHOOK_AUTH,
      process.env.PAT,
    ];
    // var secret_included = false;
    if (cmd == "speedtest")
      return await interaction.editReply({
        content: "There's a command for that already! `/speedtest`",
      });
    let output = shell.exec(cmd);
    if (output == "" && output.stderr != "") {
      output = `${output.stderr}`;
    } else if ((output == "" && output.stderr == "") || output == "\n") {
      output = "Command Completed (no output)";
    } else if (output.length > 4096 || output.stderr.length > 4096) {
      var buffer = Buffer.from(output);
      var attachment = new MessageAttachment(buffer, "output.txt");
      return await interaction.editReply({
        content: `The output wanting to be shown for \`${cmd}\` is too long to be shown on Discord, so here's a file.`,
        files: [attachment],
      });
    }
    for (const secret of secrets) {
      if (output.includes(secret)) {
        /* secret_included = true; */
        output = "[HIDDEN SECRET (Console Cleared!)]";
        console.clear();
      }
    }
    /*
    let ehmral = true;
    if(secret_included == false) {
      ehmral = false
    }
    */
    // console.log(output)
    const executed_embed = new MessageEmbed()
      .setColor(colors.orange)
      .setTitle("Executed Callback")
      .setDescription(
        `This is what came back from your command...\n\nCommand: \`\`\`bash\n${cmd}\n\`\`\`\n\nOutput: \`\`\`\n${output}\n\`\`\``
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
    await interaction.editReply({
      embeds: [executed_embed],
      /* ephemeral: ehmral */
    });
  },
};
