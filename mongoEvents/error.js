module.exports = {
  name: "error",
  once: false,
  execute(error) {
    var bot_name = "MODERATION-MAN".blue;
    var error_text = "An error occurred during the MongoDB connection".red;
    console.log(`${bot_name} >> ${error_text}: ${error}`);
  },
};
