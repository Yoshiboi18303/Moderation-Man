const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("softban")
    .setDescription("Softbans a user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to softban")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("days")
        .setDescription("How many days worth of messages to delete")
        .setRequired(true)
    ),
  config: {
    timeout: ms("15s"),
    message:
      "Don't start softbanning everyone in 0.000000000000000000000000000001 seconds.",
  },
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
    */
    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return await interaction.reply({
        content: "You can't use this command due to poor permissions!",
        ephemeral: true,
      });
    var target_member = interaction.options.getMember("target");
    var guild = interaction.guild;
    if (!guild.available)
      return await interaction.reply({
        content: "Sorry, I can't fetch any data from this server.",
        ephemeral: true,
      });
    var days = interaction.options.getNumber("days");
    if (days < 1 || days > 7)
      return await interaction.reply({
        content: "Invalid day number, this should be between 1 and 7.",
        ephemeral: true,
      });
    if (!target_member.bannable)
      return await interaction.reply({
        content: "I can't ban that member!",
        ephemeral: true,
      });
    target_member.ban({ days }).then(() => guild.bans.remove(target_member));
    await interaction.reply({
      content: `**${target_member.user.username}** has been softbanned.`,
      ephemeral: true,
    });
  },
};
