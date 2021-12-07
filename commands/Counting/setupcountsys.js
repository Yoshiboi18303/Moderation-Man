const { SlashCommandBuilder } = require("@discordjs/builders");
const CountingSystem = require("../../schemas/countSysSchema");
const { Permissions } = require("discord.js");

var types = {
  GUILD_TEXT: "Text Channel",
  GUILD_VOICE: "Voice Channel",
  GUILD_CATEGORY: "Category",
  GUILD_STAGE_VOICE: "Stage VC",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupcountsys")
    .setDescription("Setup the counting system")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to establish the counting system")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "Calm it down with the setting!",
  },
  async execute(interaction) {
    // if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!` })
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "You can't execute this command due to poor permissions!",
      });
    var channel = interaction.options.getChannel("channel");
    if (channel.type != "GUILD_TEXT")
      return await interaction.reply({
        content: `Expected channel type to be a ${types["GUILD_TEXT"]}, got ${
          types[channel.type]
        } instead.`,
      });
    await interaction.deferReply();
    var guild = interaction.guild;
    CountingSystem.findOne({ guild: guild.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        data = new CountingSystem({
          guild: guild.id,
          channel: channel.id,
        });
        data.save();
        await interaction.editReply({
          content: `Counting system setup in <#${channel.id}>!`,
        });
      } else {
        data = await CountingSystem.findOneAndUpdate(
          {
            guild: guild.id,
          },
          {
            $set: {
              channel: channel.id,
            },
          }
        );
        data.save();
        await interaction.editReply({
          content: `Counting system channel changed to <#${channel.id}>!`,
        });
      }
    });
  },
};
