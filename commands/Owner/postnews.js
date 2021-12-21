const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("postnews")
    .setDescription("Post some news to Discord Services (admins only)")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title for the news")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content for the news")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("error")
        .setDescription(
          "Whether this news is a bot issue/maintenence report (default: false)"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "This command is restricted to admins only!",
        ephemeral: true,
      });
    const fetch = await import("node-fetch");
    var title = interaction.options.getString("title");
    var content = interaction.options.getString("content");
    var error = interaction.options.getBoolean("error") || false;

    await interaction.deferReply({ ephemeral: true });

    const news_body = {
      title: title,
      content: content,
      error: error,
    };

    const f = await fetch.default(
      `https://api.discordservices.net/bot/${client.user.id}/news`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.SERVICES_API_KEY,
        },
        body: JSON.stringify(news_body),
      }
    );
    const result = await f.json();
    await interaction.reply({
      content: `\`\`\`\n${result}\n\`\`\``,
    });
  },
};
