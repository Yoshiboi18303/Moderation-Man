const { SlashCommandBuilder } = require("@discordjs/builders");
const Suggestions = require("../../schemas/suggestionSchema");
const Users = require("../../schemas/userSchema");
const { MessageEmbed } = require("discord.js");
const wait = require("util").promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("acceptfeature")
    .setDescription("Accepts a feature suggestion")
    .addStringOption((option) =>
      option.setName("id").setDescription("The suggestion id").setRequired(true)
    ),
  config: {
    timeout: ms("30s"),
    message:
      "Accepting suggestions can wait, don't you have anything better to do than spam me?",
  },
  async execute(interaction) {
    if (interaction.guild.id != config.bot.testServerId)
      return await interaction.reply({
        content: `This command is restricted to **${
          client.guilds.cache.get(config.bot.testServerId).name
        }** only!`,
        ephemeral: true,
      });
    if (!admins.includes(interaction.user.id))
      return await interaction.reply({
        content: "You aren't an admin, so you can't run this command!",
        ephemeral: true,
      });
    var channel = client.channels.cache.get("902031074979360818");
    var id = interaction.options.getString("id");
    await interaction.deferReply({ ephemeral: true });
    Suggestions.findOne({ id: id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `There's not a suggestion in the database with the id: \`${id}\`!`
          )
          .setTimestamp();
        return await interaction.editReply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        var suggestor = client.users.cache.get(data.suggestor);
        Users.findOne({ id: suggestor.id }, async (e, udata) => {
          if (e) throw e;
          var message = await channel.messages.cache.get(data.embed);
          var suggestion = data.suggestion;
          const accepted_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Yay!")
            .setDescription(
              `${emojis.yay} **-** Your suggestion "${suggestion}" got accepted by **${interaction.user.username}**`
            );
          const new_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("New Suggestion (accepted)")
            .addFields([
              {
                name: "Suggestion",
                value: `${suggestion}`,
                inline: true,
              },
              {
                name: "Acceptor",
                value: `${interaction.user.username}`,
                inline: true,
              },
            ]);
          try {
            await suggestor.send({
              embeds: [accepted_embed],
            });
          } catch (err) {
            await interaction.editReply({
              content:
                "I can't send a DM to the suggestor, so I'm just gonna accept the suggestion.",
            });
          }
          await message.edit({
            embeds: [new_embed],
          });
          await wait(5000);
          const done_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Finished")
            .setDescription(
              `Successfully accepted suggestion with the ID of **${id}**!`
            )
            .setTimestamp();
          await interaction.editReply({
            embeds: [done_embed],
          });
          udata = await Users.findOneAndUpdate(
            {
              id: suggestor.id,
            },
            {
              acceptedsuggestion: true,
            }
          );
          udata.save();
          await Suggestions.findOneAndDelete({ id: id });
        });
      }
    });
  },
};
