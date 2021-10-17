const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (client) => {
  client.commandArray = [];
  client.handleCommands = async (commandFolders, path) => {
    for(folder of commandFolders) {
      const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'))
      for(const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`)

        client.commands.set(command.data.name, command)
        client.commandArray.push(command.data.toJSON())
      }
    }

  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

  (async () => {
	   try {
       const clientID = "897538650542321684"
       const guildID = "892603177248096306"
	    	console.log('Started refreshing application (/) commands.');

	    	await rest.put(
	    		Routes.applicationGuildCommands(clientID, guildID),
	  		{ body: client.commandArray },
		    );

  	  	console.log('Successfully reloaded application (/) commands.');
	    } catch (error) {
	    	console.error(error);
	    }
    })();
  };
}