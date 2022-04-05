const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");
const Profiles = require("../../schemas/profileSchema");

const defaultReward = 500;
const streakRewards = {
  0: defaultReward,
  1: defaultReward * 2,
  2: defaultReward * 3,
  3: defaultReward * 4,
  4: defaultReward * 5,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward"),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: `This command is restricted to **${client.guilds.cache.get(config.bot.testServerId).name}** for the moment!`, ephemeral: true });
    */
    const parser = await import("parse-ms");
    await interaction.deferReply();
    Profiles.findOne({ id: interaction.user.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const no_data_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error")
          .setDescription(
            "You don't have any data on this bot! Please run `/start` to get some data on this bot!"
          )
          .setFooter(
            `${interaction.user.username} needs some data lmao.`,
            interaction.user.displayAvatarURL({ dynamic: true, size: 32 })
          )
          .setTimestamp();
        return await interaction.editReply({
          embeds: [no_data_embed],
          ephemeral: true,
        });
      } else {
        var daily = data.lastDaily;
        var timeout = ms("1d");
        var formula = timeout - (Date.now() - daily);
        // console.log(formula, formula > 0)
        if (formula > 0) {
          var time = parser.default(formula);
          // console.log(time);
          const on_timeout_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Failure...")
            .setDescription(
              `Whoops! I'm sorry, but your daily reward is on cooldown for ${time.hours} hours, ${time.minutes} minutes, and ${time.seconds} seconds. Please wait for that long before trying again!`
            )
            .setTimestamp();
          return await interaction.editReply({
            embeds: [on_timeout_embed],
          });
        } else {
          var now = new Date(Date.now());
          var streak = data.dailyStreak;
          const is_weekend =
            now.getDay() == 6 || now.getDay() == 0 || now.getDay() == 1;
          var reward = is_weekend ? defaultReward * 2 : defaultReward;
          data = await Profiles.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $inc: {
                coins: reward,
              },
              $set: {
                lastDaily: Date.now(),
              },
            }
          );
          data.save();
          const claimed_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Claimed!")
            .setDescription(
              `You have successfully claimed your daily reward of ${reward}${
                is_weekend
                  ? " (because it's the weekend, you got double the default amount)"
                  : ""
              } coins!`
            )
            .setTimestamp();
          await interaction.editReply({
            embeds: [claimed_embed],
          });
        }
      }
    });
  },
};
