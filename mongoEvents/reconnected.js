module.exports = {
  name: "reconnected",
  once: false,
  execute() {
    var bot_name = "MODERATION-MAN".blue;
    var reconnected_text = "Successfully reconnected to MongoDB".green;
    console.log(`${bot_name} >> ${reconnected_text}!`);
  },
};
