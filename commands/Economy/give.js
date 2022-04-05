const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give someone some of your coins")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to give")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give the coins to")
        .setRequired(true)
    ),
  config: {
    timeout: ms("10s"),
    message: "You just gave someone money, calm it down a little bit!",
  },
  async execute(interaction) {
    /*

    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true });
    
    */

    var amount = interaction.options.getNumber("amount");
    var user = interaction.options.getUser("user");
    if (amount < 1)
      return await interaction.reply({
        content: "You need to give this specific user at least 1 coin!",
        ephemeral: true,
      });
    if (user.id == interaction.user.id)
      return await interaction.reply({
        content: "You can't give money to yourself!",
      });
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_interaction_user_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            `${emojis.nope} **-** You don't have any data on the Economy system!\n**Run \`/start\` to get some!**`
          )
          .setTimestamp();
        return await interaction.reply({
          embeds: [no_interaction_user_data_embed],
        });
      } else {
        if (data.passive) {
          const passive_embed = new MessageEmbed()
            .setColor(colors.yellow)
            .setTitle("Warning")
            .setDescription(
              "You are a passive user, if you want to donate coins to someone, turn that shit off!"
            )
            .setTimestamp();
          return await interaction.reply({
            embeds: [passive_embed],
          });
        }
        var interaction_user_coins = data.coins;
        if (interaction_user_coins < amount)
          return await interaction.reply({
            content: "You're giving more coins than you already have!",
            ephemeral: true,
          });
        Profiles.findOne({ id: user.id }, async (err, udata) => {
          if (err) throw err;
          if (!udata) {
            const no_user_data_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("Error")
              .setDescription(
                `${emojis.nope} **-** \`${user.username}\` doesn't have any data on the Economy system!\n**Beg them to run \`/start\` to be able to give them some of your coins!**`
              )
              .setTimestamp();
            return await interaction.reply({
              embeds: [no_user_data_embed],
            });
          } else {
            udata = await Profiles.findOneAndUpdate(
              {
                id: user.id,
              },
              {
                $inc: {
                  coins: amount,
                },
              }
            );
            data = await Profiles.findOneAndUpdate(
              {
                id: interaction.user.id,
              },
              {
                $set: {
                  coins: interaction_user_coins - amount,
                },
              }
            );
            udata.save();
            data.save();
            const success_embed = new MessageEmbed()
              .setColor(colors.green)
              .setAuthor(
                `${interaction.user.username}'s generous gift to ${user.username}`
              )
              .setDescription(
                `You have given ${user.username} ${amount} of your coins! Tell them to say thanks once they see this!`
              )
              .setTimestamp();
            await interaction.reply({
              embeds: [success_embed],
            });
          }
        });
      }
    });
  },
};
