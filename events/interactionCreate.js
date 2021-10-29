const Users = require("../schemas/userSchema");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      if (!interaction.guild || interaction.user.bot) return;
      const command = client.commands.get(interaction.commandName);
      var timeouts = [];
      let bl;

      Users.findOne({ id: interaction.user.id }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          data = new Users({
            id: interaction.user.id,
          });
          data.save();
          bl = await data.blacklisted;
        } else {
          bl = await data.blacklisted;
        }
      });

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

      console.log(`Trying to execute command "${interaction.commandName}"...`);
      try {
        if (bl)
          return await interaction.reply({
            content: `You are blacklisted from using **${client.user.username}**!`,
          });
        await command.execute(interaction);
      } catch (e) {
        console.error(e);
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
