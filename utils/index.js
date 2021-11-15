const { readdirSync } = require("fs");

function getCommands() {
  let categories = [];
  const value = [];

  readdirSync("./commands").forEach((dir) => {
    const directories = readdirSync(`./commands/${dir}`).filter((file) =>
      file.endsWith(".js")
    );

    const commands = directories.map((command) => {
      const file = require(`../commands/${dir}/${command}`);

      value.push({
        name: file.data.name ? file.data.name : "No Command Name",
        description: file.data.description
          ? file.data.description
          : "No Command Description",
        options: file.data.options ? file.data.options : "No Command Options",
      });
    });

    let data = new Object();

    data = {
      name: dir.toUpperCase(),
      value,
    };

    categories.push(data);
  });
  return categories;
}

function convertToLowerCase(string) {
  const lowerCaseString = string.toLowerCase();
  return lowerCaseString;
}

function convertToUpperCase(string) {
  const upperCaseString = string.toUpperCase();
  return upperCaseString;
}

function reverseString(string) {
  return string.split("").reverse().join("");
}

function returnUserStatusText(user) {
  var status_text = "";
  if (user.presence.status == "online") {
    status_text = `${emojis.online} **-** Online`;
  } else if (user.presence.status == "idle") {
    status_text = `${emojis.idle} **-** Idle/AFK`;
  } else if (user.presence.status == "dnd") {
    status_text = `${emojis.dnd} **-** Do Not Disturb`;
  } else {
    status_text = `${emojis.offline} **-** Invisible`;
  }
  return status_text;
}

function emojifyText(text) {
  var result = "";
  text = text.split("");
  var object = {
    a: "🇦",
    b: "🇧",
    c: "🇨",
    d: "🇩",
    e: "🇪",
    f: "🇫",
    g: "🇬",
    h: "🇭",
    i: "🇮",
    j: "🇯",
    k: "🇰",
    l: "🇱",
    m: "🇲",
    n: "🇳",
    o: "🇴",
    p: "🇵",
    q: "🇶",
    r: "🇷",
    s: "🇸",
    t: "🇹",
    u: "🇺",
    v: "🇻",
    w: "🇼",
    x: "🇽",
    y: "🇾",
    z: "🇿",
    " ": "🟦",
  };
  let char = "";
  text.forEach(function (c) {
    c = c.toLowerCase();
    var chars = object[c];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof object[c] !== "undefined") {
      char = object[c][rand];
      result += char;
    } else {
      char = c;
      result += char;
    }
  });
  return result;
}

module.exports = {
  getCommands,
  convertToLowerCase,
  convertToUpperCase,
  reverseString,
  returnUserStatusText,
  emojifyText,
};
