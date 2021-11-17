const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crime")
    .setDescription("Commit a crime for money"),
  async execute(interaction) {
    /*
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
        ephemeral: true,
      });
    */
    var crimes = [
      "Fraud",
      "Identity Theft",
      "Murder",
      "Shoplifting",
      "Drug Distribution",
      "Cyber Bullying",
      "Tax Evasion",
      "Arson",
      "Boredom",
      "Insurance Fraud",
      "Kidnapping",
      "Robbery",
    ];

    async function getFirstCrime() {
      var first_crime = crimes[Math.floor(Math.random() * crimes.length)];
      await crimes.pop(first_crime);
      return first_crime;
    }

    async function getSecondCrime() {
      var second_crime = crimes[Math.floor(Math.random() * crimes.length)];
      await crimes.pop(second_crime);
      return second_crime;
    }

    async function getThirdCrime() {
      var third_crime = crimes[Math.floor(Math.random() * crimes.length)];
      await crimes.pop(third_crime);
      return third_crime;
    }

    var first = await getFirstCrime();
    var second = await getSecondCrime();
    var third = await getThirdCrime();

    var row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel(`${first}`)
        .setCustomId("first-crime")
        .setDisabled(false),
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel(`${second}`)
        .setCustomId("second-crime")
        .setDisabled(false),
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel(`${third}`)
        .setCustomId("third-crime")
        .setDisabled(false)
    );

    const what_crime_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setTitle("Crime Time!")
      .setDescription(
        "What crime do you want to commit?\n**Choose a button below**"
      );

    var chance = Math.random() > 0.65;
    var money_earned = Math.floor(Math.random() * 600) + 5;

    await interaction.reply({
      embeds: [what_crime_embed],
      components: [row],
    });

    const filter = async (btnInt) => {
      return interaction.user.id === btnInt.user.id;
      // Example: "697414293712273408" === "697414293712273408"
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      max: 1,
    });

    collector.on("end", async (collection) => {
      if (collection.first()?.customId === "first-crime") {
        var disabled_row = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel(`${first}`)
            .setCustomId("disabled-selected-first-crime")
            .setDisabled(true),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${second}`)
            .setCustomId("disabled-second-crime")
            .setDisabled(true),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${third}`)
            .setCustomId("disabled-third-crime")
            .setDisabled(true)
        );
        if (chance == true) {
          Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
              const no_data_embed = new MessageEmbed()
                .setColor(colors.red)
                .setTitle("Error")
                .setDescription(
                  "You don't have any data in the Economy system!\nYou can get some by running `/start` though!"
                );
              return await interaction.editReply({
                embeds: [no_data_embed],
                components: [],
              });
            } else {
              data = await Profiles.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $inc: {
                    coins: money_earned,
                  },
                }
              );
              data.save();
            }
          });
          const crime_commited_embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(
              `${interaction.user.username} commited ${first.toUpperCase()}`
            )
            .setDescription(
              `You commited ${first.toLowerCase()} successfully and earned ${money_earned} coins!`
            )
            .setTimestamp();
          await collection.first()?.update({
            embeds: [crime_commited_embed],
            components: [disabled_row],
          });
        } else {
          const crime_failed_embed = new MessageEmbed()
            .setColor(colors.red)
            .setAuthor(
              `${
                interaction.user.username
              } tried to commit ${first.toUpperCase()}`
            )
            .setDescription(
              `You tried to commit ${first.toLowerCase()}, but failed in doing so.\nYou earned: **NOTHING.**`
            )
            .setFooter("Imagine being so bad.")
            .setTimestamp();
          await collection.first()?.update({
            embeds: [crime_failed_embed],
            components: [disabled_row],
          });
        }
      } else if (collection.first()?.customId === "second-crime") {
        var disabled_row = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${first}`)
            .setCustomId("disabled-first-crime")
            .setDisabled(true),
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel(`${second}`)
            .setCustomId("disabled-selected-second-crime")
            .setDisabled(true),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${third}`)
            .setCustomId("disabled-third-crime")
            .setDisabled(true)
        );
        if (chance == true) {
          Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
              const no_data_embed = new MessageEmbed()
                .setColor(colors.red)
                .setTitle("Error")
                .setDescription(
                  "You don't have any data in the Economy system!\nYou can get some by running `/start` though!"
                );
              return await interaction.editReply({
                embeds: [no_data_embed],
                components: [],
              });
            } else {
              data = await Profiles.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $inc: {
                    coins: money_earned,
                  },
                }
              );
              data.save();
            }
          });
          const crime_commited_embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(
              `${interaction.user.username} commited ${second.toUpperCase()}`
            )
            .setDescription(
              `You commited ${second.toLowerCase()} successfully and earned ${money_earned} coins!`
            )
            .setTimestamp();
          await collection.first()?.update({
            embeds: [crime_commited_embed],
            components: [disabled_row],
          });
        } else {
          const crime_failed_embed = new MessageEmbed()
            .setColor(colors.red)
            .setAuthor(
              `${
                interaction.user.username
              } tried to commit ${second.toUpperCase()}`
            )
            .setDescription(
              `You tried to commit ${second.toLowerCase()}, but failed in doing so.\nYou earned: **NOTHING.**`
            )
            .setFooter(`Imagine being so bad.`)
            .setTimestamp();
          await collection.first()?.update({
            embeds: [crime_failed_embed],
            components: [disabled_row],
          });
        }
      } else {
        var disabled_row = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${first}`)
            .setCustomId("disabled-first-crime")
            .setDisabled(true),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel(`${second}`)
            .setCustomId("disabled-second-crime")
            .setDisabled(true),
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel(`${third}`)
            .setCustomId("disabled-selected-third-crime")
            .setDisabled(true)
        );
        if (chance == true) {
          Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
              const no_data_embed = new MessageEmbed()
                .setColor(colors.red)
                .setTitle("Error")
                .setDescription(
                  "You don't have any data in the Economy system!\nYou can get some by running `/start` though!"
                );
              return await interaction.editReply({
                embeds: [no_data_embed],
                components: [],
              });
            } else {
              data = await Profiles.findOneAndUpdate(
                {
                  id: interaction.user.id,
                },
                {
                  $inc: {
                    coins: money_earned,
                  },
                }
              );
              data.save();
            }
          });
          const crime_commited_embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(
              `${interaction.user.username} commited ${third.toUpperCase()}`
            )
            .setDescription(
              `You commited ${third.toLowerCase()} successfully and earned ${money_earned} coins!`
            )
            .setTimestamp();
          await collection.first()?.update({
            embeds: [crime_commited_embed],
            components: [disabled_row],
          });
        } else {
          const crime_failed_embed = new MessageEmbed()
            .setColor(colors.red)
            .setAuthor(
              `${
                interaction.user.username
              } tried to commit ${third.toUpperCase()}`
            )
            .setDescription(
              `You tried to commit ${third.toLowerCase()}, but failed in doing so.\nYou earned: **NOTHING.**`
            )
            .setFooter("Imagine being so bad.")
            .setTimestamp();
          await collection.first()?.update({
            embeds: [crime_failed_embed],
            components: [disabled_row],
          });
        }
      }
    });
  },
};
