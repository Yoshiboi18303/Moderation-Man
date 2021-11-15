const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { wait, yes, nope } = require("../../emojis.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bugreport")
    .setDescription(`Report a bug on the client to the owner!`)
    .addStringOption((option) =>
      option
        .setName("bug")
        .setDescription("Type in the bug to report")
        .setRequired(true)
    ),
  options: {
    guildOnly: false,
  },
  async execute(interaction) {
    const owner = client.users.cache.get("697414293712273408");
    const bug = interaction.options.getString("bug");
    if (bug.length > 1024)
      return await interaction.reply({
        content: `${nope} - Your bug is too long!\nMax Length: 1024\nYour Length: ${bug.length}`,
        ephemeral: true,
      });
    const new_bug_reported_embed = new MessageEmbed()
      .setColor("YELLOW")
      .setTitle("New Bug Reported!")
      .addFields([
        {
          name: "Bug",
          value: `${bug}`,
        },
        {
          name: "Guild of Report",
          value: `${interaction.guild.name}`,
        },
        {
          name: "Bug Reporter",
          value: `${interaction.user.username}`,
        },
      ]);
    await interaction.reply(`Reporting bug... ${wait}`);
    setTimeout(async function () {
      try {
        await owner.send({
          embeds: [new_bug_reported_embed],
        });
        await interaction.editReply(
          `${yes} - Your bug has been reported to **${owner.tag}** in their DMs!`
        );
      } catch (e) {
        await interaction.editReply(
          `${nope} - Whoops! I can't send a DM to Yoshiboi18303!\nYour bug is being sent to a channel in the support server!`
        );
        const channel = client.channels.cache.get("909146026038939688");
        await channel.send({
          content: `<@${owner.id}>`,
          embeds: [new_bug_reported_embed],
        });
      }
    }, 5000);
  },
};
