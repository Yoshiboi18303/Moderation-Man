module.exports = {
  name: "messageReactionAdd",
  once: false,
  async execute(messageReaction, user) {
    var reaction = messageReaction;
    if (reaction.message.guild.id == config.bot.testServerId) {
      console.log(reaction, user);
    }
  },
};
