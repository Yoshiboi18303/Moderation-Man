const { SlashCommandBuilder } = require("@discordjs/builders");
const CountingSystems = require("../../schemas/countSysSchema");
const { MessageActionRow, MessageButton, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delcountsys")
    .setDescription("Delete your counting system"),
  config: {
    timeout: ms("10s"),
    message: "Calm it down on the deletions.",
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return await interaction.reply({
        content: "You can't use this command due to poor permissions!",
      });
    CountingSystems.findOne(
      { guild: interaction.guild.id },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
          return await interaction.reply({
            content: "There's not a counting system for this server",
            ephemeral: true,
          });
        } else {
          var confirm_row = new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("DANGER")
              .setLabel("YES")
              .setCustomId("del-count-yes"),
            new MessageButton()
              .setStyle("DANGER")
              .setLabel("NO")
              .setCustomId("del-count-no")
          );
          await interaction.reply({
            content:
              "You are about to delete your counting system, are you sure you want to complete this?\n\n**This can be reset by running `/setupcountsys`**",
            components: [confirm_row],
          });

          const filter = (btnInt) => {
            return interaction.user.id == btnInt.user.id;
          };

          const collector = interaction.channel.createMessageComponentCollector(
            {
              filter,
              max: 1,
            }
          );

          collector.on("end", async (collection) => {
            var first = collection.first();
            if (first?.customId == "del-count-yes") {
              data = await CountingSystems.findOneAndUpdate(
                {
                  guild: interaction.guild.id,
                },
                {
                  $set: {
                    channel: "",
                    currentNumber: 0,
                    nextNumber: 1,
                    lastNumUser: "",
                  },
                }
              );
              data.save();
              await first?.update({
                content: "Your counting system has been deleted.",
                components: [],
              });
            } else {
              await first?.update({
                content: "Deletion cancelled.",
                components: [],
              });
            }
          });
        }
      }
    );
  },
};
