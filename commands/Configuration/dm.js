const { SlashCommandBuilder } = require('@discordjs/builders');
const Users = require('../../schemas/userSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Changes whether you want to get dmed by the client")
    .addBooleanOption(option => option.setName("dmable").setDescription("Do you want to get dmed?").setRequired(true)),
  async execute(interaction) {
    var able_to_be_dmed = interaction.options.getBoolean("dmable")
    Users.findOne({ id: interaction.user.id }, async (err, data) => {
      if(err) throw err
      if(!data) {
        data = new Users({
          id: interaction.user.id,
          dmable: able_to_be_dmed
        })
        data.save()
        await interaction.reply({ content: `Successfully set your client DM state to \`${able_to_be_dmed}\`!` })
      } else {
        data = await Users.findOneAndUpdate({
          id: interaction.user.id
        },
        {
          dmable: able_to_be_dmed
        })
        data.save()
        await interaction.reply({ content: `Successfully changed your client DM state to \`${able_to_be_dmed}\`` })
      }
    })
  }
}