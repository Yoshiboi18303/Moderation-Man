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
const Distube = require('distube');
/*
const SoundCloudPlugin = require('@distube/soundcloud')
const SpotifyPlugin = require('@distube/spotify')
*/

global.Discord = require('discord.js');
global.client = client;
global.moment = require('moment');
global.ms = require('ms');
global.emojis = require('./emojis.json');
global.colors = require('./colors.json');
global.config = require('./config.json');

const distube = new Distube.default(client, {
  searchSongs: 1,
	searchCooldown: 30,
	leaveOnEmpty: true,
	emptyCooldown: 10,
	leaveOnFinish: true,
	leaveOnStop: true/*,
	plugins: [new SoundCloudPlugin(), new SpotifyPlugin()]*/
})

client.commands = new Collection();
client.distube = distube

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