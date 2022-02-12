const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, CommandInteraction } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wanted")
    .setDescription("Dead or alive")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to use for the image")
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
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: "This command is being rewritten, you can test out the new system in the support server!" })
    */
    await interaction.deferReply();

    var user = interaction.options.getUser("user") || interaction.user;

    var canvas = Canvas.createCanvas(613, 800)
    var ctx = canvas.getContext("2d")

    var avatar = await Canvas.loadImage(user.displayAvatarURL({ dynamic: false, format: "png" }))

    var poster = await Canvas.loadImage(process.env.WANTED_IMAGE_URL);

    ctx.drawImage(poster, 0, 0, canvas.width, canvas.height)

    ctx.drawImage(avatar, 145, 250, 325, 325)

    // console.log(ctx)

    var buffer = canvas.toBuffer()

    var attachment = new MessageAttachment(buffer, "wanted.png")
    await interaction.editReply({
      files: [attachment]
    })

  },
};
