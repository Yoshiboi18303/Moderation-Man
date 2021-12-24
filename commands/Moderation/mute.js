const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription(
      "Mutes a member in your server (which prevents them from talking)!"
    )
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to mute")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("How long in milliseconds to timeout the member for")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for this mute")
        .setRequired(false)
    ),
  config: {
    timeout: ms("20s"),
    message: "Could you not spam moderate?",
  },
  async execute(interaction) {
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
      });
    if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS))
      return await interaction.reply({
        content:
          "You don't have the `MODERATE_MEMBERS` permission so you can't run this command!",
        ephemeral: true,
      });
    if (
      !interaction.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)
    )
      return await interaction.reply({
        content:
          "I require the `MODERATE_MEMBERS` permission for this command!",
        ephemeral: true,
      });
    await interaction.deferReply({ ephemeral: true });
    var user = interaction.options.getUser("member");
    var time = interaction.options.getInteger("time");
    var member = interaction.options.getMember("member");
    var reason =
      interaction.options.getString("reason") || "No reason provided!";

    if (user.id == interaction.user.id)
      return await interaction.editReply({
        content: "You can't mute yourself!",
        ephemeral: true,
      });
    if (user.id == client.user.id)
      return await interaction.editReply({
        content: "You can't mute the client!",
        ephemeral: true,
      });
    await member
      .timeout(time, reason)
      .then(async () => {
        await interaction.editReply({
          content: "Muted that member!",
          ephemeral: true,
        });
        await Log(client, interaction.guild, Enum.Log.Mute, {
          member,
          reason,
          moderator: interaction.member,
        });
      })
      .catch(async (e) => {
        console.log(e);
        await interaction.editReply({
          content: "A problem occurred, please report this to the developers!",
        });
      });
  },
};
