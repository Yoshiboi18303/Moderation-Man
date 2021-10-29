const Warnings = require("../../schemas/warningSchema");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnremove")
    .setDescription("Remove one of or all the warnings on a user!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("one")
        .setDescription("Remove one of the warnings on a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select a user to remove one of the warnings from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("warning_number")
            .setDescription("Type in a warning number to delete")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("Remove all of the warnings from a user!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select a user to remove all of the warnings from")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
      return await interaction.reply({
        content:
          "You don't have the `MANAGE_MESSAGES` permission, so you can't run this command!",
        ephemeral: true,
      });
    if (interaction.options.getSubcommand() === "one") {
      await interaction.deferReply();
      const user = interaction.options.getUser("user");
      let wn = interaction.options.getInteger("warning_number");
      wn = wn - 1;
      Warnings.findOne(
        {
          guild: interaction.guild.id,
          id: user.id,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            data.context.splice(wn, 1);
            await interaction.editReply({
              content: `Warn #${wn + 1} deleted!`,
            });
            data.save();
          } else {
            return await interaction.editReply({
              content: "This user does not have any warnings!",
              ephemeral: true,
            });
          }
        }
      );
    } else if (interaction.options.getSubcommand() === "all") {
      await interaction.deferReply();
      const user = interaction.options.getUser("user");
      Warnings.findOne(
        {
          guild: interaction.guild.id,
          id: user.id,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            await Warnings.findOneAndDelete({
              user: user.id,
              guild: interaction.guild.id,
            });
            await interaction.editReply({
              content: `Successfully removed all warnings from **${user.username}**!`,
            });
          } else {
            return await interaction.editReply({
              content: "This user does not have any warnings!",
              ephemeral: true,
            });
          }
        }
      );
    }
  },
};
