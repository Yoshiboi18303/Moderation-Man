const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guilds")
    .setDescription("Shows the guilds the client is in"),
  config: {
    timeout: ms("10s"),
    message: "Viewing guilds can wait for a little.",
  },
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "This command is restricted to admins only!",
        ephemeral: true,
      });
    var guilds_map = client.guilds.cache.map(
      (g) => `**${g.name}** => ${g.memberCount} members`
    );
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Guilds for ${client.user.username}`)
      .setDescription(
        `Here are all the guilds I am in.\n\n__${guilds_map.join(
          ",\n"
        )}__\n\nGuild Count: **${guilds_map.length}**`
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
