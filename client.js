console.log(
  "Starting bot...\n\n--------------------------------------------------------------\n"
);
const { Client, Collection } = require("discord.js");
const fs = require("fs");
const client = new Client({
  intents: 32767,
  allowedMentions: {
    parse: ["users", "roles"],
  },
  shards: "auto",
});
module.exports = client;
const token = process.env.TOKEN;
const { Client: C } = require("statcord.js");
const statcord = new C({
  client,
  key: process.env.STATCORD_KEY,
  postCpuStatistics: true,
  postMemStatistics: true,
  postNetworkStatistics: true,
});
const { AutoPoster } = require("topgg-autoposter");
const ap = AutoPoster(process.env.TOPGG_API_KEY, client);
const BoatsClient = require("boats.js");
const Boats = new BoatsClient(process.env.BOATS_KEY);
const giveawaymanager = require("./items/gmanager");
const WeebyAPI = require("weeby-js");
const weeby = new WeebyAPI(process.env.WEEBY_KEY)

global.Discord = require("discord.js");
global.client = client;
global.bot = client;
global.moment = require("moment");
global.ms = require("ms");
global.emojis = require("./emojis.json");
global.colors = require("./colors.json");
global.config = require("./config.json");
global.MessageEmbed = require("discord.js").MessageEmbed;
global.voteRewards = ["Voice Moderation logs (soon)"];
global.admins = ["482326304381730826", "738988218002964581", config.bot.owner];
global.c = require("colors");
global.BotError = require("./items/classes/BotError");
global.CommandError = require("./items/classes/CommandError");
global.AsciiTable = require("ascii-table");
global.fs = require("fs");
global.cp = require("child_process");
global.mongoose = require("mongoose");
global.path = require("path");
global.commandsUsedRecently = new Set();
global.Enum = {
  Log: {
    Info: 0,
    Error: 1,
    Kick: 2,
    Ban: 3,
    Mute: 4,
    Softban: 5,
    Tempban: 6,
  },
};
global.Log = require("./utils/logger");

client.commands = new Collection();
client.events = new Collection();
client.mongoEvents = new Collection();
client.stats = statcord;
client.autoposter = ap;
client.boat = Boats;
client.giveaways = giveawaymanager;
client.weeby = weeby;

const functions = fs
  .readdirSync("./functions/")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./events/")
  .filter((file) => file.endsWith(".js"));
const commandFolder = fs.readdirSync("./commands/");
const mongoEventFiles = fs
  .readdirSync("./mongoEvents")
  .filter((file) => file.endsWith(".js"));

(async () => {
  for (const file of functions) {
    require(`./functions/${file}`)(client);
  }

  client.stats.on("autopost-start", () => {
    console.log(
      `Autoposting session has started! Now sending data on ${client.user.username} to Statcord!`
    );
  });

  client.handleMongoEvents(mongoEventFiles, "./mongoEvents");
  client.handleClientEvents(eventFiles, "./events");
  client.handleCommands(commandFolder, "./commands");
  client.login(token);
})();
