const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delslash")
    .setDescription(
      "Delete a slash command from the bot (until next restart) {admins only}"
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the slash command")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "Could you wait to delete another command.. maybe?",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "This command is restricted to admins only!",
      });
    var name = interaction.options.getString("name");
    if (name === "delslash")
      return await interaction.reply({
        content: "Why would you delete this command??",
      });
    await interaction.deferReply();
    client.application.commands
      .fetch()
      .then(async (cmds) => {
        var cmd = cmds.find((cmd) => cmd.name === name);
        console.log(cmd);
        if (!cmd) {
          const bad_cmd_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle(`__Error__\u2800${emojis.nope}`)
            .setDescription("That command wasn't found!");
          return await interaction.editReply({
            embeds: [bad_cmd_embed],
          });
        }
        var cmd_name = cmd.name;
        await cmd.delete();
        const deleted_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle(`__Finished!__\u2800${emojis.yes}`)
          .setDescription(`Successfully deleted command: \`${cmd_name}\``);
        await interaction.editReply({
          embeds: [deleted_embed],
        });
      })
      .catch(async (err) => {
        return await interaction.editReply({
          content: "An error occurred... Please check the console!",
        });
        console.error(err);
      });
  },
};
