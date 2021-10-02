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

global.Discord = require('discord.js');
global.client = client;
global.moment = require('moment');
global.ms = require('ms');

client.commands = new Collection();

const functions = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
const commandFolder = fs.readdirSync('./commands/');

(async () => {
  for(const file of functions) {
    require(`./functions/${file}`)(client)
  }

  client.handleEvents(eventFiles, "./events");
  client.handleCommands(commandFolder, "./commands")
  client.login(token)
})()