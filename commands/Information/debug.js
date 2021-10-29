const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, Permissions } = require("discord.js");
const { nope, yes } = require("../../emojis.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Debugs something!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("client")
        .setDescription("Debugs something on the client!")
        .addStringOption((option) =>
          option
            .setName("permissions")
            .setDescription(
              "Choose what you want to debug with the client permissions"
            )
            .setRequired(true)
            .addChoice("check", "c")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("member")
        .setDescription("Debugs something on a member!")
        .addStringOption((option) =>
          option
            .setName("permissions")
            .setDescription(
              "Choose what you want to debug with the member permissions"
            )
            .setRequired(true)
            .addChoice("check", "c")
        )
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Choose a member to debug")
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    var subcommand = interaction.options.getSubcommand();
    if (subcommand == "client") {
      var permission_choice = interaction.options.getString("permissions");
      switch (permission_choice) {
        case "c":
          var permissions_c = interaction.guild.me.permissions.toArray();
          function check_c_permissions(p_array) {
            var pa = [];
            for (var p in p_array) {
              if (p == 0) {
                i = 0;
              } else {
                i = p - 1;
              }
              if (!interaction.guild.me.permissions.has(p)) {
                var not_allowed = `${p_array[i]} - Not Allowed.`;
                pa.push(not_allowed);
              } else {
                var allowed = `${p_array[i]} - Allowed!`;
                pa.push(allowed);
              }
            }
            return pa.join("\n");
          }
          var file = Buffer.from(check_c_permissions(permissions_c));
          var attachment = new MessageAttachment(file, "permissions.txt");
          await interaction.reply({ files: [attachment] });
          break;
      }
    } else if (subcommand == "member") {
      var permission_choice = interaction.options.getString("permissions");
      var member =
        interaction.options.getMember("member") || interaction.member;
      switch (permission_choice) {
        case "c":
          var permissions_m = member.permissions.toArray();
          // console.log(permissions_c)
          function check_m_permissions(p_array) {
            var pa = [];
            for (var p in p_array) {
              if (p == 0) {
                i = 0;
              } else {
                i = p - 1;
              }
              if (!member.permissions.has(p)) {
                var not_allowed = `${p_array[i]} - Not Allowed.`;
                pa.push(not_allowed);
              } else {
                var allowed = `${p_array[i]} - Allowed!`;
                pa.push(allowed);
              }
            }
            return pa.join("\n");
          }
          var file = Buffer.from(check_m_permissions(permissions_m));
          var attachment = new MessageAttachment(file, "permissions.txt");
          await interaction.reply({ files: [attachment] });
          break;
      }
    }
  },
};
