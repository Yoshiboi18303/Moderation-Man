const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slap")
    .setDescription("Slap someone for being an idiot")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to slap")
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    /* if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment.`, ephemeral: true }); */
    var user = interaction.options.getUser("user");
    const fetch = await import("node-fetch");
    await interaction.deferReply();
    var buffer_fetch = await fetch.default(
      `https://weebyapi.xyz/generators/batslap?firstimage=${interaction.user.displayAvatarURL(
        { dynamic: false, size: 256, format: "png" }
      )}&secondimage=${user.displayAvatarURL({
        dynamic: false,
        size: 256,
        format: "png",
      })}&token=${process.env.WEEBY_KEY}`,
      {
        method: "GET",
      }
    );
    var buffer = await buffer_fetch.buffer();
    var image = new MessageAttachment(buffer, "slap.png");

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Slappy Slap")
      .setDescription(
        `**${interaction.user.username}** slapped **${user.username}** hard. Ouch.`
      )
      .setImage("attachment://slap.png")
      .setTimestamp();
    await interaction.editReply({
      embeds: [embed],
      files: [image],
    });
  },
};
