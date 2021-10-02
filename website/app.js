const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, '.', 'views'))

app.get(['/', '/home'], (req, res) => {
  res
    .status(200)
    .send('Hosting is working!')
})

app.listen(port)
console.log(`${client.user.username} website is listening on port ${port}!`)