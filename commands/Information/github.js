const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { utc } = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Get info on something GitHub related")
    .addSubcommand((sc) =>
      sc
        .setName("user")
        .setDescription("View info on a GitHub user")
        .addStringOption((option) =>
          option
            .setName("username")
            .setDescription("The username to search by")
            .setRequired(true)
        )
    )
    .addSubcommand((sc) =>
      sc
        .setName("repository")
        .setDescription("View info on a GitHub repository")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the repository")
            .setRequired(true)
        )
    ),
  config: {
    timeout: ms("6s"),
    message: "Calm it down with the viewing.",
  },
  async execute(interaction) {
    var fetch = await import("node-fetch");
    var subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "user":
        var username = interaction.options.getString("username");
        const user_fetch = await fetch.default(
          `https://api.github.com/users/${username}`,
          {
            method: "GET",
            headers: {
              // The PAT is my personal access token.
              Authorization: `Yoshiboi18303:${process.env.PAT}`,
            },
          }
        );
        var data = await user_fetch.json();
        // console.log(data)
        if (data.message && data.message === "Not Found") {
          const invalid_username_embed = new MessageEmbed()
            .setColor(colors.red)
            .setTitle("Invalid Username")
            .setDescription("That user was not found!");
          return await interaction.reply({
            embeds: [invalid_username_embed],
          });
        }
        const gh_user_embed = new MessageEmbed()
          .setColor("BLURPLE")
          .setTitle(`Info on ${data.login}`)
          .setDescription("More info can be found on the user's profile.")
          .addFields([
            {
              name: "Follower Count",
              value: `${data.followers}`,
              inline: true,
            },
            {
              name: "Created On",
              value: `${utc(data.created_at).format("LL LTS")} - ${utc(
                data.created_at
              ).fromNow()}`,
              inline: true,
            },
            {
              name: "Last Updated On",
              value: `${utc(data.updated_at).format("LL LTS")} - ${utc(
                data.updated_at
              ).fromNow()}`,
              inline: true,
            },
            {
              name: "Public Repository Count",
              value: `${data.public_repos}`,
              inline: true,
            },
            {
              name: "Profile",
              value: `[View ${data.login}'s Profile](${data.html_url}
               )`,
              inline: true,
            },
          ]);
        await interaction.reply({
          embeds: [gh_user_embed],
        });
        break;
      case "repository":
        if (interaction.guild.id != config.bot.testServerId)
          return await interaction.reply({
            content: `This part of the command is restricted to **${
              client.guilds.cache.get(config.bot.testServerId).name
            }** for the moment!`,
            ephemeral: true,
          });
        /*
        return await interaction.reply({
          content: "Coming Soon!",
          ephemeral: true,
        });
        */
        var name = interaction.options.getString("name");
        const repo_search_fetch = await fetch.default(
          `https://api.github.com/search/repositories?q=${name}`,
          {
            method: "GET",
            headers: {
              Authorization: `Yoshiboi18303:${process.env.PAT}`,
            },
          }
        );
        var repo_search_data = await repo_search_fetch.json();
        console.log(repo_search_data, typeof repo_search_data);

        await interaction.reply({
          content: "Check the console!",
        });
        break;
    }
  },
};
