const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the leaderboard for coins/bank")
    .addSubcommand((sc) =>
      sc
        .setName("wallet")
        .setDescription("View the leaderboard for wallet coins")
    )
    .addSubcommand((sc) =>
      sc.setName("vault").setDescription("View the leaderboard for vault coins")
    ),
  config: {
    timeout: ms("5s"),
    message: "You can't just spam the leaderboard!",
  },
  async execute(interaction) {
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to ${
          client.guilds.cache.get(config.bot.testServerId).name
        } for the moment!`,
      });
    var subcommand = interaction.options.getSubcommand();
    if (subcommand == "wallet") {
      var coins_array = [];
      var members = [];
      Profiles.find({}, async (err, data) => {
        if (err) throw err;
        if (data) {
          data.forEach((u) => {
            if (interaction.guild.members.cache.has(u.id)) members.push(u);
          });
          for (var user of members) {
            coins_array.push(user.coins);
          }
          var g2l = coins_array.sort((a, b) => {
            return b - a;
          });
          var entry;
          var returnedValue = "";
          members.forEach((member) => {
            entry = Profiles.findOne({
              id: members.find((m) => m.id === member.id),
            });
          });
          for (let index = 0; index < g2l[index]; index++) {
            returnedValue += `**${index}** - ${entry.nickname}: ${entry.coins}`;
          }
          console.log(returnedValue);
          await interaction.reply({
            content: "Check the console!",
          });
        }
      });
    } else if (subcommand == "vault") {
    }
  },
};
