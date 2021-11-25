const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search somewhere!"),
  config: {
    timeout: ms("50s"),
    message: "Your search exhibition can wait.",
  },
  async execute(interaction) {
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
        ephemeral: true,
      });
    await interaction.deferReply();
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `${emojis.nope} **-** You don't have any data on the bot!\nRun \`/start\` to get some!`
          );
        return await interaction.editReply({
          embeds: [no_data_embed],
        });
      } else {
        var coins = data.coins;

        const select_embed = new MessageEmbed()
          .setColor(colors.yellow)
          .setAuthor(`${interaction.user.username}'s Search`)
          .setDescription(
            "What do you want to search?\n**Please click a button below to start searching that location.**"
          );

        var places_to_search = [
          "Bathtub",
          "Basement",
          "Van",
          "Air",
          "Grocery Store",
          "Sidewalk",
          "Sewer",
          "Fridge",
          "Garage",
          "Crawlspace",
          "Attic",
        ];

        var first_place =
          places_to_search[Math.floor(Math.random() * places_to_search.length)];
        await places_to_search.splice(
          places_to_search.findIndex((item) => item == first_place),
          1
        );

        var second_place =
          places_to_search[Math.floor(Math.random() * places_to_search.length)];
        await places_to_search.splice(
          places_to_search.findIndex((item) => item == second_place)
        );

        var third_place =
          places_to_search[Math.floor(Math.random() * places_to_search.length)];

        const searching_places_row = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${first_place}`)
            .setCustomId("first-place"),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${second_place}`)
            .setCustomId("second-place"),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${third_place}`)
            .setCustomId("third-place")
        );

        await interaction.editReply({
          embeds: [select_embed],
          components: [searching_places_row],
        });

        const filter = (btnInt) => {
          return (
            interaction.commandName == "search" &&
            interaction.user.id == btnInt.user.id
          );
        };

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          max: 1,
        });

        collector.on("end", async (collection) => {
          await collection.first()?.deferUpdate();
          var chance = Math.random() > 0.5;
          var random_coins = Math.floor(Math.random() * 400) + 5;
          if (collection.first()?.customId == "first-place") {
            var disabled_row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel(`${first_place}`)
                .setCustomId("disabled-selected-first-place")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel(`${second_place}`)
                .setCustomId("disabled-second-place")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel(`${third_place}`)
                .setCustomId("disabled-third-place")
                .setDisabled(true)
            );
            if (chance == true) {
              data = await Profiles.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $inc: {
                    coins: random_coins,
                  },
                }
              );
              data.save();
              const successful_search_embed = new MessageEmbed()
                .setColor(colors.green)
                .setAuthor(`${interaction.user.username}'s Successful Search`)
                .setDescription(
                  `You went along and searched the **${first_place}** and found **${random_coins}** coins along your search.\n\n-----\n\n**You now have ${
                    coins + random_coins
                  } coins in your balance.**`
                );
              await collection.first()?.editReply({
                embeds: [successful_search_embed],
                components: [disabled_row],
              });
            } else {
              const failed_search_embed = new MessageEmbed()
                .setColor(colors.red)
                .setAuthor(`${interaction.user.username}'s Failed Search`)
                .setDescription(
                  `You went along and searched the **${first_place}** but found nothing while searching every nook and cranny.\n\n-----\n\n**You still have ${coins} coins in your balance.**`
                );
              await collection.first()?.editReply({
                embeds: [failed_search_embed],
                components: [disabled_row],
              });
            }
          } else if (collection.first()?.customId == "second-place") {
            var disabled_row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel(`${first_place}`)
                .setCustomId("disabled-first-place")
                .setDisabled(true),
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel(`${second_place}`)
                .setCustomId("disabled-selected-second-place")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel(`${third_place}`)
                .setCustomId("disabled-third-place")
                .setDisabled(true)
            );
            if (chance == true) {
              data = await Profiles.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $inc: {
                    coins: random_coins,
                  },
                }
              );
              data.save();
              const successful_search_embed = new MessageEmbed()
                .setColor(colors.green)
                .setAuthor(`${interaction.user.username}'s Successful Search`)
                .setDescription(
                  `You went along and searched the **${second_place}** and found **${random_coins}** coins along your search.\n\n-----\n\n**You now have ${
                    coins + random_coins
                  } coins in your balance.**`
                );
              await collection.first()?.editReply({
                embeds: [successful_search_embed],
                components: [disabled_row],
              });
            } else {
              const failed_search_embed = new MessageEmbed()
                .setColor(colors.red)
                .setAuthor(`${interaction.user.username}'s Failed Search`)
                .setDescription(
                  `You went along and searched the **${second_place}** but found nothing while searching every nook and cranny.\n\n-----\n\n**You still have ${coins} coins in your balance.**`
                );
              await collection.first()?.editReply({
                embeds: [failed_search_embed],
                components: [disabled_row],
              });
            }
          } else {
            var disabled_row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel(`${first_place}`)
                .setCustomId("disabled-first-place")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel(`${second_place}`)
                .setCustomId("disabled-second-place")
                .setDisabled(true),
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel(`${third_place}`)
                .setCustomId("disabled-selected-third-place")
                .setDisabled(true)
            );
            if (chance == true) {
              data = await Profiles.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $inc: {
                    coins: random_coins,
                  },
                }
              );
              data.save();
              const successful_search_embed = new MessageEmbed()
                .setColor(colors.green)
                .setAuthor(`${interaction.user.username}'s Successful Search`)
                .setDescription(
                  `You went along and searched the **${third_place}** and found **${random_coins}** coins along your search.\n\n-----\n\n**You now have ${
                    coins + random_coins
                  } coins in your balance.**`
                );
              await collection.first()?.editReply({
                embeds: [successful_search_embed],
                components: [disabled_row],
              });
            } else {
              const failed_search_embed = new MessageEmbed()
                .setColor(colors.red)
                .setAuthor(`${interaction.user.username}'s Failed Search`)
                .setDescription(
                  `You went along and searched the **${third_place}** but found nothing while searching every nook and cranny.\n\n-----\n\n**You still have ${coins} coins in your balance.**`
                );
              await collection.first()?.editReply({
                embeds: [failed_search_embed],
                components: [disabled_row],
              });
            }
          }
        });
      }
    });
  },
};
