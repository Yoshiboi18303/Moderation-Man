const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send("Hosting is working!")
})

async function keepAlive(port) {
  if(!port) throw new Error("Please define a port!")
  app.listen(port)
  console.log(`Now listening on port ${port}!`)
}

module.exports = keepAlive