const port = process.env.PORT || 3000;
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
const { MessageEmbed, MessageAttachment, Permissions } = require("discord.js");
const Profiles = require("../schemas/profileSchema");
const AsciiTable = require("ascii-table");
let command_index = 1;
let event_index = 1;
let mongo_event_index = 1;
const Users = require("../schemas/userSchema");
const c = require("colors");
const CountingSystems = require("../schemas/countSysSchema");

module.exports = {
  name: "ready",
  async execute() {
    const commands = [];
    const command_table = new AsciiTable(
      `${client.user.username} Commands`
    ).setHeading("Command Number", "Name", "Description");
    const client_event_table = new AsciiTable("Client Events").setHeading(
      "Event Number",
      "Name"
    );
    for (var [id, cmd] of client.commands) {
      var push = {
        command: cmd.data.name,
        desc: cmd.data.description,
      };
      command_table.addRow(
        `${command_index}`,
        `${cmd.data.name}`,
        `${cmd.data.description}`
      );
      command_index = command_index + 1;
      commands.push(push);
    }
    for (var [id, event] of client.events) {
      client_event_table.addRow(`${event_index}`, `${event.name}`);
      event_index = event_index + 1;
    }
    const mongo_event_table = new AsciiTable("MongoDB Events").setHeading(
      "Event Number",
      "Name"
    );
    for (var [id, event] of client.mongoEvents) {
      mongo_event_table.addRow(`${mongo_event_index}`, `${event.name}`);
      mongo_event_index = mongo_event_index + 1;
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

    /*
    var d = await servicesReq.json();
    console.log(d);
    */

    var servicesCommands = await fetch.default(
      `https://api.discordservices.net/bot/${client.user.id}/commands`,
      {
        method: "POST",
        headers: servicesHeaders,
        body: JSON.stringify(commands),
      }
    );

    /*
    d = await servicesCommands.json();
    console.log(d);
    */

    var req = await fetch.default(infinityLink, {
      method: "POST",
      headers: infinityHeaders,
      body: JSON.stringify(infinityBody),
    });
    // json = await req.json()
    // console.log(json)

    var botId = client.ready ? client.user.id : "891070722074611742";

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

    botlistReqLink = `${motionBaseURL}/bots/${botId}/stats`;
    botlistReqHeaders = {
      "Content-Type": "application/json",
      key: process.env.KEY_TO_MOTION,
    };
    botlistReqBody = {
      guilds: client.guilds.cache.size,
    };

    botlistReq = await fetch.default(botlistReqLink, {
      method: "POST",
      headers: botlistReqHeaders,
      body: JSON.stringify(botlistReqBody),
    });

    data = await botlistReq.json();
    console.log(data);

    /* 
      botlistReqLink = `https://discordlistology.com/api/v1/bots/${botId}/stats`;
    botlistReqHeaders = {
      "Content-Type": "application/json",
      Authorization: process.env.DISCORDLISTOLOGY,
    };
    botlistReqBody = {
      servers: client.guilds.cache.size,
      shards: returnShardCount,
    };
    */

    const status_types = ["LISTENING", "PLAYING", "WATCHING"];
    setInterval(() => {
      const statuses = [
        `${client.guilds.cache.get("892603177248096306").name}`,
        `${client.users.cache.size} Users`,
        `discord.js v13`,
        `Coded by ${client.users.cache.get("697414293712273408").tag}`,
        `${client.guilds.cache.size} Guilds`,
        `${config.bot.website.origin}`,
        `Make money with my Economy system!`,
      ];
      var status = statuses[Math.floor(Math.random() * statuses.length)];
      status += " | /help";
      var type = status_types[Math.floor(Math.random() * status_types.length)];
      client.user.setActivity(`${status}`, {
        type,
      });
    }, 10000);
    client.stats.on("post", (status) => {
      if (!status) console.log("Last post was successful!");
      else console.error(status);
    });

    botlistReq = await fetch.default(botlistReqLink, {
      method: "POST",
      headers: botlistReqHeaders,
      body: JSON.stringify(botlistReqBody),
    });

    /*
    data = await botlistReq.json();
    console.log(data);
    */

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

    botlistReqLink = `https://radarbotdirectory.xyz/api/bot/${botId}/stats`;
    botlistReqHeaders = {
      "Content-Type": "application/json",
      Authorization: `${process.env.RADAR_KEY}`,
    };
    botlistReqBody = {
      shards: returnShardCount,
      guilds: client.guilds.cache.size,
    };

    botlistReq = await fetch.default(botlistReqLink, {
      method: "POST",
      headers: botlistReqHeaders,
      body: JSON.stringify(botlistReqBody),
    });

    data = await botlistReq.json();
    console.log(data);

    botlistReqLink = `${dlsBaseURL}/bots/${botId}`;
    botlistReqHeaders = {
      "Content-Type": "application/json",
      Authorization: `${process.env.MAIN_DLS_API_KEY}`,
    };
    botlistReqBody = {
      serverCount: client.guilds.cache.size,
    };

    botlistReq = await fetch.default(botlistReqLink, {
      method: "POST",
      headers: botlistReqHeaders,
      body: JSON.stringify(botlistReqBody),
    });

    data = await botlistReq.json();
    console.log(data);

    await client.stats.registerCustomFieldHandler(1, async function () {
      var documents = await Profiles.countDocuments();
      return `${await documents}`;
    });
    await client.stats.registerCustomFieldHandler(2, async function () {
      var documents = await CountingSystems.countDocuments();
      return `${await documents}`;
    });

    var b = `${client.user.username}`.rainbow.underline.bold;

    client.boat
      .postStats(client.guilds.cache.size, botId)
      .then(() => console.log("Successfully sent bot data to Discord Boats!"))
      .catch((err) => console.error(err));
    await client.stats.autopost();
    client.autoposter.on("posted", () => {
      var bot_list_link = "Top.gg".random;
      console.log(`Successful sent bot data to ${bot_list_link}!`);
    });
    const channel = client.channels.cache.get("904421522205204531");
    const ready_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("Ready!")
      .setDescription(
        `**${client.user.username}** has logged on! Now running with **${returnShardCount}** shard(s) in **${client.guilds.cache.size}** guilds!`
      );
    await channel.send({
      embeds: [ready_embed],
    });
    if (client.commands.size < 50) {
      const commands_embed = new MessageEmbed()
        .setColor(colors.purple)
        .setTitle("Commands")
        .setDescription(`\`\`\`\n${command_table.toString()}\n\`\`\``);
      await channel.send({
        embeds: [commands_embed],
      });
    } else {
      const command_buffer = Buffer.from(command_table.toString());
      const command_attachment = new MessageAttachment(
        command_buffer,
        "commands.txt"
      );
      await channel.send({
        files: [command_attachment],
      });
    }
    if (client.events.size < 15) {
      const events_embed = new MessageEmbed()
        .setColor(colors.blue)
        .setTitle("Client Events")
        .setDescription(`\`\`\`\n${client_event_table.toString()}\n\`\`\``);
      await channel.send({
        embeds: [events_embed],
      });
    } else {
      const event_buffer = Buffer.from(event_table.toString());
      const event_attachment = new MessageAttachment(
        event_buffer,
        "events.txt"
      );
      await channel.send({
        files: [event_attachment],
      });
    }

    const mongo_events_embed = new MessageEmbed()
      .setColor(colors.mint_green)
      .setTitle("MongoDB Events")
      .setDescription(`\`\`\`\n${mongo_event_table.toString()}\n\`\`\``);
    await channel.send({
      embeds: [mongo_events_embed],
    });
    console.log(`${b} has logged on!`);
    // webhook.send("BurnLimited is awesome, this webhook message is a test.")
  },
};
