const {
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from your server for breaking your rules!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the kick.")
        .setRequired(false)
    ),
  config: {
    timeout: ms("20s"),
    message: "Could you not spam moderate?",
  },
  async execute(interaction) {
    var user = interaction.options.getUser("user");
    var member = interaction.options.getMember("user");
    var reason = interaction.options.getString("reason");

    if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return await interaction.reply({
        content: "You can't run this command!",
        ephemeral: true,
      });
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return await interaction.reply({
        content: "I can't run this command!",
        ephemeral: true,
      });
    if (user.id == client.user.id)
      return await interaction.reply({
        content: "You can't kick the client!",
        ephemeral: true,
      });
    if (user.id == interaction.user.id)
      return await interaction.reply({
        content: "You can't kick yourself!",
        ephemeral: true,
      });
    if (
      !member.kickable ||
      member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
    )
      return await interaction.reply({
        content: "I can't kick this member!",
        ephemeral: true,
      });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SUCCESS")
        .setLabel("YES")
        .setCustomId("kick-confirm")
        .setEmoji("👢"),
      new MessageButton()
        .setStyle("DANGER")
        .setLabel("NO")
        .setCustomId("kick-cancel")
        .setEmoji("❌")
    );
    await interaction.reply({
      content:
        "Are you sure you want to kick this member?\nYou have 30 seconds to confirm your action.",
      ephemeral: true,
      components: [row],
    });

    const filter = (btnInt) => {
      return interaction.user.id == btnInt.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      max: 1,
      time: 1000 * 30,
    });

    collector.on("end", async (collection) => {
      if (collection.first()?.customId == "kick-confirm") {
        member.kick({ reason: reason || "No reason provided!" });
        const embed = new MessageEmbed()
          .setColor("YELLOW")
          .setTitle("Member Kicked")
          .setDescription("Successfully kicked that member.")
          .addFields([
            {
              name: "Member",
              value: `<@${user.id}>`,
            },
            {
              name: "Reason",
              value: `${reason || "No reason provided!"}`,
            },
          ]);
        await interaction.editReply({
          content: "The kick was successful.",
          embeds: [embed],
          ephemeral: true,
          components: [],
        });
      } else if (collection.first()?.customId == "kick-cancel") {
        return await interaction.editReply({
          content: "The kick has been cancelled and rejected.",
          ephemeral: true,
          components: [],
        });
      } else {
        return await interaction.editReply({
          content: "You didn't respond in time.",
          ephemeral: true,
          components: [],
        });
      }
    });
  },
};
