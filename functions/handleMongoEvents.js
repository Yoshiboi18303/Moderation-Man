module.exports = (client) => {
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
