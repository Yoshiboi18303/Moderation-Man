const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("token")
    .setDescription('Generates a "real" Discord Bot token!')
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID to use (can be any string)")
        .setRequired(false)
    ),
  options: {
    guildOnly: true,
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const fetch = await import("node-fetch");
    const id = interaction.options.getString("id");
    var link;
    if (id) {
      link = "https://some-random-api.ml/bottoken?id=" + id;
    } else {
      link = "https://some-random-api.ml/bottoken";
    }

    var r = await fetch.default(link, {
      method: "GET",
    });
    var data = await r.json();

    await interaction.editReply({
      content: `${data.token}`,
      ephemeral: true,
    });
  },
};
