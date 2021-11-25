const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const weather = require("weather-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("View weather information on a given location")
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("The location to search for")
        .setRequired(true)
    ),
  config: {
    timeout: ms("30s"),
    message: "You shouldn't just spam this information in your server.",
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    var location = interaction.options.getString("location");

    weather.find({ search: location }, async (error, result) => {
      if (error) {
        await interaction.editReply({
          content: `Something went wrong! Please DM \`Yoshiboi18303#4045\`!`,
          ephemeral: true,
        });
        console.error(error);
      } else if (result == undefined || result.length == 0) {
        await interaction.editReply({
          content: "Invalid location.",
          ephemeral: true,
        });
      } else {
        var current = result[0].current;
        var location = result[0].location;

        // console.log(current, location)
        // return await interaction.reply({ content: 'Check the console!', ephemeral: true })

        const weather_embed = new MessageEmbed()
          .setColor(interaction.member.displayHexColor || "RANDOM")
          .setTitle(`Weather for ${location.name}`)
          .setDescription(`${current.skytext}`)
          .setThumbnail(current.imageUrl)
          .addField("Degree Type", location.degreetype, true)
          .addField("Temperature", `${current.temperature}°`, true)
          .addField("Humidity", `${current.humidity}%`, true)
          .addField("Wind", current.winddisplay, true)
          .addField("Feels Like", `${current.feelslike}°`, true)
          .addField("Timezone", `UTC${location.timezone}`, true)
          .setFooter(
            `${interaction.user.username} requested this.`,
            interaction.user.displayAvatarURL({
              dynamic: false,
              format: "png",
              size: 32,
            })
          )
          .setTimestamp();
        await interaction.editReply({
          embeds: [weather_embed],
          ephemeral: true,
        });
      }
    });
  },
};
