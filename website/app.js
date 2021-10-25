const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { getCommands } = require('../utils');
const bot = client.users.cache.get('891070722074611742')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.', 'views'))

app.use('/static', express.static("website/static"))

app.get(['/', '/home'], (req, res) => {
  var link = "https://discord.com/api/oauth2/authorize?client_id=891070722074611742&scope=applications.commands+bot&permissions=3557289014"
  res
    .status(200)
    .render('index', { link })
})

app.get(['/cmds', '/commands'], (req, res) => {
  const commands = getCommands();
  res
    .status(200)
    .render('commands', { commands })
})

app.get('/info', (req, res) => {
  var info = {
    guilds: client.guilds.cache.size,
    users: client.users.cache.size
  }
  res
    .status(200)
    .send(info)
})

app.get(['/developer', '/dev'], (req, res) => {
  var user = client.users.cache.get('697414293712273408')
  res
    .status(200)
    .render('developer', { user })
})

app.get(['/features', '/feats'], (req, res) => {
  res
    .status(200)
    .render('features', { bot })
})

app.listen(port)
console.log(`${client.user.username} website is listening on port ${port}!`)