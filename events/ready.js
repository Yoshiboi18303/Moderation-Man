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

module.exports = {
  name: "ready",
  async execute() {
    const fetch = await import("node-fetch");
    const link = `https://api.discordextremelist.xyz/v2/bot/${client.user.id}/stats`;
    const infinityLink = `https://api.infinitybotlist.com/bot/${client.user.id}`;
    const reqBody = {
      guildCount: client.guilds.cache.size,
    };
    var status = "Dashboard in Development!";
    status += " | /help";
    client.user.setActivity(`${status}`, {
      type: "WATCHING",
    });
    const infinityBody = {
      servers: client.guilds.cache.size,
      shards: client.ready ? client.shard.count : 1,
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
    var req = await fetch.default(infinityLink, {
      method: "POST",
      headers: infinityHeaders,
      body: JSON.stringify(infinityBody),
    });
    // json = await req.json()
    // console.log(json)

    var botId = client.ready ? client.user.id : "891070722074611742";

    client.boat
      .postStats(client.guilds.cache.size, botId)
      .then(() => console.log("Successfully sent bot data to Discord Boats!"))
      .catch((err) => console.error(err));
    require("../website/app");
    await client.stats.autopost();
    await mongo(process.env.MONGO_CS)
      .then(console.log("M-TEST-M >>> Connected to MongoDB!"))
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
    client.autoposter.on("posted", () => {
      console.log("Successful sent bot data to Top.gg!");
    });
    console.log(`${client.user.username} has logged on!`);
    /*
    setInterval(() => {
      var status = statuses[Math.floor(Math.random() * statuses.length)]
      status += " | /help"
      client.user.setActivity(`${status}`, {
        type: "WATCHING"
      })
    }, 10000)
    */
    client.stats.on("post", (status) => {
      if (!status) console.log("Successful Post");
      else console.error(status);
    });
    // webhook.send("BurnLimited is awesome, this webhook message is a test.")
  },
};
