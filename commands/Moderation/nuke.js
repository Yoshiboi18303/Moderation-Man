const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Nukes the current channel (which deletes it) and rebuilds it fresh!"),
  async execute(interaction) {
    if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return await interaction.reply({ content: 'You don\'t have the `MANAGE_CHANNELS` permission, so you can\'t run this command!', ephemeral: true })
    const channel = interaction.channel
    // console.log(interaction.channel)
    // interaction.reply({ content: 'Check the console!', ephemeral: true })
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("SUCCESS")
          .setLabel("YES")
          .setCustomId("nuke-yes")
          .setEmoji("💥"),
        new MessageButton()
          .setStyle("DANGER")
          .setLabel("NO")
          .setCustomId("nuke-no")
          .setEmoji("❌"),
      )
    await interaction.reply({
      content: 'Are you sure you want to nuke this channel?\nConfirmation will be cancelled after 30 seconds.',
      ephemeral: true,
      components: [
        row
      ]
    })

    const filter = (btnInt) => {
      return interaction.user.id == btnInt.user.id
    }

    const collector = channel.createMessageComponentCollector({
      filter,
      max: 1,
      time: 1000 * 30
    })

    collector.on('end', async (collection) => {
      if(collection.first()?.customId == 'nuke-yes') {
        await interaction.editReply({ content: 'Nuking channel...', components: [], ephemeral: true })
        await interaction.channel.clone()
        .then(async (cnl) => {
          await cnl.setParent(channel.parent.id)
          await cnl.setPosition(channel.position)
          await channel.delete()
        })
      } else if(collection.first()?.customId == 'nuke-no') {
        return await interaction.editReply({ content: "The nuke has been disarmed.", components: [], ephemeral: true })
      } else {
        return await interaction.editReply({ content: "You didn't respond in time.", components: [], ephemeral: true })
      }
    })
 }
}