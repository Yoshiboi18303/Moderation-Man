const { MessageEmbed, MessageAttachment } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Profiles = require("../../schemas/profileSchema");
const colors = require("../../colors.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your profile (or one of another user)!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("A user to view the profile of")
        .setRequired(false)
    ),
  config: {
    timeout: ms("3s"),
    message: "Don't start spamming profiles now!",
  },
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!` })
    */
    const fetch = await import("node-fetch");
    await interaction.deferReply();
    var user = interaction.options.getUser("user") || interaction.user;
    if (user.bot)
      return await interaction.editReply({
        content: "The user is a bot, which can't be used in this system!",
        ephemeral: true,
      });
    var username_string;
    var usage_string;
    if (user.id == interaction.user.id) {
      username_string = "You don't";
      usage_string = "";
    } else {
      username_string = user.username + " doesn't";
      usage_string = "beg them to";
    }
    var profile = Profiles.findOne({ id: user.id }, async (err, data) => {
      // console.log(data)
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `Whoops! ${username_string} have any data! Please go ahead and ${usage_string} run \`/start\` if you want to have this command work!`
          );
        return await interaction.editReply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        console.log(data.coins);
        var f = await fetch.default(
          `https://weebyapi.xyz/generators/currency?type=dollar&amount=${data.coins}&token=${process.env.WEEBY_KEY}`,
          {
            method: "GET",
          }
        );
        var buffer = await f.buffer();
        var attachment = new MessageAttachment(buffer, "currency.png");
        var cafvc_vc = data.vault_max - data.vault_coins;
        if (cafvc_vc < 0) cafvc_vc = 0;
        var cafvc_pc = data.vault_max - data.coins;
        if (cafvc_pc < 0) cafvc_pc = 0;
        var computer_count = data.inventory.items.computers;
        var fish_count = data.inventory.fish;
        if (computer_count == undefined || typeof computer_count == "undefined")
          computer_count = 0;
        if (fish_count == undefined || typeof fish_count == "undefined")
          fish_count = 0;
        const profile_embed = new MessageEmbed()
          .setColor(data.color)
          .setTitle(`${data.nickname}'s Profile!`)
          .addFields([
            {
              name: "Coins",
              value: `${data.coins}`,
              inline: true,
            },
            {
              name: "Fish",
              value: `${fish_count}`,
              inline: true,
            },
            {
              name: "Vault Amount",
              value: `${data.vault_coins}`,
              inline: true,
            },
            {
              name: "Vault Max",
              value: `${data.vault_max}`,
              inline: true,
            },
            {
              name: "Vault Level",
              value: `${data.vault_level}`,
              inline: true,
            },
            {
              name: "Is Passive?",
              value: `${data.passive ? "Yes" : "No"}`,
              inline: true,
            },
            {
              name: "Computers",
              value: `${computer_count}`,
              inline: true,
            },
            {
              name: "Fishing Rods",
              value: `${data.inventory.items.fishing_rods}`,
              inline: true,
            },
            {
              name: "Started On",
              value: `<t:${data.startedAt}:F>`,
              inline: true,
            },
            {
              name: "Coins Away From Max Vault Capacity (vault coins)",
              value: `${cafvc_vc}`,
              inline: true,
            },
            {
              name: "Coins Away From Max Vault Capacity (pocket coins)",
              value: `${cafvc_pc}`,
              inline: true,
            },
          ])
          .setImage("attachment://currency.png");
        await interaction.editReply({
          embeds: [profile_embed],
          files: [attachment],
        });
      }
    });
  },
};
