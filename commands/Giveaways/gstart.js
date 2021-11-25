const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gstart")
    .setDescription("Starts a giveaway")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to start the giveaway in")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("winners")
        .setDescription("The amount of winners for the giveaway")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "How long the giveaway will last (use m for minutes, s for seconds etc.)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prize")
        .setDescription("The prize of this giveaway")
        .setRequired(true)
    ),
  config: {
    timeout: ms("1m") + ms("30s"),
    message: "Could you calm it down on the giveaways?",
  },
  async execute(interaction) {
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
        ephemeral: true,
      });
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "You don't have the correct permissions for this command!",
        ephemeral: true,
      });
    var channel = interaction.options.getChannel("channel");
    var winners = interaction.options.getNumber("winners");
    var duration = interaction.options.getString("duration");
    var prize = interaction.options.getString("prize");
    if (channel.type != "GUILD_TEXT")
      return await interaction.reply({
        content: `Expected the giveaway channel to be a \`GUILD_TEXT\` channel, got \`${channel.type}\` instead.`,
        ephemeral: true,
      });
    if (duration == "0s")
      return await interaction.reply({
        content: `Expected the giveaway duration to have at least 1 second long, got 0 seconds instead.`,
        ephemeral: true,
      });
    await client.giveaways.start(channel, {
      duration: ms(duration),
      winnerCount: winners,
      prize,
    });
    await interaction.reply({
      content: `Started the giveaway for ${prize} in <#${channel.id}>!`,
      ephemeral: true,
    });
  },
};
