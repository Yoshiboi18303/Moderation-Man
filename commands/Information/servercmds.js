const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servercmds")
    .setDescription("View the 20 most recent commands for the current guild"),
  config: {
    timeout: ms("10s"),
    message: "Please don't start spamming this information here",
  },
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to ${client.guilds.cache.get(config.bot.testServerId).name} for the moment!`, ephemeral: true })
    */
    var guild = interaction.guild;
    if (!guild.available)
      return await interaction.reply({
        content:
          "This guild isn't available, so I can't fetch any data from it!",
        ephemeral: true,
      });
    guild.commands.fetch().then(async (cmds) => {
      const cmd_map = cmds.map(
        (cmd) =>
          `**${cmd.name}** => ${cmd.description} | ID: ${cmd.id}, Type: ${
            cmd.type
          }, Created On: ${moment.utc(cmd.createdTimestamp).format("LL - LTS")}`
      );
      cmd_map.splice(20, cmd_map.length - 20);
      const cmds_embed = new MessageEmbed()
        .setColor(interaction.member.displayHexColor)
        .setTitle(`Commands In ${guild.name}`)
        .setDescription(`${cmd_map.join("\n\n-----\n\n")}`);
      await interaction.reply({
        embeds: [cmds_embed],
      });
    });
  },
};
