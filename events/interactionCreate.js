const Users = require("../schemas/userSchema");
const CommandError = require("../items/classes/CommandError");
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Permissions,
} = require("discord.js");
const TicketSettings = require("../schemas/ticketSetSchema");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      if (!interaction.guild)
        return await interaction.reply({
          content: "You need to run these commands in a guild!",
          ephemeral: true,
        });
      if (interaction.user.bot) return;
      const command = client.commands.get(interaction.commandName);

      /*
      if(typeof command.config.guildOnly != "undefined" && command.config.guildOnly) {
        if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `**${command.data.name}** is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for right now!` })
      }
      */

      global.hexColor = interaction.member.displayHexColor;

      if (!command) return;

      /*
      if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.get('900922312935735336'))) {
        if(interaction.replied || interaction.deferred) {
          return await interaction.editReply({ content: `You don't have the ${interaction.guild.roles.cache.get('900922312935735336').name} role! Which means you can't access the commands on this bot!\n\nView the info on this role with \`/roleinfo\`!`, ephemeral: true })
        } else {
          return await interaction.reply({ content: `You don't have the ${interaction.guild.roles.cache.get('900922312935735336').name} role! Which means you can't access the commands on this bot!`, ephemeral: true })
        }
      }
      */

      Users.findOne({ id: interaction.user.id }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          console.log("Inserting a new document...");
          data = new Users({ id: interaction.user.id });
          data.save();
          console.log("Document inserted! Waiting until next command usage!");
        } else {
          cmds_used = data.commandsUsed;
          var bl = data.blacklisted;
          console.log("Updating a document...");
          try {
            if (bl == true) {
              const blacklisted_embed = new MessageEmbed()
                .setColor(colors.red)
                .setTitle("Error")
                .setDescription(
                  `You are blacklisted from using **${client.user.username}**!`
                );
              return await interaction.reply({
                embeds: [blacklisted_embed],
              });
            }
            await command.execute(interaction);
          } catch (e) {
            new CommandError(
              `Whoopies! An error occured while trying to execute ${command.data.name}!\n\n`,
              e
            );
            const error_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `An error occurred trying to execute **${command.data.name}** in **${interaction.guild.name}**...\n\n\`\`\`js\n${e}\n\`\`\``
              );
            await channel.send({
              content: `<@&904429332582240266>`,
              embeds: [error_embed],
            });
            const sent_err_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle(`Error Occurred! ${emojis.warn}`)
              .setDescription(`\`${e}\``)
              .addFields([
                {
                  name: "Command",
                  value: `${command.data.name}`,
                },
                {
                  name: "Server",
                  value: `${interaction.guild.name}`
                }
              ])
              .setFooter(`This error was also sent to ${client.guilds.cache.get(config.bot.testServerId).name}!`)
            var options = {
              embeds: [sent_err_embed],
              ephemeral: true
            }
            if (interaction.replied || interaction.deferred) {
              return interaction.editReply(options);
            } else {
              return interaction.reply(options);
            }
          }
          data = await Users.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              commandsUsed: cmds_used + 1,
            }
          );
          data.save();
        }
      });
      console.log(`Trying to execute command "${interaction.commandName}"...`);
      const channel = await client.channels.cache.get("904421522205204531");
      const trying_embed = new MessageEmbed()
        .setColor(colors.yellow)
        .setTitle("Command Attempt")
        .setDescription(
          `Trying to execute command "**${interaction.commandName}**" in **${interaction.guild.name}**\n\nInteraction User: **${interaction.user.username}**`
        );
      await channel.send({
        embeds: [trying_embed],
      });
      client.stats.postCommand(command.data.name, interaction.user.id);
      var msg = command.config.message;
      var timeout = command.config.timeout;
      /*
      if(commandsUsedRecently.has(interaction.user.id)) {
        var titles = ["Too spicy for me, take a breather", "429, Too many requests", "You need to slow down", "Way too fast for me"]
        const timeout_embed = new MessageEmbed()
          .setColor(colors.yellow)
          .setTitle(`${titles[Math.floor(Math.random() * titles.length)]}`)
          .setDescription(`${msg}`)
        return await interaction.reply({
          embeds: [timeout_embed]
        })
      } else {
      */
      /*
        commandsUsedRecently.add(interaction.user.id)
        setTimeout(() => commandsUsedRecently.delete(interaction.user.id), timeout)
      */
      // }
    } else if (interaction.isButton() && !interaction.isCommand()) {
      if (!interaction.guild) return;
      TicketSettings.findOne(
        { guild: interaction.guild.id },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            if (interaction.customId == "ticket-sys-open") {
              interaction.guild.channels
                .create(`ticket-${interaction.user.username.toLowerCase()}`, {
                  topic: `A ticket opened by ${interaction.user.username} | Powered by ${client.user.username}`,
                  permissionOverwrites: [
                    {
                      id: interaction.guild.roles.everyone,
                      deny: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                      ],
                    },
                    {
                      id: interaction.user.id,
                      allow: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                      ],
                    },
                    {
                      id: client.user.id,
                      allow: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                      ],
                    },
                    {
                      id: data.mod_role,
                      allow: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                      ],
                    },
                  ],
                })
                .then(async (channel) => {
                  await interaction.reply({
                    content: `Ticket opened in <#${channel.id}>!`,
                    ephemeral: true,
                  });
                  const opened_embed = new MessageEmbed()
                    .setColor(colors.green)
                    .setTitle("Support Ticket")
                    .setDescription(
                      `I have opened a ticket for you and the support team to be able to talk. Please wait while they hop over to this channel.`
                    );
                  const action_row = new MessageActionRow().addComponents(
                    new MessageButton()
                      .setStyle("DANGER")
                      .setLabel("Close Ticket")
                      .setCustomId("ticket-close")
                      .setDisabled(false)
                  );
                  await channel.send({
                    embeds: [opened_embed],
                    components: [action_row],
                    content: `<@${interaction.user.id}>`,
                  });
                })
                .catch((e) => console.error(e));
            } else if (interaction.customId == "ticket-close") {
              const closed_embed = new MessageEmbed()
                .setColor(colors.red)
                .setTitle("Ticket Closed")
                .setDescription(
                  `${interaction.user.username}, I have closed this ticket. I will delete this channel in 10 seconds.`
                );
              await interaction.reply({
                embeds: [closed_embed],
              });
              setTimeout(() => {
                interaction.channel.delete("The Ticket was closed.");
              }, 10000);
            }
          }
        }
      );
    } else {
      return;
    }
  },
};
