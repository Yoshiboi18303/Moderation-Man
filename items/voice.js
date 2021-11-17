const returnShardCount = client.ready ? client.shard.count : 1;
const clientId = client.ready ? client.user.id : "891070722074611742";
const { createAudioPlayer } = require("@discordjs/voice");

const voice = createAudioPlayer();

module.exports = voice;
