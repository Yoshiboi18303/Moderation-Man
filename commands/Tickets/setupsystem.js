const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Permissions,
} = require("discord.js");
const TicketSettings = require("../../schemas/ticketSetSchema");

var types = {
  GUILD_TEXT: "Text Channel",
  GUILD_VOICE: "Voice Channel",
  GUILD_CATEGORY: "Category",
  GUILD_STAGE_VOICE: "Stage VC",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupsystem")
    .setDescription("Sets up the ticket system")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to put the embed in")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("mod_role")
        .setDescription("Your moderator role")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "You trying to break me or something?",
  },
  async execute(interaction) {
    /*
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to ${
          client.guilds.cache.get(config.bot.testServerId).name
        } for the moment!`,
        ephemeral: true,
      });
    */
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
      return await interaction.reply({
        content: "You aren't able to use this command due to poor permissions!",
        ephemeral: true,
      });
    var channel = interaction.options.getChannel("channel");
    var role = interaction.options.getRole("mod_role");

    if (channel.type != "GUILD_TEXT")
      return await interaction.reply({
        content: `Expected the channel to put the embed in to be a text channel, got ${
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
        content: `I can't send messages to <#${channel.id}>!`,
        ephemeral: true,
      });

    const system_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Ticket System")
      .setDescription("Click a button below to open a ticket!")
      .setFooter(`Powered by ${client.user.username}`)
      .setTimestamp();

    const button_row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Open Ticket")
        .setCustomId("ticket-sys-open")
        .setDisabled(false)
    );

    var msg = await channel.send({
      embeds: [system_embed],
      components: [button_row],
    });
    var data = new TicketSettings({
      guild: interaction.guild.id,
      mod_role: role.id,
      message: msg.id,
    });
    data.save();
    await interaction.reply({
      content: `Ticket system set up in <#${channel.id}>!`,
    });
  },
};
