const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription(
      "Returns a random joke for you and your friends to laugh at"
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    const fetch = await import("node-fetch");
    await interaction.deferReply();
    var types = ["joke", "dadjoke"];
    var type = types[Math.floor(Math.random() * types.length)];
    // console.log(type);
    var link = `https://weebyapi.xyz/json/${type}?token=${process.env.WEEBY_KEY}`;
    var f = await fetch.default(link, {
      method: "GET",
    });
    var data = await f.json();
    await interaction.editReply({ content: `${data.response}` });
  },
};
