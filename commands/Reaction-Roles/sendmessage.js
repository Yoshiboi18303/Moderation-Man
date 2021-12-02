const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  Permissions,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
// const Channels = require("../../schemas/channelSchema");
const colors = require("../../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendmessage")
    .setDescription("Sends the reaction roles message")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title for the embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to put")
        .setRequired(false)
    ),
  config: {
    timeout: ms("1m") + ms("45s"),
    message: "Stop sending messages to channels in spam.",
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "You don't have the `MANAGE_CHANNELS` permission!",
        ephemeral: true,
      });
    return await interaction.reply({
      content: "Coming Soon!",
    });
    var message =
      interaction.options.getString("message") ||
      "Click on an option in the dropdown to add/remove a role!";
    var title =
      interaction.options.getString("title") ||
      `${interaction.guild.name} Reaction Roles`;

    Channels.findOne({ guild: interaction.guild.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_channel_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            "You don't have a Reaction Roles channel! Please set one by running `/setreaction`!"
          );
        return await interaction.reply({ embeds: [no_channel_embed] });
      } else {
        const reaction_roles_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(
            `${title.includes("{}") ? title.replace("{}", "${}") : title}`
          )
          .setDescription(
            `${message.includes("{}") ? message.replace("{}", "${}") : message}`
          );
        /*
        const row = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .addOptions([
                {
                  label: "Role"
                }
              ])
          )
        */
        var channel = client.channels.cache.get(data.channelId);
        channel.send({
          embeds: [reaction_roles_embed],
        });
        await interaction.reply({
          content: `Sent the message to <#${channel.id}>!`,
          ephemeral: true,
        });
      }
    });
  },
};
