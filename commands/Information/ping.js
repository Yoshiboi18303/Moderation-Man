const { SlashCommandBuilder } = require("@discordjs/builders");
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the average ping of the client!"),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    await interaction.reply({
      content: `Pinging... ${emojis.wait}`,
    });
    await wait(5000);
    await interaction.editReply({
      content: `Pong! **${client.ws.ping}ms**`,
    });
  },
};
