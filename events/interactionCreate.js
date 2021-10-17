module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if(interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName)
      var timeouts = []

      if(!command) return;

      console.log(`Trying to execute command "${interaction.commandName}"...`)
      try {
        await command.execute(interaction)
      } catch(e) {
        console.error(e)
        if(interaction.replied || interaction.deferred) {
         return interaction.followUp({
          content: 'There was an error executing this command! This has been reported to the developer(s).',
            ephemeral: true
          })
        } else {
          return interaction.reply({
          content: 'There was an error executing this command! This has been reported to the developer(s).',
            ephemeral: true
          })
        }
      }
    } else {
      return
    }
  }
}