const { SlashCommandBuilder } = require('@discordjs/builders');
const key = process.env.KEY

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with a chatbot!")
    .addStringOption(option => option.setName("message").setDescription("Type in a message to send to the chatbot!").setRequired(true)),
  options: {
    guildOnly: false
  },
  async execute(interaction) {
    return await interaction.reply({ content: 'This command is broken and will be fixed soon!' })
    await interaction.deferReply()
    const message = interaction.options.getString("message")
    const fetch = await import('node-fetch');

    const link = `https://some-random-api.ml/chatbot?message=${message}&key=${key}`

    const r = await fetch.default(link, {
      method: "GET"
    })
    const data = await r.json()

    await interaction.followUp(`${data.response}`)
  }
}