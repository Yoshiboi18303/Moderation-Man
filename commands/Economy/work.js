const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");
const Users = require("../../schemas/userSchema");

var jobs = ["Bot Developer", "Cashier", "Chef", "Moderator"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to make money!"),
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
    */
    var random_job = jobs[Math.floor(Math.random() * jobs.length)];
    await interaction.deferReply();
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
        return await interaction.editReply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        var money_earned = Math.floor(Math.random() * 300) + 5;
        var money_earned_half = Math.floor(money_earned / 2);
        switch (random_job) {
          case "Bot Developer":
            var intents_items = [
              "[Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]",
              "32727",
              "[Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS]",
            ];
            var intent_item =
              intents_items[Math.floor(Math.random() * intents_items.length)];
            var codes = [
              `const Discord = require(\"discord.js\"); const bot = new Discord.Client({ intents: ${intent_item} }); console.log(bot);`,
              'module.exports = { help: { name: "grerer", description: "feefwtg" } }',
              'const mongoose = require("mongoose"); (async () => { await mongoose.connect(process.env.MONGO_CS, { useUnifiedTopology: true, useNewUrlParser: true }) })()',
            ];
            var code_to_type = codes[Math.floor(Math.random() * codes.length)];
            var mini_game_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("Mini Game Time!")
              .setDescription(
                `Please type this in the chat: \`\`\`\n${code_to_type}\n\`\`\`\n\n**You have 2 minutes to do so.**`
              );
            await interaction.editReply({
              embeds: [mini_game_embed],
            });
            var filter = (msg) => {
              return interaction.user.id === msg.author.id;
            };
            var collector = interaction.channel.createMessageCollector({
              filter,
              max: 1,
              time: 1000 * 120,
            });
            collector.on("end", async (collection) => {
              if (collection.first()?.content == code_to_type) {
                const correct_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setTitle("Excellent Work!")
                  .setDescription(
                    `You coded a bot and earned $${money_earned} coins for an excellent day of work!`
                  );
                await interaction.followUp({
                  embeds: [correct_embed],
                });
                var coins = data.coins;
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
              } else {
                const incorrect_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setTitle("TERRIBLE Work")
                  .setDescription(
                    `You failed to code a bot and earned $${money_earned_half} coins for a sub-par day of work.`
                  );
                await interaction.followUp({
                  embeds: [incorrect_embed],
                });
                data = await Profiles.findOneAndUpdate(
                  {
                    id: interaction.user.id,
                  },
                  {
                    $inc: {
                      coins: money_earned_half,
                    },
                  }
                );
                data.save();
              }
            });
            break;
          case "Cashier":
            var store_names = [
              "Malwart",
              "Balgreens",
              "Wite-Aid",
              "Larget",
              "APPenney",
              "Kokl's",
              "Mawy's",
              "Smeearrs",
              "PMart",
              "Curlingson",
            ];
            var store_name =
              store_names[Math.floor(Math.random() * store_names.length)];
            var speeches = [
              `Hello! Welcome to ${store_name}, how is your day thus far?`,
              "How was your shopping trip here today?",
              `Hi! Welcome to ${store_name}, have a great shopping trip!`,
              `Bye, thanks for shopping at ${store_name}!`,
            ];
            var speech_to_say =
              speeches[Math.floor(Math.random() * speeches.length)];
            mini_game_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("Mini Game Time!")
              .setDescription(
                `Please put the following message in the chat.\`\`\`\n${speech_to_say}\n\`\`\`\n\n**You have 1 minute & 15 seconds to do so.**`
              );
            await interaction.editReply({
              embeds: [mini_game_embed],
            });

            filter = (msg) => {
              return interaction.user.id == msg.author.id;
            };

            collector = interaction.channel.createMessageCollector({
              filter,
              max: 1,
              time: 1000 * 75,
            });

            collector.on("end", async (collection) => {
              if (collection.first()?.content == speech_to_say) {
                const correct_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setTitle("Excellent Work!")
                  .setDescription(
                    `You were able to attend to many customers in the store correctly and got paid a $${money_earned} salary!`
                  );
                await interaction.followUp({
                  embeds: [correct_embed],
                });
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
              } else {
                const incorrect_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setTitle("TERRIBLE Work")
                  .setDescription(
                    `You spoke to one of the customers in the wrong way and your manager slapped you and gave you half your salary ($${money_earned_half})!`
                  );
                await interaction.followUp({
                  embeds: [incorrect_embed],
                });
                data = await Profiles.findOneAndUpdate(
                  {
                    id: interaction.user.id,
                  },
                  {
                    $inc: {
                      coins: money_earned_half,
                    },
                  }
                );
                data.save();
              }
            });
            break;
          case "Chef":
            var meals = [
              "Burger",
              "Pizza",
              "Hotdog",
              "Taco",
              "Steak",
              "Shortcake",
            ];
            var meal_to_make = meals[Math.floor(Math.random() * meals.length)];
            var meal_to_make_lower = meal_to_make.toLowerCase();
            mini_game_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("Mini Game Time!")
              .setDescription(
                `Emoji Match - Remember this meal: ${meal_to_make}\n\n**You have 2.75 seconds to remember this.**`
              );
            await interaction.editReply({
              embeds: [mini_game_embed],
            });
            var new_mini_game_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("Time To Play!")
              .setDescription(
                `Emoji Match - Now click the button with the emoji corresponding to the meal!`
              );
            const meal_btn_row_1 = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("burger")
                .setEmoji("🍔"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("pizza")
                .setEmoji("🍕"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("hotdog")
                .setEmoji("🌭")
            );
            const meal_btn_row_2 = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("taco")
                .setEmoji("🌮"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("steak")
                .setEmoji("🥩"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("shortcake")
                .setEmoji("🍰")
            );
            setTimeout(async () => {
              await interaction.editReply({
                embeds: [new_mini_game_embed],
                components: [meal_btn_row_1, meal_btn_row_2],
              });

              filter = (btnInt) => {
                return (
                  interaction.commandName == "work" &&
                  interaction.user.id == btnInt.user.id
                );
              };

              collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
              });

              collector.on("end", async (collection) => {
                if (collection.first()?.customId == meal_to_make_lower) {
                  const correct_embed = new MessageEmbed()
                    .setColor(colors.green)
                    .setTitle("Excellent Work!")
                    .setDescription(
                      `You made the correct meal and got rewarded a big tip of $${money_earned} coins!`
                    );
                  await collection.first()?.update({
                    embeds: [correct_embed],
                    components: [],
                  });

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
                } else {
                  const incorrect_embed = new MessageEmbed()
                    .setColor(colors.red)
                    .setTitle("TERRIBLE Work")
                    .setDescription(
                      `You made the wrong meal and the customer threw up all over the floor.\nYour manager came in and slapped you hard across your face and gave you half your salary ($${money_earned_half}).`
                    );
                  await collection.first()?.update({
                    embeds: [incorrect_embed],
                    components: [],
                  });

                  data = await Profiles.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $inc: {
                        coins: money_earned_half,
                      },
                    }
                  );
                  data.save();
                }
              });
            }, 2750);
            break;
          case "Moderator":
            var cases = [
              "A member is spamming in general for the first time, what do you do?",
              "A member is sending images depicting gore in the media chat, what do you do?",
              "A member is screaming in the general VC, what do you do?",
              "A member is showing an inappropriate video via screenshare in a VC, what do you do?",
              "A member is continuously spamming in general despite already being punished twice, what do you do?",
            ];
            var c = cases[Math.floor(Math.random() * cases.length)];
            mini_game_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("Mini Game Time!")
              .setDescription(
                `Okay, for this mini-game, you need to remember what to do as a moderator. Let's get started.\n\n**Starting in 3.75 seconds...**`
              );
            setTimeout(async () => {
              new_mini_game_embed = new MessageEmbed()
                .setColor(colors.yellow)
                .setTitle("Mini Game Time!")
                .setDescription(`${c}`);
              var response_row = new MessageActionRow().addComponents(
                new MessageButton()
                  .setStyle("DANGER")
                  .setLabel("Ban")
                  .setCustomId("case-response-ban")
                  .setEmoji("🔨"),
                new MessageButton()
                  .setStyle("DANGER")
                  .setLabel("Kick")
                  .setCustomId("case-response-kick")
                  .setEmoji("👢"),
                new MessageButton()
                  .setStyle("PRIMARY")
                  .setLabel("Mute")
                  .setCustomId("case-response-mute")
                  .setEmoji("❌"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Warn")
                  .setCustomId("case-response-warn")
                  .setEmoji("⚠")
              );
              await interaction.editReply({
                embeds: [new_mini_game_embed],
                components: [response_row],
              });

              filter = (btnInt) => {
                return interaction.user.id == btnInt.user.id;
              };

              collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
              });

              collector.on("end", async (collection) => {
                if (
                  (collection.first()?.customId == "case-response-ban" &&
                    c == cases[1]) ||
                  (collection.first()?.customId == "case-response-warn" &&
                    c == cases[0]) ||
                  (collection.first()?.customId == "case-response-kick" &&
                    c == cases[4]) ||
                  (collection.first()?.customId == "case-response-ban" &&
                    c == cases[3]) ||
                  (collection.first()?.customId == "case-response-mute" &&
                    c == cases[2])
                ) {
                  const correct_embed = new MessageEmbed()
                    .setColor(colors.green)
                    .setTitle("Excellent Work!")
                    .setDescription(
                      `You handled a moderator's responsibilty correctly and earned $${money_earned} coins from the owner as a thanks!`
                    );
                  await interaction.editReply({
                    embeds: [correct_embed],
                    components: [],
                  });
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
                } else {
                  const incorrect_embed = new MessageEmbed()
                    .setColor(colors.red)
                    .setTitle("TERRIBLE work")
                    .setDescription(
                      `You failed to handle a moderator's responsibilty correctly and the criminal got away.\n**The owner of the server punched his monitor in rage and sent you half your salary ($${money_earned_half}).**`
                    );
                  await interaction.editReply({
                    embeds: [incorrect_embed],
                    components: [],
                  });
                  data = await Profiles.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $inc: {
                        coins: money_earned_half,
                      },
                    }
                  );
                  data.save();
                }
              });
            }, 3750);
            break;
        }
      }
    });
  },
};
