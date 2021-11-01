module.exports = (client) => {
  console.log("Registering Events...");
  client.handleEvents = async (eventFiles, path) => {
    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      if (event.once) {
        console.info(`Event "${event.name}" registered to run once!`);
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        console.info(`Event "${event.name}" registered to run always!`);
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
    console.log("Events registered!");
    console.log(
      "\n--------------------------------------------------------------\n"
    );
  };
};
