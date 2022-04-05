const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = (client) => {
  /**
   * Handles and starts listening for events related to MongoDB
   * @param {Array<String>} eventFiles
   * @param {String} path
   */
  client.handleMongoEvents = async (eventFiles, path) => {
    for (const file of eventFiles) {
      const event = require(`../mongoEvents/${file}`);
      if (event.once) {
        mongoose.connection.once(event.name, (...args) =>
          event.execute(...args, mongoose)
        );
      } else {
        mongoose.connection.on(event.name, (...args) =>
          event.execute(...args, mongoose)
        );
      }
      client.mongoEvents.set(event.name, event);
    }
  };
};
