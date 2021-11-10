const Users = require("../schemas/userSchema");

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
      var timeouts = [];

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
          console.log("Document inserted! Waiting until next command usage!")
        } else {
          cmds_used = data.commandsUsed;
          console.log("Updating a document...");
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
      await channel.send({
        content: `Trying to execute command "**${interaction.commandName}**" in **${interaction.guild.name}**`,
      });
      try {
        client.stats.postCommand(command.data.name, interaction.user.id)
        await command.execute(interaction);
      } catch (e) {
        console.error(e);
        const error_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `An error occured trying to execute **${command.data.name}**...\n\n\`\`\`js\n${e}\n\`\`\``
          );
        await channel.send({
          content: `<@&904429332582240266>`,
          embeds: [error_embed],
        });
        if (interaction.replied || interaction.deferred) {
          return interaction.editReply({
            content:
              "There was an error executing this command! This has been reported to the developer(s).",
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            content:
              "There was an error executing this command! This has been reported to the developer(s).",
            ephemeral: true,
          });
        }
      }
    } else {
      return;
    }
  },
};
