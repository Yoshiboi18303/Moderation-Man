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
    await interaction.reply(`Pinging... ${emojis.wait}`)
    await wait(5000)
    await interaction.editReply(`${emojis.yes} | Pong! **${client.ws.ping}ms**`)
  }
}