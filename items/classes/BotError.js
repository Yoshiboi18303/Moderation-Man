const colors = require("colors");

module.exports = class BotError extends Error {
  constructor(error_text, error, critical) {
    super(error_text, error, critical);
    this.error_text = error_text;
    this.error = error;
    this.critical = critical;

    if (!this.error_text || this.error_text.length <= 0)
      throw new Error(`Error text cannot be an empty string or undefined.`);
    if (!this.error) throw new Error(`This class needs an error to return.`);
    if (!this.critical)
      throw new Error("Critical error option can't be left out!");
    if (typeof this.error_text != "string")
      throw new Error(
        `Expected error text type to be a type of string, got ${typeof this
          .error_text} instead.`
      );
    if (typeof this.critical != "boolean")
      throw new Error(
        `Expected critical error type to be a type of boolean, got ${typeof this
          .critical} instead.`
      );

    const starting_text = "MM-BOT-ERROR:".red;
    // Assuming everything is good, then check if critical is true, if so, then log the error, and then exit the process. Otherwise, just log the error.
    if (this.critical == true) {
      console.error(`${starting_text} ${this.error_text}`, this.error);
      return cp.exit(1);
    } else {
      return console.error(`${starting_text}: ${this.error_text}`, this.error);
    }
  }
};
