const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eightball")
    .setDescription("Ask the magic 8ball something")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask")
        .setRequired(true)
    ),
  async execute(interaction) {
    var question = interaction.options.getString("question");
    const responses = [
      `${emojis.yes} **-** It is certain`,
      `${emojis.yes} **-** It is decidedly so`,
      `${emojis.yes} **-** Without a doubt`,
      `${emojis.yes} **-** Yes, definitely`,
      `${emojis.yes} **-** You may rely on it`,
      `${emojis.yes} **-** As I see it, yes`,
      `${emojis.yes} **-** Most likely`,
      `${emojis.yes} **-** Outlook good`,
      `${emojis.yes} **-** Yes`,
      `${emojis.yes} **-** Signs point to yes`,
      `${emojis.ok} **-** Reply hazy try again`,
      `${emojis.ok} **-** Ask again later`,
      `${emojis.ok} **-** Better not tell you now`,
      `${emojis.ok} **-** Cannot predict now`,
      `${emojis.ok} **-** Concentrate and ask again`,
      `${emojis.nope} **-** Don't count on it`,
      `${emojis.nope} **-** My reply is no`,
      `${emojis.nope} **-** My sources say no`,
      `${emojis.nope} **-** Outlook not so good`,
      `${emojis.nope} **-** Very doubtful`,
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply({
      content: `You shake the magic 8 ball asking it: "${question}"... 🎱`,
      ephemeral: true,
    });
    setTimeout(async () => {
      await interaction.editReply({
        content: "And it says...",
        ephemeral: true,
      });
      setTimeout(
        async () =>
          await interaction.editReply({
            content: `${response}.`,
            ephemeral: true,
          }),
        5000
      );
    }, 5000);
  },
};
