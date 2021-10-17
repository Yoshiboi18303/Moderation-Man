const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const util = require('util');
const Warnings = require('../../schemas/warningSchema');
const Channels = require('../../schemas/channelSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription("Evaluate some code (owner only & dangerous)")
    .addStringOption(option => option.setName("code").setDescription("Type in some code to evaluate").setRequired(false)),
  options: {
    guildOnly: false
  },
  async execute(interaction) {
    if(interaction.user.id != config.bot.owner) return await interaction.reply({ content: 'You are **NOT** the owner of this bot!', ephemeral: true })
    const code = interaction.options.getString("code")
    await interaction.deferReply()
    var result = new Promise((resolve, reject) => {
		  resolve(eval(code));
	  })

    var secrets = [
      process.env.TOKEN,
      process.env.KEY,
      client.token
    ]

    result
    .then(async (result) => {
      if (typeof result !== "string") result = util.inspect(result, { depth: 0 });

      for(const term of secrets) {
        if(result.includes(term)) result = result.replace(term, "[SECRET]")
      }
      if(result.length > 2000) {
        const buffer = Buffer.from(result)
        var attachment = new MessageAttachment(buffer, "evaluated.js")
        return await interaction.followUp({ content: 'The result is too long to show on Discord, so here\'s a file.', files: [attachment]})
      }
      await interaction.followUp(`\`\`\`js\n${result}\n\`\`\``);
    })
    .catch(async (result) => {
      if (typeof result !== "string") result = util.inspect(result, { depth: 0 });

      for(const term of secrets) {
        if(result.includes(term)) result = result.replace(term, "[SECRET]")
      }

      await interaction.followUp(`\`\`\`js\n${result}\n\`\`\``)
    })
  }
}