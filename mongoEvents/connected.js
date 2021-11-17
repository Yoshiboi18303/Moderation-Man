module.exports = {
  name: "connected",
  once: false,
  execute() {
    var bot_name = "MODERATION-MAN".blue;
    var connected_text = "Connected to MongoDB".green;
    console.log(`${bot_name} >> ${connected_text}!`);
  },
};
