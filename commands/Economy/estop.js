const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("estop")
    .setDescription("Delete your data from the Economy System!"),
  async execute(interaction) {
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            "You don't have any data on this bot! Please run `/start` to get some data on this bot!"
          )
          .setFooter(
            `${interaction.user.username} needs some data lmao.`,
            interaction.user.displayAvatarURL({ dynamic: true, size: 32 })
          )
          .setTimestamp();
        return await interaction.reply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        var row = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("DANGER")
            .setLabel("YES")
            .setCustomId("delete-confirm")
            .setEmoji("🗑️"),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("NO")
            .setCustomId("delete-cancel")
            .setEmoji("🎉")
        );
        await interaction.reply({
          content:
            "Are you sure you want to delete **ALL** your data?\nThis cannot be undone!",
          ephemeral: true,
          components: [row],
        });

        const filter = (btnInt) => {
          return interaction.user.id == btnInt.user.id;
        };

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          max: 1,
        });

        collector.on("end", async (collection) => {
          if (collection.first()?.customId === "delete-confirm") {
            await interaction.editReply({
              content: "Deleting data...",
              ephemeral: true,
              components: [],
            });
            data = await Profiles.findOneAndDelete({ id: interaction.user.id });
            await wait(5000);
            await interaction.editReply({
              content: "Data deleted!",
              ephemeral: true,
            });
          } else if (collection.first()?.customId === "delete-cancel") {
            await interaction.editReply({
              content: "Data deletion cancelled.",
              ephemeral: true,
              components: [],
            });
          }
        });
      }
    });
  },
};
