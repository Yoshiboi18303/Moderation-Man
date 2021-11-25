const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("steal")
    .setDescription(
      "Steal money from someone (1 in 9 chance of success, if it fails, you lose money)"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to steal from")
        .setRequired(true)
    ),
  config: {
    timeout: ms("5m"),
    message: "Your stealing is getting ridiculous.",
  },
  async execute(interaction) {
    /*
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This server is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
        ephemeral: true,
      });
    */
    var user = interaction.options.getUser("user");
    if (user.id == interaction.user.id) {
      const nope_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Error")
        .setDescription(
          `${emojis.nope} **-** You can't steal from yourself, like, how the fuck does that make sense?`
        );
      return await interaction.reply({
        embeds: [nope_embed],
      });
    }
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `${emojis.nope} **-** You don't have any data!\nRun \`/start\` to get some!`
          );
        return await interaction.reply({
          embeds: [no_data_embed],
        });
      } else {
        await interaction.deferReply();
        var interaction_user_data = data;
        var interaction_user_coins = interaction_user_data.coins;
        if (interaction_user_coins < 750)
          return await interaction.editReply({
            content:
              "You can't steal from anyone unless you have 750 coins, sorry not sorry.",
          });
        Profiles.findOne({ id: user.id }, async (err, data) => {
          if (err) throw err;
          if (!data) {
            const no_data_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `${emojis.nope} **-** ${user.username} doesn't have any data, so you can't steal from them!`
              );
            return await interaction.editReply({
              embeds: [no_data_embed],
            });
          } else {
            var user_data = data;
            var user_coins = user_data.coins;
            if (user_coins < 750)
              return await interaction.editReply({
                content: `You can't steal from ${user.username} until they have 750 coins, sorry not sorry.`,
              });
            if (interaction.user.id == config.bot.owner) {
              var chance = Math.random() > 0.5;
            } else {
              var chance = Math.random() > 0.9;
            }
            const confirm_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("Confirmation")
              .setDescription(
                `You are about to steal from **${
                  user.username
                }**, if you confirm, you will have a 1 in 9 chance ${
                  interaction.user.id == config.bot.owner
                    ? "(Since you're the owner, you'll have a 1 in 5 chance instead.)"
                    : ""
                } to win, if it fails, you'll lose money!\n\n-----\n\n**Are you sure you want to steal from this user?**`
              );

            const confirm_row = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("YES")
                .setCustomId("steal-confirm")
                .setEmoji("💰")
                .setDisabled(false),
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("NO")
                .setCustomId("steal-cancel")
                .setEmoji("❌")
                .setDisabled(false)
            );

            await interaction.editReply({
              embeds: [confirm_embed],
              components: [confirm_row],
            });

            const filter = (btnInt) => {
              return (
                interaction.commandName === "steal" &&
                interaction.user.id === btnInt.user.id
              );
            };

            const collector =
              interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
              });

            collector.on("end", async (collection) => {
              if (collection.first()?.customId === "steal-confirm") {
                await collection.first()?.deferUpdate();
                const disabled_row = new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle(`${chance == true ? "SUCCESS" : "DANGER"}`)
                    .setLabel("YES")
                    .setCustomId("disabled-selected-steal-confirm")
                    .setEmoji("💰")
                    .setDisabled(true),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel("NO")
                    .setCustomId("disabled-steal-cancel")
                    .setEmoji("❌")
                    .setDisabled(true)
                );
                var money_stolen = Math.floor(Math.random() * (user_coins / 4));
                var apology_money = Math.floor(
                  Math.random() * ((interaction_user_coins + 2) / 10)
                );
                if (chance == true) {
                  user_data = await Profiles.findOneAndUpdate(
                    {
                      id: user.id,
                    },
                    {
                      $set: {
                        coins: user_coins - money_stolen,
                      },
                    }
                  );
                  data = await Profiles.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $inc: {
                        coins: money_stolen,
                      },
                    }
                  );
                  user_data.save();
                  data.save();
                  const successful_steal_embed = new MessageEmbed()
                    .setColor(colors.green)
                    .setAuthor(
                      `${interaction.user.username}'s successful steal from ${user.username}`
                    )
                    .setDescription(
                      `You have successfully stolen ${money_stolen} coins from ${
                        user.username
                      }! Well done!\n\n-----\n\n**You now have ${
                        interaction_user_coins + money_stolen
                      } while they have ${
                        user_coins - money_stolen
                      } coins left.**`
                    )
                    .setTimestamp();
                  await collection.first()?.editReply({
                    embeds: [successful_steal_embed],
                    components: [disabled_row],
                  });
                  const stolen_from_embed = new MessageEmbed()
                    .setColor(colors.yellow)
                    .setTitle("You were stolen from!")
                    .setDescription(
                      `You have been stolen from by ${
                        interaction.user.username
                      } in ${
                        interaction.guild.name
                      }!\nYou just lost ${money_stolen} coins! Your current balance is: ${
                        user_coins - money_stolen
                      }`
                    )
                    .setTimestamp();
                  user
                    .send({
                      embeds: [stolen_from_embed],
                    })
                    .catch(() => {
                      return;
                    });
                } else {
                  user_data = await Profiles.findOneAndUpdate(
                    {
                      id: user.id,
                    },
                    {
                      $inc: {
                        coins: apology_money,
                      },
                    }
                  );
                  data = await Profiles.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $set: {
                        coins: interaction_user_coins - apology_money,
                      },
                    }
                  );
                  user_data.save();
                  data.save();
                  const failed_steal_embed = new MessageEmbed()
                    .setColor(colors.red)
                    .setAuthor(
                      `${interaction.user.username}'s failed steal from ${user.username}`
                    )
                    .setDescription(
                      `You failed to steal from ${
                        user.username
                      } and had to give them ${apology_money} coins as an apology. I warned you about this.\n\n-----\n\n**You now have ${
                        interaction_user_coins - apology_money
                      } coins left, while they have ${
                        user_coins + apology_money
                      } coins.**`
                    )
                    .setTimestamp();
                  await collection.first()?.editReply({
                    embeds: [failed_steal_embed],
                    components: [disabled_row],
                  });
                  const almost_stolen_from_embed = new MessageEmbed()
                    .setColor(colors.yellow)
                    .setTitle("You were almost stolen from!")
                    .setDescription(
                      `You almost got stolen from by ${interaction.user.username}, but they failed. So you just got ${apology_money} coins from them!`
                    );
                  await user
                    .send({
                      embeds: [almost_stolen_from_embed],
                    })
                    .catch(() => {
                      return;
                    });
                }
              } else {
                const cancelled_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setTitle("Cancelled")
                  .setDescription(
                    `The steal from ${user.username} has been cancelled.`
                  );
                return await collection.first()?.update({
                  embeds: [cancelled_embed],
                  components: [],
                });
              }
            });
          }
        });
      }
    });
  },
};
