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
        .setDescription("Select a member to mute")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("mute_role")
        .setDescription("Select your muted role")
        .setRequired(true)
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
    await interaction.editReply({
      content: "Muted that member!",
      ephemeral: true,
    });
  },
};
