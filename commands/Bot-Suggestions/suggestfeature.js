const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const hold = require("util").promisify(setTimeout);
const { yes, wait } = require("../../emojis.json");
const Suggestion = require("../../schemas/suggestionSchema");
const Users = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestfeature")
    .setDescription("Suggest a feature for Moderation Man!")
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("The feature to suggest")
        .setRequired(true)
    ),
  config: {
    timeout: ms("2m"),
    message:
      "Accepting suggestions can wait, don't you have anything better to do than spam me?",
  },
  async execute(interaction) {
    await interaction.reply({
      content: `Sending suggestion... ${wait}`,
      ephemeral: true,
    });
    var suggestion = interaction.options.getString("suggestion");

    var channel = client.channels.cache.get("902031074979360818");

    var id = Math.floor(Math.random() * 1000000001);

    const sent_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("Success")
      .setDescription(
        `${yes} - Successfully sent your suggestion: "${suggestion}" to **${
          client.guilds.cache.get("892603177248096306").name
        }**!`
      )
      .setTimestamp();
    const suggestion_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("New Suggestion")
      .setFooter(
        `${interaction.user.username} suggested something! - Suggestion ID: ${id}`,
        interaction.user.displayAvatarURL({
          dynamic: false,
          format: "png",
          size: 32,
        })
      )
      .addFields([
        {
          name: "Suggestion",
          value: `${suggestion}`,
          inline: true,
        },
        {
          name: "Guild Of Suggestion",
          value: `${interaction.guild.name}`,
          inline: true,
        },
        {
          name: "Suggester",
          value: `${interaction.user.username}`,
          inline: true,
        },
      ]);
    await hold(3000);
    await interaction.editReply({
      content: "Suggestion successfully sent!",
      embeds: [sent_embed],
      ephemeral: true,
    });
    const sent = await channel.send({ embeds: [suggestion_embed] });
    data = new Suggestion({
      id,
      suggestion,
      suggestor: interaction.user.id,
      guild: interaction.guild.id,
      embed: sent.id,
    });
    data.save();
    Users.findOne({ id: interaction.user.id }, async (err, udata) => {
      if (err) throw err;
      udata = await Users.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $inc: {
            suggestionssent: 1,
          },
        }
      );
      udata.save();
    });
  },
};
