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
  text = text.split("");
  var object = {
    a: ":regional_indicator_a:",
    b: ":regional_indicator_b:",
    c: ":regional_indicator_c:",
    d: ":regional_indicator_d:",
    e: ":regional_indicator_e:",
    f: ":regional_indicator_f:",
    g: ":regional_indicator_g:",
    h: ":regional_indicator_h:",
    i: ":regional_indicator_i:",
    j: ":regional_indicator_j:",
    k: ":regional_indicator_k:",
    l: ":regional_indicator_l:",
    m: ":regional_indicator_m:",
    n: ":regional_indicator_n:",
    o: ":regional_indicator_o:",
    p: ":regional_indicator_p:",
    q: ":regional_indicator_q:",
    r: ":regional_indicator_r:",
    s: ":regional_indicator_s:",
    t: ":regional_indicator_t:",
    u: ":regional_indicator_u:",
    v: ":regional_indicator_v:",
    w: ":regional_indicator_w:",
    x: ":regional_indicator_x:",
    y: ":regional_indicator_y:",
    z: ":regional_indicator_z:",
    " ": ":blue_square:",
    1: ":one:",
    2: ":two:",
    3: ":three:",
    4: ":four:",
    5: ":five:",
    6: ":six:",
    7: ":seven:",
    8: ":eight:",
    9: ":nine:",
    0: ":zero:"
  };
  let final = "";
  for(var char of text) {
    char = char.toLowerCase()
    if(!Object.keys(object).includes(char)) {
      final += char
    } else {
      final += object[char]
    }
  }
  return final;
}

module.exports = {
  getCommands,
  convertToLowerCase,
  convertToUpperCase,
  reverseString,
  returnUserStatusText,
  emojifyText,
};
