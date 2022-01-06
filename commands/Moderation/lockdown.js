const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Lockdown all channels (or just one)")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("The status of the lockdown")
        .setRequired(true)
        .addChoice("active", "active")
        .addChoice("end", "end")
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the lockdown")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to lockdown")
        .setRequired(false)
    ),
  config: {
    timeout: ms("5s"),
    message: "Calm down when it comes to locking down stuff",
  },
  async execute(interaction) {
    if (interaction.guild.id != config.bot.secondTestServerId)
      return await interaction.reply({
        content: "This command is being tested upon at the moment!",
      });
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "You can't use this command!",
      });
    if (
      !interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)
    )
      return await interaction.reply({
        content: "I can't manage the channels in this guild!",
      });
    var status = interaction.options.getString("status");
    var reason = interaction.options.getString("reason");
    var channel = interaction.options.getChannel("channel") || null;
    switch (status) {
      case "active":
        if (channel != null) {
          var permissions = Array.from(
            channel.permissionOverwrites.cache.keys()
          );
          if (
            (channel.isText() &&
              !permissions.includes(Permissions.FLAGS.SEND_MESSAGES)) ||
            (channel.isVoice() &&
              !permissions.includes(Permissions.FLAGS.CONNECT))
          )
            return await interaction.reply({
              content: `This channel is already locked!`,
            });
          if (channel.type == "GUILD_CATEGORY")
            return await interaction.reply({
              content:
                "Please make sure this is a **CHANNEL**, not a category!",
            });
          if (
            interaction.guild.me
              .permissionsIn(channel)
              .has(Permissions.FLAGS.SEND_MESSAGES) &&
            c.isText()
          ) {
            channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor(colors.yellow)
                  .setTitle("Channel Locked")
                  .setDescription(
                    `This channel has been locked for reason: "${reason}"`
                  ),
              ],
            });
          }
          channel.edit(
            {
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone,
                  deny: [
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.CONNECT,
                  ],
                },
              ],
            },
            reason
          );
          await interaction.reply({
            content: `<@${channel.id}> has been locked.`,
          });
        } else {
          var already_locked_channels = [];
          interaction.guild.channels.fetch().then((channels) => {
            channels
              .filter((c) => c.type != "GUILD_CATEGORY")
              .forEach(async (c) => {
                var permissions = Array.from(
                  c.permissionOverwrites.cache.keys()
                );
                console.log(c.permissionOverwrites.cache, permissions);
                if (
                  (c.isText() &&
                    permissions.includes(Permissions.FLAGS.SEND_MESSAGES)) ||
                  (c.isVoice() &&
                    permissions.includes(Permissions.FLAGS.CONNECT))
                ) {
                  if (
                    interaction.guild.me
                      .permissionsIn(c)
                      .has(Permissions.FLAGS.SEND_MESSAGES) &&
                    c.isText()
                  ) {
                    await c.send({
                      embeds: [
                        new MessageEmbed()
                          .setColor(colors.yellow)
                          .setTitle("Channel Locked")
                          .setDescription(
                            `This channel has been locked for reason: "${reason}"`
                          ),
                      ],
                    });
                  }
                  await c.edit(
                    {
                      permissionOverwrites: [
                        {
                          id: interaction.guild.roles.everyone,
                          deny: [
                            Permissions.FLAGS.SEND_MESSAGES,
                            Permissions.FLAGS.CONNECT,
                          ],
                        },
                      ],
                    },
                    reason
                  );
                } else {
                  already_locked_channels.push(c.id);
                }
              });
          });
          if (already_locked_channels.length === 0) {
            await interaction.reply({
              content: "All channels have been locked down.",
            });
          } else if (
            already_locked_channels.length > 0 &&
            already_locked_channels.length < channels.size
          ) {
            var content = [];
            for (var channel of already_locked_channels)
              content.push(`<#${channel}>`);
            await interaction.reply({
              content: `Not every channel was locked. These are the channels that weren't locked.\n\n${content.join(
                ",\n"
              )}`,
            });
          } else {
            return await interaction.reply({
              content: "All channels are already locked!",
            });
          }
        }
        break;
      case "end":
        // if()
        break;
    }
  },
};
