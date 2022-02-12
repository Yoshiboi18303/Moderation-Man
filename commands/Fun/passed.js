const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, CommandInteraction } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("passed")
    .setDescription("Respect +100")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to put on the image")
        .setRequired(false)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!` })
    await interaction.deferReply();
    const canvas = createCanvas(512, 512)
    var ctx = canvas.getContext("2d")
    var avatar = loadImage(interaction.user.displayAvatarURL({ size: 512, format: "png" }))

    ctx.font = "30px Impact"
    const attachment = new MessageAttachment(link, "mission_passed.png");
    await interaction.editReply({ files: [attachment] });
  },
};
