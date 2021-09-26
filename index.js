console.clear();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: 32767 });
const token = process.env.TOKEN;
const mongo = require('./mongo');

global.client = client
global.moment = require('moment')

client.commands = new Collection();

const functions = fs.readdirSync('./functions/').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
const commandFolder = fs.readdirSync('./commands/');

(async () => {
  for(const file of functions) {
    require(`./functions/${file}`)(client)
  }

  await mongo(process.env.MONGO_CS)
  .then(console.log("MM >>> Connected to MongoDB!"))
  .catch(e => console.error(e))

  client.handleEvents(eventFiles, "./events");
  client.handleCommands(commandFolder, "./commands")
  client.login(token)
})()