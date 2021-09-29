const Warnings = require('../../schemas/warningSchema');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user for breaking your rules!")
    .addUserOption(option => option.setName("user").setDescription("Choose a user to warn").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("Type in a reason for this warn").setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return await interaction.editReply({ content: "You don't have the `MANAGE_MESSAGES` permission, so you can't run this command!", ephemeral: true })
    const user = interaction.options.getUser("user")
    if(user.id == client.user.id) return await interaction.editReply({ content: "You can't warn the client!", ephemeral: true })
    if(user.id == interaction.user.id) return await interaction.editReply({ content: "You can't warn yourself!", ephemeral: true })
    const reason = interaction.options.getString("reason")
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("SUCCESS")
          .setLabel("YES")
          .setEmoji("✅")
          .setCustomId("warning-confirm"),
        new MessageButton()
          .setStyle("DANGER")
          .setLabel("NO")
          .setEmoji("❌")
          .setCustomId("warning-cancel")
      )
    await interaction.editReply({ content: "Are you sure you want to warn this member?\nYou have 30 seconds to confirm your action.", ephemeral: true, components: [row] })

    const filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id
    }

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      max: 1,
      time: 1000 * 30
    })

    collector.on('end', async (collection) => {
      if(collection.first()?.customId == 'warning-confirm') {
        Warnings.findOne({ 
          id: user.id,
          guild: interaction.guild.id
        }, async (err, data) => {
          if(err) throw err;
          if(!data) {
            data = new Warnings({
              guild: interaction.guild.id,
              id: user.id,
              context: [{
                moderator: interaction.user.id,
                reason: reason
              }]
            })
          } else {
            const object = {
              moderator: interaction.user.id,
              reason: reason
            }
            data.context.push(object)
          }
          data.save()
        })
        await interaction.editReply({ content: `Successfully warned **${user.username}**!`, ephemeral: true, components: [] })
        if(!user.bot) {
          user.send({ content: `You have been warned in **${interaction.guild.name}** by moderator **${interaction.user.username}** for reason "${reason}"` })
        } else {
          return
        }
      } else if(collection.first()?.customId == 'warning-cancel') {
        await interaction.editReply({ content: 'The yellow flag has been cancelled.', ephemeral: true, components: [] })
      } else {
        await interaction.editReply({ content: "You didn't respond in time.", ephemeral: true, components: [] })
      }
    })
  }
}