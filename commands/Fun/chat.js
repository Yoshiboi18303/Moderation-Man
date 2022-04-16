module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with a chatbot!")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Type in a message to send to the chatbot!")
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    // return await interaction.reply({ content: 'This command is broken and will be fixed soon!' })
    await interaction.deferReply();
    const message = interaction.options.getString("message");
    chatbot.chat(message).then(async (response) => await interaction.followUp(`${response}`)).catch(async (e) => {
      new CommandError("An error occurred while using the chatbot", e)
      return await interaction.followUp({ content: "An error occurred while using the chatbot, this has been sent to the developers." })
    })
  },
};
