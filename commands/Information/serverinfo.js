const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { utc } = require("moment");

const feature_flags = {
  ANIMATED_ICON: "Has An Animated Icon",
  BANNER: "Has a Banner Image",
  COMMERCE: "Has Commerce",
  COMMUNITY: "Is A Community Server",
  DISCOVERABLE: "Is A Discoverable Server",
  FEATURABLE: "Is Featurable",
  INVITE_SPLASH: "Has An Invite Splash",
  MEMBER_VERIFICATION_GATE_ENABLED: "Has Membership Screening",
  NEWS: "Has News",
  PARTNERED: "Is Partnered With Discord",
  PREVIEW_ENABLED: "Has A Preview",
  VANITY_URL: "Has A Vanity URL",
  VERIFIED: "Is A Verified Server",
  VIP_REGIONS: "Has VIP Regions",
  WELCOME_SCREEN_ENABLED: "Has A Welcome Screen",
  TICKETED_EVENTS_ENABLED: "Has Ticketed Events",
  MONETIZATION_ENABLED: "Has Monetization",
  MORE_STICKERS: "Has Extra Stickers",
  THREE_DAY_THREAD_ARCHIVE: "Has 3 Day Thread Archive Allowed",
  SEVEN_DAY_THREAD_ARCHIVE: "Has 3 Day Thread Archive Allowed",
  PRIVATE_THREADS: "Has Private Threads Allowed",
  ROLE_ICONS: "Has Role Icons",
};

const boost_levels = {
  NONE: "0",
  TIER_1: "1",
  TIER_2: "2",
  TIER_3: "3",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("View info on the current guild"),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    // if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true })
    var guild = interaction.guild;
    var member = interaction.member;

    if (!guild.available || guild.available == false)
      return await interaction.reply({
        content:
          "The Discord servers are down, so I can't access the info of this guild.",
        ephemeral: true,
      });

    await interaction.deferReply();

    var color;

    if (member.displayHexColor == "#000000") color = "RANDOM";
    else color = member.displayHexColor;

    const returnRecent15FeatureFlags = () => {
      var final = [];
      for (var feature of guild.features) {
        var push = feature_flags[feature];
        final.push(push);
      }
      if (final.length > 15) {
        final.splice(15, final.length - 15);
      }
      return final.join(", ");
    };

    const serverinfo_embed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Info on ${guild.name}`)
      .addFields([
        {
          name: "AFK Channel",
          value: `${guild.afkChannel != null ? guild.afkChannel : "None"}`,
          inline: true,
        },
        {
          name: "AFK Timeout",
          value: `${guild.afkTimeout}ms`,
          inline: true,
        },
        {
          name: "Channel Count",
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        {
          name: "Created On",
          value: `${utc(guild.createdTimestamp).format("LL - LTS")}`,
          inline: true,
        },
        {
          name: "Time Away from Creation",
          value: `${utc(guild.createdTimestamp).fromNow()}`,
          inline: true,
        },
        {
          name: "Member Count",
          value: `${guild.members.cache.size}`,
          inline: true,
        },
        {
          name: "Owner",
          value: `${client.users.cache.get(guild.ownerId).username}`,
          inline: true,
        },
        {
          name: "Boost Level",
          value: `${boost_levels[guild.premiumTier]}`,
          inline: true,
        },
        {
          name: "Boosts",
          value: `${guild.premiumSubscriptionCount}`,
          inline: true,
        },
        {
          name: "Features",
          value: `${returnRecent15FeatureFlags()}`,
        },
      ]);
    await interaction.editReply({
      embeds: [serverinfo_embed],
    });
  },
};
