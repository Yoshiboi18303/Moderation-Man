const { SlashCommandBuilder } = require('@discordjs/builders');
const Users = require('../../schemas/userSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voted")
    .setDescription("Shows if you have voted for the bot"),
  async execute(interaction) {
    Users.findOne({ id: interaction.user.id }, async (err, data) => {
      if(err) throw err
      if(!data) {
        data = new Users({
          id: interaction.user.id
        })
        data.save()
        if(!data.voted) return await interaction.reply({ content: "You haven't voted yet.", ephemeral: true })
        await interaction.reply({ content: "You have voted!", ephemeral: true })
      } else {
        if(!data.voted) return await interaction.reply({ content: "You haven't voted yet.", ephemeral: true })
        await interaction.reply({ content: "You have voted!", ephemeral: true })
      }
    })
  }
}