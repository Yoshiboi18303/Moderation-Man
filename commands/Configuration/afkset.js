const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");
const AFKUser = require("../../schemas/afkSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afkset")
    .setDescription("Set your status to AFK on the bot")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to set as your AFK reason")
        .setRequired(true)
    ),
  config: {
    timeout: ms("5s"),
    message: "Please calm it with the AFK setting.",
  },
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
    */
    var message = interaction.options.getString("message");
    var user = interaction.user;
    const set_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("AFK Set!")
      .setDescription(`I have set your AFK to "**${message}**"`);
    await interaction.reply({
      embeds: [set_embed],
    });
    AFKUser.findOne({ user: user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        data = new AFKUser({
          user: user.id,
          message,
        });
        data.save();
      } else {
        data = await AFKUser.findOneAndUpdate(
          {
            user: user.id,
          },
          {
            $set: {
              message,
            },
          }
        );
        data.save();
      }
    });
    // console.log(interaction.guild.me.permissions.toArray())
  },
};
