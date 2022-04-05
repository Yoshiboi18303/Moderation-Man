const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pet")
    .setDescription("*insert ending theme*"),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: "This command is being tested!" })
    */
    const fetch = await import("node-fetch");
    var link = `https://weebyapi.xyz/gif/pat?token=${process.env.WEEBY_KEY}`;
    var f = await fetch.default(link, {
      method: "GET",
    });
    var { url } = await f.json();
    // console.log(url)
    var attachment = new MessageAttachment(url, "pat.gif");
    await interaction.reply({ files: [attachment] });
  },
};
