const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");
var jobs = [
  "Bot Developer",
  "Cashier",
  "Chef",
  "Moderator" /*"Game Tester",
  "Artist"*/,
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setjob")
    .setDescription("Set your job/View all jobs on the bot")
    .addSubcommand((sc) =>
      sc.setName("view").setDescription("View all the jobs available")
    )
    .addSubcommand((sc) =>
      sc
        .setName("set")
        .setDescription("Set your job")
        .addStringOption((option) =>
          option
            .setName("job_name")
            .setDescription("The job to set yours to")
            .setRequired(true)
        )
    ),
  config: {
    timeout: ms("5s"),
    message: "Calm down the job viewing/setting",
  },
  async execute(interaction) {
    return await interaction.reply({ content: "This command is coming soon!" });
    var subcommand = interaction.options.getSubcommand();
    const returnJobs = (string) => {
      var job_array = [];
      for (var job of jobs) {
        job_array;
      }
    };
    if (subcommand == "view") {
    } else if (subcommand == "set") {
    }
  },
};
