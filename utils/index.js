const { readdirSync } = require('fs');

function getCommands() {
  let categories = [];
  const value = [];

  readdirSync('./commands').forEach((dir) => {
    const directories = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));

    const commands = directories.map((command) => {
      const file = require(`../commands/${dir}/${command}`);

      value.push({
        name: file.data.name ? file.data.name : 'No Command Name',
        description: file.data.description ? file.data.description : 'No Command Description',
        options: file.data.options ? file.data.options : 'No Command Options'
      });
    });

    let data = new Object();

    data = {
      name: dir.toUpperCase(),
      value,
    };

    categories.push(data);
  })
  return categories;
}

function convertToLowerCase(string) {
  if(typeof string != 'string') throw new TypeError("String argument must be a type of string.")
  return string.toLowerCase()
}

function convertToUpperCase(string) {
  if(typeof string != 'string') throw new TypeError("String argument must be a type of string.")
  return string.toUpperCase()
}

module.exports = { getCommands, convertToLowerCase, convertToUpperCase }