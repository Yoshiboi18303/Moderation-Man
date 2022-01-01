const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Gets a random meme and sends it in an embed!"),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    // if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!` })
    await interaction.deferReply();
    const fetch = await import("node-fetch");
    var link = `https://weebyapi.xyz/json/meme?token=${process.env.WEEBY_KEY}`;

    console.log("Running GET request...");
    const r = await fetch.default(link, {
      method: "GET",
    });
    var data = await r.json();

    var date = new Date(data.date);
    console.log(date);

    /*
    return await interaction.followUp({
      content: "Check the console!"
    })
    */

    var meme_title = data.title;
    var meme_image = data.url;

    const meme_embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor({
        name: `${data.author}`,
        url: `https://www.reddit.com/user/${data.author}`,
      })
      .setDescription(`From __[r/${data.subreddit}](${data.subredditURL})__`)
      .setTitle(meme_title)
      .setImage(meme_image)
      .setFooter(
        `📅 ${date.getMonth()}/${date.getDay()}/${date.getFullYear()} 💬 ${
          data.comments
        } 🏅 ${data.awards}`
      )
      .setURL(`${data.permaURL}`);
    await interaction.followUp({
      embeds: [meme_embed],
    });
  },
};
