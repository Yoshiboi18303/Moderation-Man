const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eightball")
    .setDescription("Ask the magic 8ball something")
    .addStringOption((option) => option.setName("question").setDescription("The question to ask").setRequired(true)),
  async execute(interaction) {
    var question = interaction.options.getString("question")
    const responses = [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes, definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",
      "Reply hazy try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
    ]
    const response = responses[Math.floor(Math.random() * responses.length)]
    await interaction.reply({ content: `You shake the magic 8 ball asking it: "${question}"... 🎱`, ephemeral: true })
    setTimeout(async () => {
      await interaction.editReply({ content: "And it says...", ephemeral: true })
      setTimeout(async () => await interaction.editReply({ content: `${response}.`, ephemeral: true }), 5000)
    }, 5000)
  }
}