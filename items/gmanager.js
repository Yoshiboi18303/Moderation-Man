const { GiveawaysManager } = require("discord-giveaways");
const cls = ["#1DA619", "#192CA6", "#8716D5", "#00FFFB", "#8BFF8D"];
const client = require("../client");
const path = require("path");
const emojis = require("../emojis.json");

var embedc = cls[Math.floor(Math.random() * cls.length)];
var embedendc = cls[Math.floor(Math.random() * cls.length)];

const manager = new GiveawaysManager(client, {
  storage: path.join(__dirname, "..", "giveaways.json"),
  default: {
    botsCanWin: false,
    embedColor: embedc,
    embedColorEnd: embedendc,
    reaction: emojis.yay,
  },
});

module.exports = manager;
