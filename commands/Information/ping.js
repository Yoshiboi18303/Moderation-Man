const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the average ping of the client!"),
  options: {
    guildOnly: false
  },
  async execute(interaction) {
    await interaction.reply({ content: `Pinging... ${emojis.wait}`, ephemeral: true })
    await wait(5000)
    await interaction.editReply({ content: `${emojis.yes} | Pong! **${client.ws.ping}ms**`, ephemeral: true })
  }
}