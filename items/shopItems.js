/*
  These will consist of 6 properties:
    The name of the item, the id of it, the description of it (what it does, etc.), the emoji of it, the image to show, what type of item it is, and its price.
*/

module.exports = [
  {
    item: "Computer",
    id: "laptop",
    desc: "Allows you to start developing stuff",
    emoji: emojis.computer,
    image: "https://cdn.discordapp.com/emojis/927437184846409798.png",
    type: "powerup",
    price: 500,
  },
  {
    item: "Padlock",
    id: "padlock",
    desc: "Secures your wallet from any filthy thieves wanting to steal your money",
    emoji: emojis.padlock,
    image: "https://cdn.discordapp.com/emojis/927438274287501342.png",
    type: "powerup",
    price: 750,
  },
];
