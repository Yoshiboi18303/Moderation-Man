const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const util = require("util");
const Warnings = require("../../schemas/warningSchema");
const Channels = require("../../schemas/channelSchema");
const Profiles = require("../../schemas/profileSchema");
const Users = require("../../schemas/userSchema");
const colors = require("../../colors.json");
const shell = require("shelljs");
const voice = require('../../items/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate some code (admins only & dangerous)")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Type in some code to evaluate")
        .setRequired(false)
    ),
  options: {
    guildOnly: false,
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are **NOT** an owner of this bot!",
        ephemeral: true,
      });
    const code = interaction.options.getString("code");
    await interaction.deferReply();
    var result = new Promise((resolve, reject) => {
      resolve(eval(code));
    });

    if (code == "shell.exec" || code.includes("shell.exec"))
      return await interaction.editReply({
        content: "You should use the `exec` command for this shell command.",
        ephemeral: true,
      });

    var secrets = [
      process.env.TOKEN,
      process.env.KEY,
      process.env.MONGO_CS,
      process.env.FP_KEY,
      client.token,
      interaction.token,
      process.env.STATCORD_KEY,
      process.env.BACKUP_DLS_API_KEY,
      process.env.BOATS_KEY,
      process.env.CLIENT_SECRET,
      process.env.DEL_API_KEY,
      process.env.DISCORDBOTLIST,
      process.env.DISCORDLISTOLOGY,
      process.env.INFINITY_API_TOKEN,
      process.env.KEY_TO_MOTION,
      process.env.MAIN_DLS_API_KEY,
      process.env.SECRET,
      process.env.SERVICES_API_KEY,
      process.env.TEST_VOTE_WEBHOOK_TOKEN,
      process.env.TOPGG_API_KEY,
      process.env.VOTE_WEBHOOK_TOKEN,
      process.env.WEBHOOK_AUTH,
      voice.password,
      process.env.LL_HOST,
      process.env.LL_PASS,
    ];

    result
      .then(async (result) => {
        if (typeof result !== "string")
          result = util.inspect(result, { depth: 0 });

        for (const term of secrets) {
          if (result.includes(term)) result = result.replace(term, "[SECRET]");
        }
        if (result.length > 2000) {
          const buffer = Buffer.from(result);
          var attachment = new MessageAttachment(buffer, "evaluated.js");
          return await interaction.followUp({
            content:
              "The result is too long to show on Discord, so here's a file.",
            files: [attachment],
          });
        }
        const evaluated_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Evaluation")
          .setDescription(
            `Successful Evaluation.\n\nOutput:\n\`\`\`js\n${result}\n\`\`\``
          );
        await interaction.editReply({ embeds: [evaluated_embed] });
      })
      .catch(async (result) => {
        if (typeof result !== "string")
          result = util.inspect(result, { depth: 0 });

        for (const term of secrets) {
          if (result.includes(term)) result = result.replace(term, "[SECRET]");
        }

        const error_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error Evaluating")
          .setDescription(
            `An error occurred.\n\nError:\n\`\`\`js\n${result}\n\`\`\``
          );
        await interaction.editReply({ embeds: [error_embed] });
      });
  },
};
