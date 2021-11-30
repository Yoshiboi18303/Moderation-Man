const Users = require("../schemas/userSchema");

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async execute(newMember) {
    if (newMember.guild.id != config.bot.testServerId) return;
    console.log(newMember);
  },
};
