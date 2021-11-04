const { SlashCommandBuilder } = require("@discordjs/builders");
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("changeavatar")
    .setDescription("Changes the client's avatar (admins only)")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("The link to the avatar")
        .setRequired(true)
    ),
  async execute(interaction) {
    var link = interaction.options.getString("link");
    if (!link.includes("https"))
      return await interaction.reply({
        content: `Invalid link${
          link.includes("http")
            ? ", this link needs to be from a **SECURE** domain"
            : ""
        }.`,
        ephemeral: true,
      });
    var avatar_img = Buffer.from(link);
    return console.log(avatar_img);
    await interaction.reply({ content: "Setting avatar...", ephemeral: true });
    await wait(5000);
    await client.user.setAvatar(avatar_img);
    await interaction.editReply({
      content: "Successfully changed my avatar!",
      ephemeral: true,
    });
  },
};
