const { MessageEmbed } = require("discord.js");
const colors = require("../colors.json");
const log_id = "892607019138310205";
const guild_id = "892603177248096306";

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    if (member.guild.id == guild_id) {
      var user = member.user;
      var guild = member.guild;
      var owner = client.users.cache.get(guild.ownerId);
      guild.bans.fetch().then((bans) => {
        var ban = bans.find((ban) => ban.user.id === member.user.id);
        if (ban !== undefined) {
          return client.channels.cache.get(log_id).send({
            content: `The ban hammer was swung on **${member.user.tag}**.`,
          });
        } else {
          if (!member.user.bot) {
            const user_left_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("A Member Left...")
              .setDescription(
                `**${user.username}** left **${guild.name}**, see you later old buddy... 😦`
              );
            client.channels.cache
              .get(log_id)
              .send({ embeds: [user_left_embed] });
          } else {
            const bot_left_embed = new MessageEmbed()
              .setColor(colors.blue)
              .setTitle("A Bot Left...")
              .setDescription(
                `**${user.username}** left **${guild.name}**, see you later bot... 😦`
              );
            client.channels.cache
              .get(log_id)
              .send({ embeds: [bot_left_embed] });
          }
        }
      });
    } else {
      return;
    }
  },
};
