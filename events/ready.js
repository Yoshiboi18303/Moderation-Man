const port = process.env.PORT || 3000;
const mongo = require("../mongo");
const reqHeaders = {
  "Content-Type": "application/json",
  Authorization: process.env.DEL_API_KEY,
};
const infinityHeaders = {
  "Content-Type": "application/json",
  Authorization: process.env.INFINITY_API_TOKEN,
};
const servicesHeaders = {
  "Content-Type": "application/json",
  Authorization: process.env.SERVICES_API_KEY,
};
const mbl = require("motionbotlist");

module.exports = {
  name: "ready",
  async execute() {
    const commands = [];
    for (var [id, cmd] of client.commands) {
      var push = {
        command: cmd.data.name,
        desc: cmd.data.description,
      };
      commands.push(push);
    }
    var returnShardCount = client.ready ? client.shard.count : 1; // This will help when I make the bot with a ShardingManager.
    const fetch = await import("node-fetch");
    const link = `https://api.discordextremelist.xyz/v2/bot/${client.user.id}/stats`;
    const infinityLink = `https://api.infinitybotlist.com/bot/${client.user.id}`;
    const reqBody = {
      guildCount: client.guilds.cache.size,
      shardCount: returnShardCount,
    };
    const servicesBody = {
      servers: client.guilds.cache.size,
      shards: returnShardCount,
    };
    const infinityBody = {
      servers: client.guilds.cache.size,
      shards: returnShardCount,
    };
    var res = await fetch.default(link, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify(reqBody),
    });
    // var json = await res.json()
    // console.log(json)
    var f = await fetch.default(
      `https://api.discordextremelist.xyz/v2/bot/${client.user.id}`,
      {
        method: "GET",
      }
    );
    // json = await f.json()
    // console.log(json)
    var servicesReq = await fetch.default(
      `https://api.discordservices.net/bot/${client.user.id}/stats`,
      {
        method: "POST",
        headers: servicesHeaders,
        body: JSON.stringify(servicesBody),
      }
    );
    var d = await servicesReq.json();
    console.log(d);
    var servicesCommands = await fetch.default(
      `https://api.discordservices.net/bot/${client.user.id}/commands`,
      {
        method: "POST",
        headers: servicesHeaders,
        body: JSON.stringify(commands),
      }
    );
    d = await servicesCommands.json();
    console.log(d);
    var req = await fetch.default(infinityLink, {
      method: "POST",
      headers: infinityHeaders,
      body: JSON.stringify(infinityBody),
    });
    // json = await req.json()
    // console.log(json)

    var botId = client.ready ? client.user.id : "891070722074611742";

    let grabbed = await mbl.servers(
      botId,
      process.env.KEY_TO_MOTION,
      client.guilds.cache.size
    );

    console.log(grabbed);

    grabbed = await mbl.grabInfo(botId, process.env.KEY_TO_MOTION);

    console.log(grabbed);

    let botlistReqLink = `https://api.botlist.me/api/v1/bots/${botId}/stats`;
    var botlistReqHeaders = {
      "Content-Type": "application/json",
      Authorization: process.env.API_KEY,
    };
    var botlistReqBody = {
      server_count: client.guilds.cache.size,
      shard_count: returnShardCount,
    };

    var botlistReq = await fetch.default(botlistReqLink, {
      method: "POST",
      headers: botlistReqHeaders,
      body: JSON.stringify(botlistReqBody),
    });

    /*
    data = await botlistReq.json();
    console.log(data);
    */

    botlistReqLink = `https://discordlistology.com/api/v1/bots/${botId}/stats`;
    botlistReqHeaders = {
      "Content-Type": "application/json",
      Authorization: process.env.DISCORDLISTOLOGY,
    };
    botlistReqBody = {
      servers: client.guilds.cache.size,
      shards: returnShardCount,
    };

    botlistReq = await fetch.default(botlistReqLink, {
      method: "POST",
      headers: botlistReqHeaders,
      body: JSON.stringify(botlistReqBody),
    });

    data = await botlistReq.json();
    console.log(data);

    botlistReqLink = `https://discords.com/api/bot/${botId}`;
    botlistReqHeaders = {
      "Content-Type": "application/json",
      Authorization: process.env.DISCORDBOTLIST,
    };
    botlistReqBody = {
      server_count: client.guilds.cache.size,
    };

    botlistReq = await fetch.default(botlistReqLink, {
      method: "POST",
      headers: botlistReqHeaders,
      body: JSON.stringify(botlistReqBody),
    });

    /*
    data = await botlistReq.json()
    console.log(data)
    */

    client.boat
      .postStats(client.guilds.cache.size, botId)
      .then(() => console.log("Successfully sent bot data to Discord Boats!"))
      .catch((err) => console.error(err));
    await client.stats.autopost();
    await mongo(process.env.MONGO_CS)
      .then(console.log("MM >>> Connected to MongoDB!"))
      .catch((e) => console.error(e));
    const statuses = [
      `${client.guilds.cache.get("892603177248096306").name}`,
      `${client.users.cache.size} Users`,
      `discord.js v13`,
      `Coded by ${client.users.cache.get("697414293712273408").tag}`,
      `${client.guilds.cache.size} Guilds`,
      `${config.bot.website.origin}`,
      `Make money with my Economy system!`,
    ];
    const status_types = ["LISTENING", "PLAYING", "WATCHING"];
    client.autoposter.on("posted", () => {
      console.log("Successful sent bot data to Top.gg!");
    });
    const channel = client.channels.cache.get("904421522205204531");
    await channel.send({
      content: `${client.user.username} has logged on! Now running with ${returnShardCount} shard(s) in ${client.guilds.cache.size} guilds!`,
    });
    console.log(`${client.user.username} has logged on!`);
    setInterval(() => {
      var status = statuses[Math.floor(Math.random() * statuses.length)];
      status += " | /help";
      var type = status_types[Math.floor(Math.random() * status_types.length)];
      client.user.setActivity(`${status}`, {
        type: type,
      });
    }, 10000);
    client.stats.on("post", (status) => {
      if (!status) console.log("Last post was successful!");
      else console.error(status);
    });
    // webhook.send("BurnLimited is awesome, this webhook message is a test.")
  },
};
