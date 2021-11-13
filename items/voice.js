const returnShardCount = client.ready ? client.shard.count : 1;
const clientId = client.ready ? client.user.id : "891070722074611742";
const { Node } = require("lavalink");
const gateway = require("./gateway");

const voice = new Node({
  password: process.env.LL_PASS,
  userID: clientId,
  shardCount: returnShardCount,
  host: process.env.LL_HOST,
  send(guildID, packet) {
    return gateway.connections
      .get(Long.fromString(guildID).shiftRight(22).mod(this.shardCount))
      .send(packet);
  },
});

module.exports = voice;
