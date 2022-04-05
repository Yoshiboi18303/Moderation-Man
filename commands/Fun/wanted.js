const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, CommandInteraction } = require("discord.js");

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
    const fetch = await import("node-fetch")
    
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: "This command is being rewritten, you can test out the new system in the support server!" })
    await interaction.deferReply();

    var user = interaction.options.getUser("user") || interaction.user;

    var req = await fetch.default(`https://weebyapi.xyz/generators/wanted?image=${user.displayAvatarURL({ dynamic: false, format: 'png', size: 256 })}&token=${process.env.WEEBY_KEY}`)
    var data = await req.json();

    await interaction.editReply({ content: "Check the console!" })
    return console.log(data)

    var attachment = new MessageAttachment(buffer, "wanted.png");
    await interaction.editReply({
      files: [attachment],
    });
  },
};
