const { SlashCommandBuilder } = require("@discordjs/builders");
const Users = require("../../schemas/userSchema");
const Guilds = require("../../schemas/guildSchema");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure the bot's settings for this guild")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription(`Action to perform on a setting`)
        .setRequired(true)
        .addChoice("view", "view")
        .addChoice("set", "change")
    )
    .addStringOption((option) =>
      option
        .setName(`setting`)
        .setDescription("Setting to view/change")
        .setRequired(true)
        .addChoice("voice moderation", "voicemod")
        .addChoice("captcha", "captcha")
    )
    .addStringOption((option) =>
      option
        .setName("value")
        .setDescription(`New value of given setting`)
        .setRequired(false)
    ),
  async execute(interaction) {
    /* Don't change this line until it's ready. */ if (
      interaction.guild.id !== config.bot.testServerId
    )
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** for right now!`,
        ephemeral: true,
      });

    // return await interaction.reply({ content: "Coming Soon!", ephemeral: true })

    console.log(interaction, args);

    var args = [];

    interaction.options.data.forEach((c) => {
      args.push(c.value.toLowerCase());
    });

    var action = args[0];
    var setting = args[1];
    var value = args[2] ? interaction.options.getString("value") : null;

    var guild = Guilds.findOne({ id: interaction.guild.id });

    var cmd = interaction;

    if (action == "view") {
      await cmd.deferReply();

      var embed = new MessageEmbed()
        .setTitle("View Setting")
        .setDescription(`Here's the value of **${setting}**`)
        .setTimestamp()
        .setColor(colors.green);

      switch (setting) {
        case "voicemod":
          var status = getStatus(guild.voiceMod);

          embed.addField(`Voice Moderation`, `**${status}**`);

          await cmd.editReply({ embeds: [embed] });

          break;

        case "captcha":
          var status = getStatus(guild.captcha);

          embed.addField("Captcha", `**${status}**`);

          await cmd.editReply({ embeds: [embed] });
          break;
      }
    } else if (action == "change") {
      if (!value)
        return await interaction.reply({
          content: "DFJHBUEFIOJKBNEJ",
          ephemeral: true,
        });
    }

    // i like to always leave a blank line below the last line of my code... it just looks nice imo. lol
  },
};

function getStatus(boolean) {
  if (!boolean || typeof boolean != "boolean")
    throw new TypeError("Boolean is undefined, or is not a type of boolean.");
  if (boolean) {
    return "Enabled";
  } else return "Disabled";
}
