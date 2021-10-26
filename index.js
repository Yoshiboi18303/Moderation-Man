console.clear();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ 
  intents: 32767,
  allowedMentions: {
    parse: ['users','roles']
  }
});
const token = process.env.TOKEN;
const { Client: C } = require('statcord.js');
const statcord = new C({
  client,
  key: process.env.STATCORD_KEY,
  postCpuStatistics: true,
  postMemStatistics: true,
  postNetworkStatistics: true
})
const { AutoPoster } = require('topgg-autoposter');
const ap = AutoPoster(process.env.TOPGG_API_KEY, client)

global.Discord = require('discord.js');
global.client = client;
global.moment = require('moment');
global.ms = require('ms');
global.emojis = require('./emojis.json');
global.colors = require('./colors.json');
global.config = require('./config.json');

client.commands = new Collection();
client.stats = statcord;
client.autoposter = ap;

const functions = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
const commandFolder = fs.readdirSync('./commands/');

(async () => {
  for(const file of functions) {
    require(`./functions/${file}`)(client)
  }

  client.stats.on('autopost-start', () => {
    console.log(`Autoposting session has started! Now logging data on ${client.user.username} to Statcord!`)
  })

  client.handleEvents(eventFiles, "./events");
  client.handleCommands(commandFolder, "./commands")
  client.login(token)
})()