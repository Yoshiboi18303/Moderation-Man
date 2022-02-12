const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, MessageEmbed, Permissions } = require("discord.js");
const util = require("util");
const Warnings = require("../../schemas/warningSchema");
// const Channels = require("../../schemas/channelSchema");
const Profiles = require("../../schemas/profileSchema");
const Users = require("../../schemas/userSchema");
const Suggestions = require("../../schemas/suggestionSchema");
const TicketSettings = require("../../schemas/ticketSetSchema");
const AFKUsers = require("../../schemas/afkSchema");
const CountingSystems = require("../../schemas/countSysSchema");
const colors = require("../../colors.json");
const shell = require("shelljs");
const CommandError = require("../../items/classes/CommandError");
const BotError = require("../../items/classes/BotError");
const CloseProcess = require("../../items/classes/CloseProcess");
const utils = require("../../utils/");
const Canvas = require("canvas");

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
  config: {
    timeout: ms("10s"),
    message: "Stop evaluating in spam.",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You are **NOT** an owner of this bot!",
        ephemeral: true,
      });
    const parser = await import("parse-ms");
    const fetch = await import("node-fetch");
    const code = interaction.options.getString("code") || "";
    await interaction.deferReply();
    var result = new Promise((resolve, reject) => {
      resolve(eval(code));
    });

    if (code == "shell.exec" || code.includes("shell.exec"))
      return await interaction.editReply({
        content:
          "You should use the `exec` command for this shell command/code.",
        ephemeral: true,
      });

    var secrets = [
      process.env.TOKEN,
      process.env.KEY,
      process.env.MONGO_CS,
      process.env.FP_KEY,
      client.token,
      process.env.RADAR_KEY,
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
      process.env.PAT,
    ];

    result
      .then(async (result) => {
        if (typeof result !== "string")
          result = util.inspect(result, { depth: 0 });

        for (const term of secrets) {
          if (
            (result.includes(term) && term != undefined) ||
            (result.includes(term) && term != null)
          )
            result = result.replace(term, "[SECRET]");
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
          )
          .setTimestamp();
        try {
          await interaction.editReply({ embeds: [evaluated_embed] });
        } catch (e) {
          return;
        }
      })
      .catch(async (result) => {
        if (typeof result !== "string")
          result = util.inspect(result, { depth: 0 });

        for (const term of secrets) {
          if (
            (result.includes(term) && term != undefined) ||
            (result.includes(term) && term != null)
          )
            result = result.replace(term, "[SECRET]");
        }

        const error_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error Evaluating")
          .setDescription(
            `An error occurred.\n\nError:\n\`\`\`js\n${result}\n\`\`\``
          )
          .setTimestamp();
        try {
          await interaction.editReply({ embeds: [error_embed] });
        } catch (e) {
          return;
        }
      });
  },
};
