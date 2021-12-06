const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const PollSettings = require("../../schemas/pollSetSchema");

var types = {
  GUILD_TEXT: "Text Channel",
  GUILD_VOICE: "Voice Channel",
  GUILD_CATEGORY: "Category",
  GUILD_STAGE_VOICE: "Stage VC",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pstart")
    .setDescription("Start a poll")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the poll to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question for this poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description for your poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reactiontype")
        .setDescription("What type of reactions do you want to be used?")
        .setRequired(true)
        .addChoice("numbers", "numbers")
        .addChoice("yesno", "checkx")
        .addChoice("updown", "updown")
    ),
  config: {
    timeout: ms("20s"),
    message: "Please calm it down.",
  },
  async execute(interaction) {
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for the moment!`,
      });
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
      return await interaction.reply({
        content: "You can't execute this command due to poor permissions!",
        ephemeral: true,
      });
    var channel = interaction.options.getChannel("channel");
    var question = interaction.options.getString("question");
    var pdesc = interaction.options.getString("description");
    var rtype = interaction.options.getString("reactiontype");
    if (channel.type != "GUILD_TEXT")
      return await interaction.reply({
        content: `Expected poll channel to be a type of text channel, got ${
          types[channel.type]
        } instead.`,
        ephemeral: true,
      });
    if (
      !interaction.guild.me
        .permissionsIn(channel)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    )
      return await interaction.reply({
        content: `I can't send messages in <#${channel.id}>!`,
        ephemeral: true,
      });
    const poll_embed = new MessageEmbed()
      .setColor(colors.blue)
      .setTitle(`${question}`)
      .setDescription(`${pdesc}`)
      .setFooter(
        `Poll by ${interaction.user.tag} (${interaction.user.username})`,
        interaction.user.displayAvatarURL({
          dynamic: false,
          format: "png",
          size: 32,
        })
      )
      .setTimestamp();
    await interaction.reply({
      content: `Poll started in <#${channel.id}>!`,
    });
    await channel
      .send({
        embeds: [poll_embed],
      })
      .then(async (msg) => {
        switch (rtype) {
          case "numbers":
            await msg.react(":one:");
            await msg.react(":two:");
            break;
          case "checkx":
            await msg.react("✅");
            await msg.react("❌");
            break;
          case "updown":
            await msg.react("⬆️");
            await msg.react("⬇️");
            break;
        }
        var data = new PollSettings({
          guild: interaction.guild.id,
          message: msg.id,
        });
        data.save();
      });
  },
};
