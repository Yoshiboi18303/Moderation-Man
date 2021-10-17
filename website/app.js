const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { getCommands } = require('../utils');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.', 'views'))

app.use('/static', express.static("website/static"))

app.get(['/', '/home'], (req, res) => {
  res
    .status(200)
    .render('index')
})

app.get(['/cmds', '/commands'], (req, res) => {
  const commands = getCommands();
  res
    .status(200)
    .render('commands', { commands })
})

app.listen(port)
console.log(`${client.user.username} website is listening on port ${port}!`)