const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("impostor")
    .setDescription("Among Us")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to use for the image")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("is_impostor")
        .setDescription("Is this user the Impostor?")
        .setRequired(false)
    ),
  config: {
    timeout: ms("5s"),
    message: "Your fun needs a break.",
  },
  async execute(interaction) {
    await interaction.deferReply();
    var user = interaction.options.getUser("user") || interaction.user;
    var member = interaction.options.getMember("user") || interaction.member;
    var is_impostor = interaction.options.getBoolean("is_impostor") || false;
    var name = member.displayName;
    // console.log(user.username, is_impostor)
    // return await interaction.reply("Coming soon!")
    var link = `https://some-random-api.ml/premium/amongus?avatar=${user.displayAvatarURL(
      { format: "png", dynamic: false, size: 512 }
    )}&key=${process.env.KEY}&username=${name}&imposter=${is_impostor}`;
    var name = "";
    if (is_impostor) {
      name = "impostor.gif";
    } else {
      name = "not_impostor.gif";
    }
    const attachment = new MessageAttachment(link, name);
    await interaction.followUp({ files: [attachment] });
  },
};
