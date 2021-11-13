const colors = require("colors");

module.exports = class BotError extends Error {
  constructor(error_text, error) {
    super(error_text, error);
    this.error_text = error_text;
    this.error = error;

    if(!this.error_text) throw new Error("This class needs some error text.")
    if(!this.error) throw new Error("This class needs an error to return.")
    if(typeof this.error_text != 'string') throw new Error(`Expected error text type to be a typeof string, got ${typeof this.error_text} instead.`)

    const starting_text = "MM-BOT-ERROR".red
    // Assuming everything is good, send a console error.
    return console.error(`${starting_text}: ${this.error_text}`, this.error);
  }
};
