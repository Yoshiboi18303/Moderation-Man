const Warnings = require("../../schemas/warningSchema");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Shows the warnings of a user (or yourself)!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Choose a user to show the warning amount of")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    Warnings.findOne(
      {
        id: user.id,
        guild: interaction.guild.id,
      },
      async (err, data) => {
        if (err) throw err;
        if (data) {
          const e = data.context.map(
            (w, i) =>
              `\n\`${i + 1}\` - Moderator: **${
                interaction.guild.members.cache.get(w.moderator).user.tag
              }** - Reason: "${
                w.reason
              }" - Severity: ${w.severity.toUpperCase()}`
          );
          const warnings_embed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle(`${user.username}'s Warning Count!`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription(`${e.join("\n")}`);
          await interaction.reply({
            embeds: [warnings_embed],
            ephemeral: true,
          });
        } else {
          return await interaction.reply({
            content: "This user doesn't have any warnings!",
            ephemeral: true,
          });
        }
      }
    );
  },
};
