const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("review")
    .setDescription("Send a review on the bot")
    .addStringOption((option) =>
      option
        .setName("rating")
        .setDescription("Your rating on the bot")
        .setRequired(true)
        .addChoice("1", "1")
        .addChoice("2", "2")
        .addChoice("3", "3")
        .addChoice("4", "4")
        .addChoice("5", "5")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason you gave this rating")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "Could you not spam the owner, it hurts him.",
  },
  async execute(interaction) {
    var rating = interaction.options.getString("rating");
    var reason = interaction.options.getString("reason");

    function returnRatingEmoji(rating) {
      var rating_string = "";
      switch (rating) {
        case "1":
          rating_string = "⭐";
          break;
        case "2":
          rating_string = "⭐⭐";
          break;
        case "3":
          rating_string = "⭐⭐⭐";
          break;
        case "4":
          rating_string = "⭐⭐⭐⭐";
          break;
        case "5":
          rating_string = "⭐⭐⭐⭐⭐";
          break;
      }
      return rating_string;
    }

    const channel = client.channels.cache.get("910275234450538496");

    const sending_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setTitle("Sending Review")
      .setDescription(
        `All right, I'm sending your review of ${returnRatingEmoji(
          rating
        )} (${rating} stars) to **${channel.name}**...`
      );
    await interaction.reply({
      embeds: [sending_embed],
      ephemeral: true,
    });

    var color = "";

    if (interaction.member.displayHexColor == "#000000") color = "BLURPLE";
    else color = interaction.member.displayHexColor;

    await wait(5000);

    const sent_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("Sent Review!")
      .setDescription(
        `Your review has been sent to **${channel.name}** in **${
          client.guilds.cache.get(config.bot.testServerId).name
        }**!`
      )
      .setTimestamp();

    const review_embed = new MessageEmbed()
      .setColor(color)
      .setTitle("New Review!")
      .setDescription("There is a new review on the bot!")
      .addFields([
        {
          name: "Star Rating",
          value: `${returnRatingEmoji(rating)}`,
          inline: true,
        },
        {
          name: "Reason",
          value: `${reason}`,
          inline: true,
        },
        {
          name: "Reviewer",
          value: `${interaction.user.username}`,
          inline: true,
        },
      ])
      .setTimestamp();

    await channel
      .send({
        embeds: [review_embed],
      })
      .then(async () => {
        await interaction.editReply({
          embeds: [sent_embed],
          ephemeral: true,
        });
      });
  },
};
