const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");
// const Users = require("../../schemas/userSchema");
const wait = require("util").promisify(setTimeout);

var jobs = [
  "Bot Developer",
  "Cashier",
  "Chef",
  "Moderator" /*"Game Tester",
  "Artist"*/,
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to make money!"),
  config: {
    timeout: ms("5m"),
    message: "You've worked recently, you really should rest.",
  },
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
              "Object.values(Discord.Intents.FLAGS)",
            ];
            var intent_item =
              intents_items[Math.floor(Math.random() * intents_items.length)];
            var command_names = ["play", "execution", "bite", "steal"];
            var command_descs = [
              "sdasdsas",
              "This is a command description",
              "Use this command now",
              "Haters keep on drooling",
            ];
            var command_name =
              command_names[Math.floor(Math.random() * command_names.length)];
            var command_desc =
              command_descs[Math.floor(Math.random() * command_descs.length)];
            var codes = [
              `const Discord = require(\"discord.js\"); const bot = new Discord.Client({ intents: ${intent_item} }); console.log(bot);`,
              `module.exports = { help: { name: "${command_name}", description: "${command_desc}" } }`,
              'const mongoose = require("mongoose"); (async () => { await mongoose.connect(process.env.MONGO_CS, { useUnifiedTopology: true, useNewUrlParser: true }) })()',
            ];
            var code_to_type = codes[Math.floor(Math.random() * codes.length)];
            mini_game_embed = new MessageEmbed()
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
              "Salad",
              "Pie",
              "Fries",
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
            const meal_btn_row_3 = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("salad")
                .setEmoji("🥗"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("pie")
                .setEmoji("🥧"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("fries")
                .setEmoji("🍟")
            );
            setTimeout(async () => {
              await interaction.editReply({
                embeds: [new_mini_game_embed],
                components: [meal_btn_row_1, meal_btn_row_2, meal_btn_row_3],
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
                      `You made the wrong meal and the customer threw up all over the floor.\nYour manager came in and slapped you hard across your face and gave you half your salary ($${money_earned_half}).\n\n||You clicked the ${
                        collection.first()?.customId
                      } button, but you were asked to click the ${meal_to_make_lower} button.||`
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
                /*
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Hint")
                  .setCustomId("case-hint")
                  .setEmoji("❓")
                */
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
                } else if (collection.first()?.customId == "case-hint") {
                  if (c == cases[0] || c == cases[4]) {
                    const hint_embed = new MessageEmbed()
                      .setColor(colors.cyan)
                      .setTitle("Here's a Hint")
                      .setDescription(
                        "The current moderation actions go in this order: `Warn`, `Mute`, `Kick`, then `Ban`\n\n**Hope that helped you!**"
                      );
                    await interaction.followUp({
                      embeds: [hint_embed],
                      ephemeral: true,
                    });
                  } else {
                    await interaction.followUp({
                      content: "You don't need a hint for this.",
                      ephemeral: true,
                    });
                  }
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
          /*
          case "Game Tester":
            const words = ["Gameplay", "Fun", "Testing", "Playing", "Starting", "Develop", "Bad", "Good", "Eh"]

            var word_1 = words[Math.floor(Math.random() * words.length)]

            words.splice(words.findIndex((item) => item == word_1), 1)

            var word_2 = words[Math.floor(Math.random() * words.length)]

            words.splice(words.findIndex((item) => item == word_2), 1)

            var word_3 = words[Math.floor(Math.random() * words.length)]

            words.splice(words.findIndex((item) => item == word_3), 1)
            
            var word_4 = words[Math.floor(Math.random() * words.length)]

            words.splice(words.findIndex((item) => item == word_4), 1)

            var word_5 = words[Math.floor(Math.random() * words.length)]

            words.splice(words.findIndex((item) => item == word_5), 1)

            console.log(word_1, word_2, word_3, word_4, word_5)

            mini_game_embed = new MessageEmbed()
              .setColor(colors.yellow)
              .setTitle("Mini Game Time!")
              .setDescription(`Remember these words.\n\n\`\`\`\n${word_1}\n${word_2}\n${word_3}\n${word_4}\n${word_5}\n\`\`\`\n\n**You have 3 seconds to remember these 5 words.**`)
            await interaction.editReply({
              embeds: [mini_game_embed]
            })
            setTimeout(async () => {
              new_mini_game_embed = new MessageEmbed()
                .setColor(colors.yellow)
                .setTitle("Time to play!")
                .setDescription("Now click the buttons in the same order as shown before!")
              var rows = [
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_2)
                    .setCustomId("word-2"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_5)
                    .setCustomId("word-5"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_1)
                    .setCustomId("word-1"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_4)
                    .setCustomId("word-4"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_3)
                    .setCustomId("word-3")
                ),
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_5)
                    .setCustomId("word-5"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_1)
                    .setCustomId("word-1"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_4)
                    .setCustomId("word-4"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_2)
                    .setCustomId("word-2"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_3)
                    .setCustomId("word-3")
                ),
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_5)
                    .setCustomId("word-5"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_2)
                    .setCustomId("word-2"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_4)
                    .setCustomId("word-4"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_3)
                    .setCustomId("word-3"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_1)
                    .setCustomId("word-1")
                ),
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_4)
                    .setCustomId("word-4"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_3)
                    .setCustomId("word-3"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_2)
                    .setCustomId("word-2"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_1)
                    .setCustomId("word-1"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setLabel(word_5)
                    .setCustomId("word-5")
                ),
              ]

              const word_row = rows[Math.floor(Math.random() * rows.length)]

              await interaction.editReply({
                embeds: [new_mini_game_embed],
                components: [word_row]
              })

              filter = (btnInt) => {
                return interaction.user.id === btnInt.user.id
              }

              collector = interaction.channel.createMessageComponentCollector({
                filter,
                max: 5
              })

              collector.on("collect", async (collected) => {
                if(collected.first()?.customId == word_1) {
                  collected.message.components
                } else if(collected.second()?.customId == word_2) {} else if(collected.third()?.customId == word_3) {} else if(collected.fourth()?.customId == word_4) {} else if(collected.fifth()?.customId == word_5) {} else {}
              })
            }, 3000)
            
            break;
          case "Artist":
            const words = ["Paint", "Canvas", "Paintbrush", "Color", "Dry", "Pictures", "Art"]
            const chosen_words = []

            const color_emojis = [emojis.default.red, emojis.default.orange, emojis.default.yellow, emojis.default.green, emojis.default.blue, emojis.default.purple]

            var first_word = words[Math.floor(Math.random() * words.length)]
            var first_emoji = color_emojis[Math.floor(Math.random() * color_emojis.length)]
            chosen_words.push(first_word)

            words.splice(words.findIndex((item) => item == first_word), 1)
            color_emojis.splice(color_emojis.findIndex((item) => item == first_emoji), 1)

            var second_word = words[Math.floor(Math.random() * words.length)]
            var second_emoji = color_emojis[Math.floor(Math.random() * color_emojis.length)]
            chosen_words.push(second_word)

            words.splice(words.findIndex((item) => item == second_word), 1)
            color_emojis.splice(color_emojis.findIndex((item) => item == second_emoji))

            var third_word = words[Math.floor(Math.random() * words.length)]
            var third_emoji = color_emojis[Math.floor(Math.random() * color_emojis.length)]
            chosen_words.push(third_word)

            color_emojis.splice(color_emojis.findIndex((item) => item == third_emoji))

            await interaction.editReply({
              content: `Remember these words and colors\n\n${first_emoji} ${first_word}\n${second_emoji} ${second_word}\n${third_emoji} ${third_word}\n\n**You have 3.5 seconds to remember these.**`
            })

            await wait(3500)

            var random_emoji = color_emojis[Math.floor(Math.random() * color_emojis.length)]

            const button_rows = [
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${second_emoji}`)
                  .setCustomId("second-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${third_emoji}`)
                  .setCustomId("third-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${first_emoji}`)
                  .setCustomId("first-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${random_emoji}`)
                  .setCustomId("fourth-emoji")
              ),
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${random_emoji}`)
                  .setCustomId("fourth-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${second_emoji}`)
                  .setCustomId("second-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${third_emoji}`)
                  .setCustomId("third-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${first_emoji}`)
                  .setCustomId("first-emoji")
              ),
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${third_emoji}`)
                  .setCustomId("third-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${random_emoji}`)
                  .setCustomId("fourth-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${first_emoji}`)
                  .setCustomId("first-emoji"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${second_emoji}`)
                  .setCustomId("second-emoji")
              )
            ]
            var random_word = chosen_words[Math.floor(Math.random() * chosen_words.length)]
            const button_row = button_rows[Math.floor(Math.random() * button_rows.length)]
            await interaction.editReply({
              content: `What emoji was beside the word \`${random_word}\`?`,
              components: [button_row]
            })
            break;
          */
        }
      }
    });
  },
};
