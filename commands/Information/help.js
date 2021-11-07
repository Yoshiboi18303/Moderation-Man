const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const hold = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all the commands on Moderation Man!"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    var color_array = [
      "#1DA619",
      "#192CA6",
      "#D4E10F",
      "#D51616",
      "#D5A116",
      "#8716D5",
      "#00FFFB",
      "#8BFF8D",
      "7289DA",
    ];
    var random_color =
      color_array[Math.floor(Math.random() * color_array.length)];
    const help_embed = new MessageEmbed()
      .setColor(random_color)
      .setTitle(`${client.user.username} Commands!`)
      .setDescription(
        `Hello <@${interaction.user.id}>, here are all my commands!`
      )
      .setThumbnail(
        interaction.user.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 512,
        })
      );
    const sending_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription(`${emojis.wait} **-** Trying to send you a DM...`);
    const sent_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("DM Successful!")
      .setDescription(
        `${emojis.yes} **-** All of my commands were sent to your DMs!`
      );
    for (var [id, cmd] of client.commands) {
      help_embed.addField(
        `${cmd.data.name}`,
        `Description: ${cmd.data.description}\nUsage: \`/${cmd.data.name}\``,
        true
      );
    }
    var website_link = "https://moderation-man.ml";
    var support_link = "https://discord.gg/WVyUqBjVah";
    var github_link = "https://github.com/Yoshiboi18303/Moderation-Man";
    const link_row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Website")
        .setURL(website_link),
      /* .setDisabled(true) */ new MessageButton()
        .setStyle("LINK")
        .setLabel("Support Server")
        .setURL(support_link),
      new MessageButton()
        .setStyle("LINK")
        .setLabel("GitHub Repository")
        .setURL(github_link)
    );
    await interaction.editReply({
      embeds: [sending_embed],
      ephemeral: true,
    });
    await hold(4500);
    try {
      await interaction.user.send({
        embeds: [help_embed],
        components: [link_row],
      });
      await interaction.editReply({
        embeds: [sent_embed],
        ephemeral: true,
      });
    } catch (e) {
      const failed_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("DM Failed")
        .setDescription(
          `${emojis.nope} **-** I can't send you a DM, do you want to get the raw embed instead?`
        );
      const re_row = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle("SUCCESS")
          .setLabel("YES")
          .setCustomId("raw-embed-yes")
          .setEmoji("✅"),
        new MessageButton()
          .setStyle("SECONDARY")
          .setLabel("NO")
          .setCustomId("raw-embed-no")
          .setEmoji("❌")
      );
      await interaction.editReply({
        embeds: [failed_embed],
        components: [re_row],
        ephemeral: true,
      });

      const filter = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        max: 1,
      });

      collector.on("end", async (collection) => {
        if (collection.first()?.customId == "raw-embed-yes") {
          await interaction.editReply({
            content: `Okay, fetching the raw embed... ${emojis.wait}`,
            embeds: [],
            components: [],
            ephemeral: true,
          });
          await hold(4500);
          await interaction.editReply({
            content: "Here you go!",
            embeds: [help_embed],
            components: [link_row],
            ephemeral: true,
          });
        } else if (collection.first()?.customId == "raw-embed-no") {
          await interaction.editReply({
            content:
              "Okay then! If you want to get the embed in DMs, just turn on your direct messages from server members.\n`User Settings > Privacy & Safety > Allow direct messages from server members (update this for all servers) OR Server > Dropdown > Privacy Settings > Allow direct messages from server members.`",
            embeds: [],
            components: [],
            ephemeral: true,
          });
        }
      });
    }
  },
};
