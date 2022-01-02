const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const Guilds = require("../../schemas/guildSchema");

var types = {
  GUILD_TEXT: "Text Channel",
  GUILD_VOICE: "Voice Channel",
  GUILD_CATEGORY: "Category",
  GUILD_STAGE_VOICE: "Stage VC",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupsugsys")
    .setDescription("Sets up the suggestion channel and options")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to lock onto")
        .setRequired(true)
    ),
  config: {
    timeout: ms("3s"),
    message: "Please calm down.",
  },
  async execute(interaction) {
    // if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "This command is off limits for you!",
      });
    var channel = interaction.options.getChannel("channel");
    if (channel.type != "GUILD_TEXT")
      return await interaction.reply({
        content: `Expected channel type to be a ${types["GUILD_TEXT"]}, got ${
          types[channel.type]
        } instead.`,
        ephemeral: true,
      });
    if (
      !interaction.guild.me
        .permissionsIn(channel)
        .has(Permissions.FLAGS.ADD_REACTIONS)
    )
      return await interaction.reply({
        content: `I need to add reactions to messages in <#${channel.id}>, please check my permissions in that channel!`,
        ephemeral: true,
      });
    Guilds.findOne({ id: interaction.guild.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        data = new Guilds({
          id: interaction.guild.id,
        });
        data.save();
        return await interaction.reply({
          content:
            "To prevent errors, this command needs to be run a second time for new guilds.\n**Please run this command one more time.**",
          ephemeral: true,
        });
      } else {
        data = await Guilds.findOneAndUpdate(
          {
            id: interaction.guild.id,
          },
          {
            $set: {
              suggestionChannel: channel.id,
            },
          }
        );
        data.save();
        await interaction.reply({
          content: "Your (new) suggestion channel has been set!",
          ephemeral: true,
        });
      }
    });
  },
};
