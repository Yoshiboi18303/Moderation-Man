const port = process.env.PORT || 3000;
const { WebhookClient } = require('discord.js');
const webhook = new WebhookClient({ id: '891438504662429718', token: process.env.WTOKEN });
const mongo = require('../mongo');

module.exports = {
  name: 'ready',
  async execute() {
    require('../website/app')
    await mongo(process.env.MONGO_CS)
    .then(console.log("MM >>> Connected to MongoDB!"))
    .catch(e => console.error(e))
    const statuses = [`${client.guilds.cache.get('879563241532051476').name}`, `${client.users.cache.size} Users`, `discord.js v13`, `Coded by ${client.users.cache.get('697414293712273408').tag}`]
    console.log(`${client.user.username} has logged on!`)
    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      client.user.setActivity(`${status}`, {
        type: "WATCHING"
      })
    }, 10000)
    // webhook.send("BurnLimited is awesome, this webhook message is a test.")
  }
}