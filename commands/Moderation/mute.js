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
    .addRoleOption((option) =>
      option
        .setName("mute_role")
        .setDescription("Your muted role")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("member_role")
        .setDescription("Your member role")
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
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return await interaction.reply({
        content:
          "You don't have the `MANAGE_ROLES` permission so you can't run this command!",
        ephemeral: true,
      });
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return await interaction.reply({
        content: "I require the `MANAGE_ROLES` permission for this command!",
        ephemeral: true,
      });
    await interaction.deferReply({ ephemeral: true });
    var user = interaction.options.getUser("member");
    var member = interaction.options.getMember("member");
    var muted_role = interaction.options.getRole("mute_role");
    var member_role = interaction.options.getRole("member_role");
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

    await member.roles.add(muted_role);
    await member.roles.remove(member_role);
    await interaction.editReply({
      content: "Muted that member!",
      ephemeral: true,
    });
    await Log(client, interaction.guild, Enum.Log.Mute, {
      member,
      reason,
      moderator: interaction.member,
    });
  },
};
