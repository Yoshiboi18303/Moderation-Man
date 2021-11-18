const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("highlow")
    .setDescription(
      "Guess if the number the bot is thinking of is higher or lower"
    ),
  async execute(interaction) {
    /*
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment.`,
        ephemeral: true,
      });
    */
    var number_thought_of = Math.floor(Math.random() * 101);
    if (number_thought_of == 0) number_thought_of = 1;
    var hint = Math.floor(Math.random() * 101 - Math.random());

    const guess_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setAuthor(
        `${interaction.user.username} highlow game`,
        interaction.user.displayAvatarURL({
          dynamic: false,
          format: "png",
          size: 96,
        })
      )
      .setDescription(
        `I just thought of a secret number between 1 and 100\nIs the secret number I'm thinking of *higher* or *lower* than ${hint}?`
      )
      .setFooter("Same button if you think it's the same");

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Lower")
        .setCustomId("secret-number-lower")
        .setDisabled(false),
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Same")
        .setCustomId("secret-number-same")
        .setDisabled(false),
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Higher")
        .setCustomId("secret-number-higher")
        .setDisabled(false)
    );

    await interaction.reply({
      embeds: [guess_embed],
      components: [row],
    });

    const filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      max: 1,
    });

    collector.on("end", async (collection) => {
      try {
        Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
          await collection.first()?.deferUpdate();
          var winning_money = Math.floor(Math.random() * 350) + 7;
          if (err) throw err;
          if (!data) {
            const no_data_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `${emojis.nope} **-** You don't have any data on the bot!\nRun \`/start\` to get some!`
              );
            return await collection.first()?.editReply({
              embeds: [no_data_embed],
              components: [],
            });
          } else {
            var coins = data.coins;
            if (collection.first()?.customId === "secret-number-lower") {
              var disabled_row = new MessageActionRow().addComponents(
                new MessageButton()
                  .setStyle("PRIMARY")
                  .setLabel("Lower")
                  .setCustomId("disabled-selected-secret-number-lower")
                  .setDisabled(true),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Same")
                  .setCustomId("disabled-secret-number-same")
                  .setDisabled(true),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Higher")
                  .setCustomId("disabled-secret-number-higher")
                  .setDisabled(true)
              );
              if (number_thought_of < hint) {
                data = await Profiles.findOneAndUpdate(
                  {
                    id: interaction.user.id,
                  },
                  {
                    $inc: {
                      coins: winning_money,
                    },
                  }
                );
                data.save();
                const win_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setAuthor(
                    `${interaction.user.username}s' winning highlow game`
                  )
                  .setDescription(
                    `${
                      emojis.yes
                    } **-** You are correct! The number I was thinking of was ${number_thought_of}\nYou won ${winning_money} coins!\n\n-----\n\n**You now have ${
                      coins + winning_money
                    } coins in your balance!**`
                  )
                  .setTimestamp();
                await collection.first()?.editReply({
                  embeds: [win_embed],
                  components: [disabled_row],
                });
              } else {
                const loss_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setAuthor(
                    `${interaction.user.username}s' losing highlow game`
                  )
                  .setDescription(
                    `${emojis.nope} **-** You are incorrect. The correct number was ${number_thought_of}.\n\n-----\n\n**You still have ${coins} coins in your balance.**`
                  )
                  .setTimestamp();
                await collection.first()?.editReply({
                  embeds: [loss_embed],
                  components: [disabled_row],
                });
              }
            } else if (collection.first()?.customId === "secret-number-same") {
              var disabled_row = new MessageActionRow().addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Lower")
                  .setCustomId("disabled-secret-number-lower")
                  .setDisabled(true),
                new MessageButton()
                  .setStyle("PRIMARY")
                  .setLabel("Same")
                  .setCustomId("disabled-selected-secret-number-same")
                  .setDisabled(true),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Higher")
                  .setCustomId("disabled-secret-number-higher")
                  .setDisabled(true)
              );
              if (number_thought_of == hint) {
                data = await Profiles.findOneAndUpdate(
                  {
                    id: interaction.user.id,
                  },
                  {
                    $inc: {
                      coins: winning_money,
                    },
                  }
                );
                data.save();
                const win_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setAuthor(
                    `${interaction.user.username}s' winning highlow game`
                  )
                  .setDescription(
                    `${
                      emojis.yes
                    } **-** You are correct! The secret number I was thinking of was ${number_thought_of}.\nYou won ${winning_money} coins!\n\n-----\n\n**You now have ${
                      coins + winning_money
                    } coins in your balance!**`
                  )
                  .setTimestamp();
                await collection.first()?.editReply({
                  embeds: [win_embed],
                  components: [disabled_row],
                });
              } else {
                const loss_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setAuthor(
                    `${interaction.user.username}s' losing highlow game`
                  )
                  .setDescription(
                    `${emojis.nope} **-** You are incorrect. The correct number was ${number_thought_of}.\n\n-----\n\n**You still have ${coins} coins in your balance.**`
                  )
                  .setTimestamp();
                await collection.first()?.editReply({
                  embeds: [loss_embed],
                  components: [disabled_row],
                });
              }
            } else {
              var disabled_row = new MessageActionRow().addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Lower")
                  .setCustomId("disabled-secret-number-lower")
                  .setDisabled(true),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Same")
                  .setCustomId("disabled-secret-number-same")
                  .setDisabled(true),
                new MessageButton()
                  .setStyle("PRIMARY")
                  .setLabel("Higher")
                  .setCustomId("disabled-selected-secret-number-higher")
                  .setDisabled(true)
              );
              if (number_thought_of > hint) {
                data = await Profiles.findOneAndUpdate(
                  {
                    id: interaction.user.id,
                  },
                  {
                    $inc: {
                      coins: winning_money,
                    },
                  }
                );
                data.save();
                const win_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setAuthor(
                    `${interaction.user.username}s' winning highlow game`
                  )
                  .setDescription(
                    `${
                      emojis.yes
                    } **-** You are correct! The secret number I was thinking of was ${number_thought_of}.\nYou won ${winning_money} coins!\n\n-----\n\n**You now have ${
                      coins + winning_money
                    } coins in your balance!**`
                  )
                  .setTimestamp();
                await collection.first()?.editReply({
                  embeds: [win_embed],
                  components: [disabled_row],
                });
              } else {
                const loss_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setAuthor(
                    `${interaction.user.username}s' losing highlow game`
                  )
                  .setDescription(
                    `${emojis.nope} **-** You are incorrect. The correct number was ${number_thought_of}.\n\n-----\n\n**You still have ${coins} coins in your balance.**`
                  )
                  .setTimestamp();
                await collection.first()?.editReply({
                  embeds: [loss_embed],
                  components: [disabled_row],
                });
              }
            }
          }
        });
      } catch (e) {
        console.error(e);
        if (collection.first()?.replied || collection.first?.deferred) {
          await collection.first()?.editReply({
            content:
              "There was an error, this has been reported to the developers.",
          });
        } else {
          await collection.first()?.update({
            content:
              "There was an error, this has been reported to the developers.",
            ephemeral: true,
          });
        }
      }
    });
  },
};
