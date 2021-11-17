module.exports = {
  name: "disconnecting",
  once: false,
  execute() {
    var bot_name = "MODERATION-MAN".blue;
    var disconnecting_text = "Disconnecting from MongoDB".yellow;
    console.log(`${bot_name} >> ${disconnecting_text}...`);
  },
};
