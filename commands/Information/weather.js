const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("View weather information on a given location")
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("The location to search for")
        .setRequired(true)
    )
    .addStringOption((option) => option.setName("degreetype").setDescription("The degree type to use for the weather").setRequired(true).addChoice("celsius", "celsius").addChoice("fahrenheit", "fahrenheit")),
  config: {
    timeout: ms("5s"),
    message: "You shouldn't just spam this information in your server.",
  },
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    /*
    if(interaction.guild.id != config.bot.testServerId) return await interaction.reply({ content: "This command is having a bit of a rewrite, please wait until it's done!" })
    */
    const fetch = await import("node-fetch")
    await interaction.deferReply();
    var location = interaction.options.getString("location");
    var dgtype = interaction.options.getString("degreetype");
    dgtype = dgtype[0]
    dgtype = dgtype.replace(dgtype, dgtype.toUpperCase());
    var f = await fetch.default(`https://weebyapi.xyz/utility/weather?location=${location}&degreetype=${dgtype}&token=${process.env.WEEBY_KEY}`)
    var data = await f.json()
    // console.log(data)
    if(data.status != 200 || data.status == 404) {
      const invalid_location_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Error")
        .setDescription("That's an invalid location! Please make sure that the location that you put in is spelt correctly.")
        .setTimestamp()
      return await interaction.editReply({
        embeds: [invalid_location_embed]
      })
    }
    var wsd = [
      `\`Wind Speed:\` ${data.windSpeed}`,
      `\`Wind Display:\` ${data.windDisplay}`
    ]
    const weather_embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Weather In ${data.observationPoint}`)
      .setThumbnail(`${data.conditionsImageURL}`)
      .addFields([
        {
          name: "Conditions",
          value: `${data.conditions}`,
          inline: true
        },
        {
          name: "Temperature",
          value: `${data.temperature}${data.degreeType}`,
          inline: true
        },
        {
          name: "Feels Like",
          value: `${data.feelsLike}${data.degreeType}`,
          inline: true
        },
        {
          name: "Wind Speed And Display",
          value: `${wsd.join(",\n")}`,
          inline: true
        },
        {
          name: "Humidity",
          value: `${data.humidity}%`,
          inline: true
        }
      ])
      .setTimestamp()
    await interaction.editReply({
      embeds: [weather_embed]
    })
  },
};
