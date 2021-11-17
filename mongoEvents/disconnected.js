module.exports = {
  name: "disconnected",
  once: false,
  execute() {
    var bot_name = "MODERATION-MAN".blue;
    var disconnected_text = "Disconnected from MongoDB".red;
    console.log(`${bot_name} >> ${disconnected_text}...`);
  },
};
