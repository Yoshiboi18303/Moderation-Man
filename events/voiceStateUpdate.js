module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    if(newState.channelId && newState.channel.type === "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
        try {
          await newState.guild.me.voice.setSuppressed(false)
        } catch (e) {
          console.error(e)
        }
    }
  }
}