const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");

var things = ["Discord Bot", "Website", "Game"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("develop")
    .setDescription("Develop something (requires a computer)"),
  config: {
    timeout: ms("2m"),
    message: "You can't just run through computers like they're toilet paper!",
  },
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
      } else if (
        data.items.computers == 0 ||
        typeof data.items.computers == "undefined"
      ) {
        const bad_item_count_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            "You don't have any computers!\nPlease ask `Yoshiboi18303#4045` for one (shop coming soon)!"
          )
          .setFooter(
            `${interaction.user.username} needs a computer lmao.`,
            interaction.user.displayAvatarURL({ dynamic: true, size: 32 })
          )
          .setTimestamp();
        return await interaction.reply({
          embeds: [bad_item_count_embed],
          ephemeral: true,
        });
      } else {
        var cpus = data.items.computers;
        var earnings = Math.floor(Math.random() * 750) + 8;
        var thing = things[Math.floor(Math.random() * things.length)];
        data = await Profiles.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $inc: {
              coins: earnings,
            },
            $set: {
              items: {
                computers: cpus - 1,
              },
            },
          }
        );
        data.save();
        const success_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Success!")
          .setDescription(
            `You have successfully developed a ${thing} and earned ${earnings} coins after a few days!\nSadly.. the computer you were using blew up shortly after the release...`
          );
        await interaction.reply({ embeds: [success_embed], ephemeral: true });
      }
    });
  },
};
