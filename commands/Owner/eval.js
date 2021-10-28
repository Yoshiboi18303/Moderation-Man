const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const util = require('util');
const Warnings = require('../../schemas/warningSchema');
const Channels = require('../../schemas/channelSchema');
const Profiles = require('../../schemas/profileSchema');
const Users = require('../../schemas/userSchema');
const colors = require('../../colors.json');

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
      process.env.MONGO_CS,
      client.token,
      process.env.STATCORD_KEY
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
      const evaluated_embed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("Evaluation")
        .setDescription(`Successful Evaluation.\n\n\`\`\`js\n${result}\n\`\`\``)
      await interaction.editReply({ embeds: [evaluated_embed] })
    })
    .catch(async (result) => {
      if (typeof result !== "string") result = util.inspect(result, { depth: 0 });

      for(const term of secrets) {
        if(result.includes(term)) result = result.replace(term, "[SECRET]")
      }

      const error_embed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Error Evaluating")
        .setDescription(`An error occurred.\n\n\`\`\`js\n${result}\n\`\`\``)
      await interaction.editReply({ embeds: [error_embed] })
    })
  }
}